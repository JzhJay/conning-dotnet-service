using System;
using System.Collections.Generic;
using System.Linq;
using Amazon.Runtime.Internal.Transform;
using MongoDB.Bson;
using Conning.GraphQL;
using Conning.Library.Utility;

namespace Conning.GraphQL.utility
{
    public class periodCpuTime
    {
        public DateTime startTime { get; }
        public DateTime endTime { get; }
        public int numberVCpu { get; }
        public double totalCpuTime { get; }

        public periodCpuTime(DateTime startTime, DateTime endTime, int numberVCpu)
        {
            this.startTime = startTime;
            this.endTime = endTime;
            this.numberVCpu = numberVCpu;
            totalCpuTime = (endTime - startTime).TotalHours * numberVCpu;
        }

        /// <summary>
        /// This function calculates total amount of CPU hours for the partial interval defined by arguments.
        /// 1. currentStartTime == currentEndTime
        ///     1.1 sinceStartTime == true: interval between the start time of current period and currentStartTime
        ///     1.2 sinceStartTime == false: interval between currentStartTime and the end time of current period
        /// 2. currentStartTime != currentEndTime: interval between currentStartTime and currentEndTime
        /// </summary>
        /// <param name="currentStartTime"></param>
        /// <param name="currentEndTime"></param>
        /// <param name="sinceStartTime"></param>
        /// <returns></returns>
        public double getPartialCpuTime(DateTime currentStartTime, DateTime currentEndTime, bool sinceStartTime)
        {
            double resultPeriod = DateTime.Compare(currentStartTime, currentEndTime) != 0
                ?
                (currentEndTime - currentStartTime).TotalHours
                :
                sinceStartTime
                    ? (currentStartTime - startTime).TotalHours
                    :
                    (endTime - currentStartTime).TotalHours;
            return resultPeriod * numberVCpu;
        }

    }

    public class AggregateCpuTime
    {
        //                 jobId            instanceId
        private Dictionary<string, Dictionary<string, InstanceCpuTime>> _instanceCpuTimes { get; }
        //                 jobId
        private Dictionary<string, List<Tuple<DateTime, int>>> _periodCpuQuantity { get; }

        public AggregateCpuTime(List<BsonDocument> gridStates)
        {
            // "staticInstances" is a pseudo jobId since we don't know which job each instance is associated with.
            //                                 jobId            instanceId
            _instanceCpuTimes = new Dictionary<string, Dictionary<string, InstanceCpuTime>>();
            //                                 jobId
            _periodCpuQuantity = new Dictionary<string, List<Tuple<DateTime, int>>>();
            var runningInstances = new Dictionary<string, HashSet<string>>();
            gridStates.ForEach(g => processGridStatusSnapshot(g, runningInstances));
        }

        private void processGridStatusSnapshot(BsonDocument gridStatusSnapshot, Dictionary<string, HashSet<string>> runningInstances)
        {
            var timeStamp = gridStatusSnapshot["timeStamp"].AsBsonDateTime.ToUniversalTime();

            // Move staticInstances into a pretend job named "staticInstances".
            var jobsInSnapShot = new BsonArray();
            jobsInSnapShot.Add(new BsonDocument
            {
                {"jobId", "staticInstances"},
                {"instances", new BsonArray().AddRange(gridStatusSnapshot["windowsInstances"].AsBsonArray)
                                             .AddRange(gridStatusSnapshot["linuxInstances"].AsBsonArray)}
            });
            if (gridStatusSnapshot.Contains("jobs"))
            {
                jobsInSnapShot.AddRange(gridStatusSnapshot["jobs"].AsBsonArray);
            }

            jobsInSnapShot.ForEach(job =>
            {
                // initialize vars
                var jobId = job["jobId"].ToString();
                var jobInstancesInSnapShot = job["instances"].AsBsonArray;
                if (!_instanceCpuTimes.ContainsKey(jobId))
                {
                    _instanceCpuTimes[jobId] = new Dictionary<string, InstanceCpuTime>();
                }
                var jobInstanceCpuTimes = _instanceCpuTimes[jobId];
                if (!_periodCpuQuantity.ContainsKey(jobId))
                {
                    _periodCpuQuantity[jobId] = new List<Tuple<DateTime, int>>();
                    _periodCpuQuantity[jobId].Add(new Tuple<DateTime, int>(DateTime.MinValue, 0));
                }
                var periodJobCpuQuantity = _periodCpuQuantity[jobId];
                if (!runningInstances.ContainsKey(jobId))
                {
                    runningInstances[jobId] = new HashSet<string>();
                }
                var runningJobInstances = runningInstances[jobId];

                if (gridStatusSnapshot.Contains("power") && gridStatusSnapshot["power"].ToString() == "sleep")
                    jobInstancesInSnapShot = new BsonArray(); // if grid is in sleep mode, act as all instances are off
                var unprocessedInstanceIds = new HashSet<string>(runningJobInstances);
                var numberOfRunningInstancesByType = new Dictionary<string, int>();
                jobInstancesInSnapShot.ForEach(instance =>
                {
                    var instanceId = instance["instanceId"].ToString();
                    var instanceType = instance["instanceType"].ToString();

                    if (jobInstanceCpuTimes.ContainsKey(instanceId)) // existing instance
                    {
                        if (!runningJobInstances.Contains(instanceId)) // previously off
                        {
                            jobInstanceCpuTimes[instanceId].addTime(timeStamp, instanceType);
                            runningJobInstances.Add(instanceId);
                        }
                        else // previously on
                        {
                            unprocessedInstanceIds.Remove(instanceId);
                            // To change the type of the instance, you need to power it off, change type and power it back on.
                            // In theory there should be a grid status snapshot indicating the instance is off but this is not guaranteed
                            // because WindowsEC2Manager is polling every 30 seconds. If this process finishes within 30 seconds, there is a chance
                            // that there is no off grid status snapshot. This circumstance is recognized by having "on" state for 2 consecutive
                            // grid status snapshots but different instance type.
                            if (instanceType != jobInstanceCpuTimes[instanceId].periods.Last().instanceType)
                            {
                                jobInstanceCpuTimes[instanceId].addStopTime(timeStamp);
                                jobInstanceCpuTimes[instanceId].addTime(timeStamp, instanceType);
                            }
                        }
                    }
                    else // new instance
                    {
                        jobInstanceCpuTimes.Add(instanceId, new InstanceCpuTime(instanceId, instanceType, timeStamp));
                        runningJobInstances.Add(instanceId);
                    }


                    if (!numberOfRunningInstancesByType.ContainsKey(instanceType))
                    {
                        numberOfRunningInstancesByType[instanceType] = 0;
                    }

                    numberOfRunningInstancesByType[instanceType] += 1;

                });

                unprocessedInstanceIds.ForEach(id =>
                {
                    jobInstanceCpuTimes[id].addStopTime(timeStamp);
                    runningJobInstances.Remove(id);
                });

                var numberVCpus = numberOfRunningInstancesByType
                    .Select(s => getVCpuQuantity(s.Key, numberOfRunningInstancesByType[s.Key])).Sum();

                if (!periodJobCpuQuantity.Any() || periodJobCpuQuantity.Last().Item2 != numberVCpus)
                    periodJobCpuQuantity.Add(Tuple.Create(timeStamp, numberVCpus));

            });
        }
        
        public Tuple<Dictionary<string, double>, int> getAggregateCpuTimeAndQuantity(BillingInfo simulationChargeTimes, String jobId)
        {
            var cpuHourByType = new Dictionary<string, double>();
            var numberCpuPerInstanceByType = new Dictionary<string, int>();

            getAggregateCpuTimeAndQuantity(cpuHourByType, numberCpuPerInstanceByType, "staticInstances",
                simulationChargeTimes.computationAdjustedStartTime, simulationChargeTimes.computationAdjustedEndTime,
                simulationChargeTimes.adjustStaticForReportStartTime ? (DateTime?)simulationChargeTimes.startTime : null);

            if (_instanceCpuTimes.ContainsKey(jobId))
            {
                getAggregateCpuTimeAndQuantity(cpuHourByType, numberCpuPerInstanceByType, jobId,
                    simulationChargeTimes.computationJobStartTime, simulationChargeTimes.computationJobEndTime,
                    simulationChargeTimes.adjustDynamicForReportStartTime ? (DateTime?)simulationChargeTimes.startTime : null);
            }

            var resultCPUQuantity = sumMaximumCpuQuantity(simulationChargeTimes.computationAdjustedStartTime, simulationChargeTimes.computationAdjustedEndTime, jobId);

            return Tuple.Create(cpuHourByType, resultCPUQuantity);
        }

        private void getAggregateCpuTimeAndQuantity(
            Dictionary<string, double> cpuHourByType, Dictionary<string, int> numberCpuPerInstanceByType, String jobId,
            DateTime startTime, DateTime endTime, DateTime? simulationStartTime = null)
        {
            // if(!_instanceCpuTimes.ContainsKey(jobId))
            // {
            //     return;
            // }
            _instanceCpuTimes[jobId].ForEach(s =>
            {
                var cpuHourByTypeSinglePeriod = s.Value.getCpuTimeAndType(startTime, endTime, simulationStartTime);
                cpuHourByTypeSinglePeriod.ForEach(t =>
                {
                    if (!cpuHourByType.ContainsKey(t.Key))
                    {
                        cpuHourByType.Add(t.Key, 0.0);
                        numberCpuPerInstanceByType.Add(t.Key, getVCpuQuantity(t.Key, 1));
                    }
                    cpuHourByType[t.Key] += t.Value * numberCpuPerInstanceByType[t.Key];
                });
            });
        }

        private int sumMaximumCpuQuantity(DateTime startTime, DateTime endTime, String jobId)
        {
            var result = getMaximumCpuQuantity(startTime, endTime, "staticInstances");
            if (_periodCpuQuantity.ContainsKey(jobId))
            {
                result += getMaximumCpuQuantity(startTime, endTime, jobId);
            }
            return result;
        }

        private int getMaximumCpuQuantity(DateTime startTime, DateTime endTime, String jobId)
        {
            var index = 0;
            // if(!_periodCpuQuantity.ContainsKey(jobId))
            // {
            //     return 0;
            // }
            var periodCpuQuantity = _periodCpuQuantity[jobId];
            while (index < periodCpuQuantity.Count - 1)
            {
                if (DateTime.Compare(startTime, periodCpuQuantity[index].Item1) >= 0 &&
                    DateTime.Compare(startTime, periodCpuQuantity[index + 1].Item1) <= 0) break;
                index += 1;
            }

            if (index == periodCpuQuantity.Count - 1) return periodCpuQuantity.Last().Item2;

            var startIndex = index;
            var result = periodCpuQuantity[startIndex].Item2;

            while (index < periodCpuQuantity.Count)
            {
                if (DateTime.Compare(endTime, periodCpuQuantity[index].Item1) <= 0) break;
                result = Math.Max(periodCpuQuantity[index].Item2, result);
                index += 1;
            }

            return result;
        }

        /// <summary>
        /// This function extracts the number of vCPUs given EC2 instance type.
        /// </summary>
        /// <param name="instanceType"></param>
        /// <param name="instanceQuantity"></param>
        /// <returns></returns>
        private int getVCpuQuantity(string instanceType, int instanceQuantity)
        {
            var memoryType = instanceType.Split(".")[1];
            var vCPUperInstance = 1;
            var xlargeIndex = memoryType.IndexOf("xlarge");
            if (memoryType == "medium" || memoryType == "large")
            {
                vCPUperInstance = 2;

            }
            else if (xlargeIndex == -1)
            {
                vCPUperInstance = 1;
            }
            else
            {
                var multiplier = xlargeIndex == 0 ? 1 : Int32.Parse(memoryType.Substring(0, xlargeIndex));
                vCPUperInstance = 4 * multiplier;
            }

            return instanceQuantity * vCPUperInstance;
        }

//        public void adjustStartEndTime(List<Tuple<DateTime, DateTime>> startEndTimes)
//        {
//            var gridStatusIndex = 0;
//            for (var i = 0; i < startEndTimes.Count - 1; ++i)
//            {
//                if (DateTime.Compare(startEndTimes[i].Item2, startEndTimes[i + 1].Item1) < 0)
//                {
//                    var resultIndex = getIndexOfFirstItemInRange(startEndTimes[i].Item2, startEndTimes[i + 1].Item1,
//                        gridStatusIndex);
//
//                    startEndTimes[i] = Tuple.Create(startEndTimes[i].Item1,
//                        resultIndex != -1 ? periodCpuTimes[resultIndex].startTime : startEndTimes[i + 1].Item1);
//
//                    gridStatusIndex = resultIndex == -1 ? gridStatusIndex : resultIndex;
//                }
//            }
//
//            startEndTimes[startEndTimes.Count - 1] = Tuple.Create(startEndTimes.Last().Item1,
//                DateTime.Compare(startEndTimes.Last().Item2, periodCpuTimes.Last().startTime) > 0
//                    ? DateTime.MaxValue
//                    : periodCpuTimes.Last().startTime);
//        }
//
//        private int getIndexOfFirstItemInRange(DateTime d1, DateTime d2, int startIndex)
//        {
//            var result = -1;
//            while (startIndex < periodCpuTimes.Count)
//            {
//                if (DateTime.Compare(d1, periodCpuTimes[startIndex].startTime) > 0)
//                {
//                    startIndex += 1;
//                }
//                else if (DateTime.Compare(d1, periodCpuTimes[startIndex].startTime) <= 0 &&
//                         DateTime.Compare(periodCpuTimes[startIndex].startTime, d2) <= 0)
//                {
//                    result = startIndex;
//                    break;
//                }
//                else break;
//            }
//
//            return result;
//        }
    }
}

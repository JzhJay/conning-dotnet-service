using System;
using System.Collections.Generic;
using System.Linq;

namespace Conning.GraphQL.utility
{
    public class TimePeriod
    {
        public DateTime startTime { get; set; }
        public DateTime endTime { get; set; }
        public string instanceType { get; set; }

        public TimePeriod(DateTime startTime, DateTime endTime, string type)
        {
            this.startTime = startTime;
            this.endTime = endTime;
            this.instanceType = type;
        }
    }

    public class InstanceCpuTime
    {
        public string id { get; }
        public List<TimePeriod> periods { get; }

        public InstanceCpuTime(string id, string instanceType, DateTime startTime)
        {
            this.id = id;
            periods = new List<TimePeriod>
            {
                new TimePeriod(startTime, DateTime.MaxValue, instanceType)
            };
        }

        public void addTime(DateTime t, string instanceType)
        {
            var lastPeriod = periods.Last();
            if (DateTime.Compare(lastPeriod.endTime, DateTime.MaxValue) == 0)
            {
                lastPeriod.endTime = t;
            }
            else
            {
                periods.Add(new TimePeriod(t, DateTime.MaxValue, instanceType));
            }
        }

        public void addStopTime(DateTime t)
        {
            var lastPeriod = periods.Last();
            lastPeriod.endTime = t;
        }

        /// <summary>
        /// This function gets total running time of instance within the given interval and round up to nearest hour.
        /// If adjustStartingPeriod is true, the query start time will be adjusted to the nearest time where the interval between
        /// instance power on time and this time will be an integer hour.
        /// </summary>
        /// <param name="queryStartTime"></param>
        /// <param name="queryEndTime"></param>
        /// <param name="adjustStartingPeriod"></param>
        /// <returns></returns>
        public Dictionary<string, double> getCpuTimeAndType(DateTime queryStartTime, DateTime queryEndTime, DateTime? simulationStartTime = null)
        {
            int startIndex = -1, index = 0;
            var result = new Dictionary<string, double>();
            var adjustedQueryStartTime = queryStartTime;
            while (index < periods.Count && DateTime.Compare(queryEndTime, periods[index].startTime) > 0)
            {
                if (startIndex == -1)
                {
                    if (DateTime.Compare(queryStartTime, periods[index].endTime) < 0)
                    {
                        startIndex = index;
                        if (DateTime.Compare(queryStartTime, periods[index].startTime) > 0 && simulationStartTime.HasValue)
                        {
                            var benchmarkStartTime =
                                DateTime.Compare(periods[index].startTime, simulationStartTime.Value) > 0
                                    ? periods[index].startTime
                                    : simulationStartTime.Value;
                            adjustedQueryStartTime = benchmarkStartTime
                                .AddHours(Math.Ceiling((adjustedQueryStartTime - benchmarkStartTime).TotalHours));
                        }
                    }
                    else index += 1;
                }
                else
                {
                    var adjustedStartTime = periods[index].startTime;
                    var periodInstanceType = periods[index].instanceType;
                    var adjustedEndTime = DateTime.Compare(queryEndTime, periods[index].endTime) > 0
                        ? periods[index].endTime
                        : queryEndTime;
                    if (index == startIndex)
                    {
                        adjustedStartTime = DateTime.Compare(adjustedStartTime, adjustedQueryStartTime) > 0
                            ? adjustedStartTime
                            : adjustedQueryStartTime;

                    }

                    if (!result.ContainsKey(periodInstanceType)) result[periodInstanceType] = 0.0;
                    result[periodInstanceType] += Math.Ceiling((adjustedEndTime - adjustedStartTime).TotalHours);
                    index += 1;
                }
            }

            return result;
        }
    }
}

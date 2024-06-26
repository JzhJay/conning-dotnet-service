using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;
using Conning.GraphQL.utility;
using MongoDB.Bson;

namespace Conning.GraphQL.Tests
{
    public class SimulationFactoryTest
    {
        public SimulationFactoryTest(){}


        private List<BsonDocument> CreateTestData(Tuple<DateTime, DateTime>[] data)
        {
            var result = new List<BsonDocument>();
            foreach (var tuple in data)
            {
                result.Add(new BsonDocument
                {
                    {"billingInformation", new BsonDocument
                    {
                        {"startTime", BsonValue.Create((Int32)(tuple.Item1 - new DateTime(1970, 1, 1)).TotalSeconds)},
                        {"simulationWorkerEndTime", BsonValue.Create((Int32)(tuple.Item2 - new DateTime(1970, 1, 1)).TotalSeconds)},
                    }}
                });
                if (DateTime.Compare(tuple.Item2, DateTime.MinValue) == 0)
                {
                    result.Last()["billingInformation"].AsBsonDocument.Remove("simulationWorkerEndTime");
                }
            }

            return result;
        }

        private bool compareListTupleDateTime(List<Tuple<DateTime, DateTime>> a, Tuple<DateTime, DateTime>[] b)
        {
            for (var i = 0; i < a.Count; ++i)
            {
                if (DateTime.Compare(a[i].Item1, b[i].Item1) != 0 || DateTime.Compare(a[i].Item2, b[i].Item2) != 0)
                {
                    return false;
                }
            }

            return true;
        }
        
        [Fact]
        public void SortSimulationTest()
        {
            var simulationTestData = CreateTestData(new Tuple<DateTime, DateTime>[]
            {
                Tuple.Create(new DateTime(2000, 1, 1, 1, 0, 0, 0), new DateTime(2000, 1, 1, 1, 5, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 10, 0, 0), new DateTime(2000, 1, 1, 1, 15, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 15, 0, 0), new DateTime(2000, 1, 1, 1, 20, 0, 0)),
            });
            var benchmark = new Tuple<DateTime, DateTime>[]
            {
                Tuple.Create(new DateTime(2000, 1, 1, 1, 0, 0, 0), new DateTime(2000, 1, 1, 1, 5, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 10, 0, 0), new DateTime(2000, 1, 1, 1, 15, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 15, 0, 0), new DateTime(2000, 1, 1, 1, 20, 0, 0)),
            };
            var result = SimulationFactory.extractAndSortJobStartEndTime(simulationTestData);

            Assert.True(compareListTupleDateTime(result, benchmark),
                "should not modify anything if there is no overlap");    
            
            simulationTestData = CreateTestData(new Tuple<DateTime, DateTime>[]
            {
                Tuple.Create(new DateTime(2000, 1, 1, 1, 0, 0, 0), new DateTime(2000, 1, 1, 1, 10, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 5, 0, 0), new DateTime(2000, 1, 1, 1, 15, 0, 0)),
            });
            benchmark = new Tuple<DateTime, DateTime>[]
            {
                Tuple.Create(new DateTime(2000, 1, 1, 1, 0, 0, 0), new DateTime(2000, 1, 1, 1, 10, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 5, 0, 0), new DateTime(2000, 1, 1, 1, 15, 0, 0)),
            };
            result = SimulationFactory.extractAndSortJobStartEndTime(simulationTestData);

            Assert.True(compareListTupleDateTime(result, benchmark),
                "should modify start time of second job if second job is partially overlapped with first job");  
            
            simulationTestData = CreateTestData(new Tuple<DateTime, DateTime>[]
            {
                Tuple.Create(new DateTime(2000, 1, 1, 1, 0, 0, 0), new DateTime(2000, 1, 1, 1, 10, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 5, 0, 0), new DateTime(2000, 1, 1, 1, 6, 0, 0)),
            });
            benchmark = new Tuple<DateTime, DateTime>[]
            {
                Tuple.Create(new DateTime(2000, 1, 1, 1, 0, 0, 0), new DateTime(2000, 1, 1, 1, 10, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 10, 0, 0), new DateTime(2000, 1, 1, 1, 10, 0, 0)),
            };
            result = SimulationFactory.extractAndSortJobStartEndTime(simulationTestData);

            Assert.True(compareListTupleDateTime(result, benchmark),
                "should modify start and end time of second job if second job is completely overlapped with first job");
            
            simulationTestData = CreateTestData(new Tuple<DateTime, DateTime>[]
            {
                Tuple.Create(new DateTime(2000, 1, 1, 1, 0, 0, 0), new DateTime(2000, 1, 1, 1, 10, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 5, 0, 0), new DateTime(2000, 1, 1, 1, 15, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 6, 0, 0), new DateTime(2000, 1, 1, 1, 16, 0, 0)),
            });
            benchmark = new Tuple<DateTime, DateTime>[]
            {
                Tuple.Create(new DateTime(2000, 1, 1, 1, 0, 0, 0), new DateTime(2000, 1, 1, 1, 10, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 5, 0, 0), new DateTime(2000, 1, 1, 1, 15, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 6, 0, 0), new DateTime(2000, 1, 1, 1, 16, 0, 0)),
            };
            result = SimulationFactory.extractAndSortJobStartEndTime(simulationTestData);

            Assert.True(compareListTupleDateTime(result, benchmark),
                "should modify start time accordingly if multiple jobs are partially overlapped");
            
            simulationTestData = CreateTestData(new Tuple<DateTime, DateTime>[]
            {
                Tuple.Create(new DateTime(2000, 1, 1, 1, 0, 0, 0), new DateTime(2000, 1, 1, 1, 10, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 5, 0, 0), new DateTime(2000, 1, 1, 1, 9, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 6, 0, 0), new DateTime(2000, 1, 1, 1, 8, 0, 0)),
            });
            benchmark = new Tuple<DateTime, DateTime>[]
            {
                Tuple.Create(new DateTime(2000, 1, 1, 1, 0, 0, 0), new DateTime(2000, 1, 1, 1, 10, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 10, 0, 0), new DateTime(2000, 1, 1, 1, 10, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 10, 0, 0), new DateTime(2000, 1, 1, 1, 10, 0, 0)),
            };
            result = SimulationFactory.extractAndSortJobStartEndTime(simulationTestData);

            Assert.True(compareListTupleDateTime(result, benchmark),
                "should modify start time accordingly if multiple jobs are completely overlapped");
            
            simulationTestData = CreateTestData(new Tuple<DateTime, DateTime>[]
            {
                Tuple.Create(new DateTime(2000, 1, 1, 1, 0, 0, 0), new DateTime(2000, 1, 1, 1, 10, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 5, 0, 0), new DateTime(2000, 1, 1, 1, 9, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 6, 0, 0), new DateTime(2000, 1, 1, 1, 11, 0, 0)),
            });
            benchmark = new Tuple<DateTime, DateTime>[]
            {
                Tuple.Create(new DateTime(2000, 1, 1, 1, 0, 0, 0), new DateTime(2000, 1, 1, 1, 10, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 10, 0, 0), new DateTime(2000, 1, 1, 1, 10, 0, 0)),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 6, 0, 0), new DateTime(2000, 1, 1, 1, 11, 0, 0)),
            };
            result = SimulationFactory.extractAndSortJobStartEndTime(simulationTestData);

            Assert.True(compareListTupleDateTime(result, benchmark),
                "should modify start time accordingly if multiple jobs are completely or partially overlapped");
            
        }

        [Fact]
        public void OnGoingJobTest()
        {
            var simulationTestData = CreateTestData(new Tuple<DateTime, DateTime>[]
            {
                Tuple.Create(new DateTime(2000, 1, 1, 1, 0, 0, 0), DateTime.MinValue),
            });
            var benchmark = new Tuple<DateTime, DateTime>[]
            {
                Tuple.Create(new DateTime(2000, 1, 1, 1, 0, 0, 0), DateTime.MaxValue),
            };
            var result = SimulationFactory.extractAndSortJobStartEndTime(simulationTestData);

            Assert.True(compareListTupleDateTime(result, benchmark),
                "should set end time to DateTime.MaxValue if job is still running");
            
            simulationTestData = CreateTestData(new Tuple<DateTime, DateTime>[]
            {
                Tuple.Create(new DateTime(2000, 1, 1, 1, 0, 0, 0), DateTime.MinValue),
                Tuple.Create(new DateTime(2000, 1, 1, 1, 5, 0, 0), new DateTime(2000, 1, 1, 1, 9, 0, 0)),
            });
            benchmark = new Tuple<DateTime, DateTime>[]
            {
                Tuple.Create(new DateTime(2000, 1, 1, 1, 0, 0, 0), DateTime.MaxValue),
                Tuple.Create(DateTime.MaxValue, DateTime.MaxValue),
            };
            result = SimulationFactory.extractAndSortJobStartEndTime(simulationTestData);

            Assert.True(compareListTupleDateTime(result, benchmark),
                "should set start and end time to DateTime.MaxValue if previous job is still running");
        }
    }
}
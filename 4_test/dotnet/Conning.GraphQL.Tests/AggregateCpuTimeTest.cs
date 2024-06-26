using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;
using Conning.GraphQL.utility;
using Conning.Library.Utility;
using MongoDB.Bson;


namespace Conning.GraphQL.Tests
{
    public class TestData : IDisposable
    {
        public List<BsonDocument> gridStates { get; private set; }

        public TestData()
        {
            gridStates = new List<BsonDocument>();
            var fakeInstanceIds1 = new BsonDocument[3];
            var fakeInstanceIds3 = new BsonDocument[2];
            Enumerable.Range(1, 3).ForEach(i =>
            {
                fakeInstanceIds1[i - 1] = new BsonDocument
                {
                    {"instanceId", i},
                    {"instanceType", "r4.8xlarge"},
                    {"hostname", "fake_host_name"}
                };
            });
            Enumerable.Range(1, 2).ForEach(i =>
            {
                fakeInstanceIds3[i - 1] = new BsonDocument
                {
                    {"instanceId", i + 10},
                    {"instanceType", "r4.4xlarge"},
                    {"hostname", "fake_host_name"}
                };
            });
            var fakeInstanceIds2 = new BsonArray();
            gridStates.Add(new BsonDocument
            {
                {"windowsInstances", new BsonArray(fakeInstanceIds1)},
                {"linuxInstances", fakeInstanceIds2},
                {"timeStamp", new BsonDateTime(new DateTime(2000, 1, 1, 1, 0, 0)).AsBsonValue},
            });
            gridStates.Add(new BsonDocument
            {
                {"windowsInstances", fakeInstanceIds2},
                {"linuxInstances", fakeInstanceIds2},
                {"timeStamp", new BsonDateTime(new DateTime(2000, 1, 1, 2, 0, 0)).AsBsonValue},
            });
            gridStates.Add(new BsonDocument
            {
                {"windowsInstances", new BsonArray(fakeInstanceIds1)},
                {"linuxInstances", fakeInstanceIds2},
                {"jobs", new BsonArray().Add(new BsonDocument
                    {
                        {"jobId", "fakeJobId"},
                        {"instances", new BsonArray(fakeInstanceIds3)}
                    })
                },
                {"timeStamp", new BsonDateTime(new DateTime(2000, 1, 1, 3, 0, 0)).AsBsonValue},
            });
            gridStates.Add(new BsonDocument
            {
                {"windowsInstances", fakeInstanceIds2},
                {"linuxInstances", fakeInstanceIds2},
                {"jobs", new BsonArray().Add(new BsonDocument
                    {
                        {"jobId", "fakeJobId"},
                        {"instances", fakeInstanceIds2}
                    })
                },
                {"timeStamp", new BsonDateTime(new DateTime(2000, 1, 1, 4, 0, 0)).AsBsonValue},
            });
            gridStates.Add(new BsonDocument
            {
                {"windowsInstances", new BsonArray(fakeInstanceIds3)},
                {"linuxInstances", fakeInstanceIds2},
                {"jobs", new BsonArray().Add(new BsonDocument
                    {
                        {"jobId", "fakeJobId"},
                        {"instances", new BsonArray(fakeInstanceIds3)}
                    })
                },
                {"timeStamp", new BsonDateTime(new DateTime(2000, 1, 1, 5, 0, 0)).AsBsonValue},
            });
        }
        
        public void Dispose()
        {
            
        }
    }
    
    public class AggregateCpuTimeTest : IClassFixture<TestData>
    {
        private readonly AggregateCpuTime _test;
        private List<BsonDocument> gridStates{ get;}
        private const double TOLERANCE = 0.0001;

        public AggregateCpuTimeTest(TestData testData)
        {
            gridStates = testData.gridStates;
            _test = new AggregateCpuTime(gridStates);
        }
        
        [Fact]
        public void InitialStateTest()
        {
            Assert.True(5 == gridStates.Count, "should have 3 entries in test data");
        }

        [Fact]
        public void GetAggregateCpuTimeTest()
        {
            var result = _test.getAggregateCpuTimeAndQuantity(BillingInfo( new DateTime(2000, 1, 1, 1, 5, 0).ToUniversalTime(),
                new DateTime(2000, 1, 1, 1, 35, 0).ToUniversalTime()), "fakeJobId");
            Assert.True(result.Item1.First().Value == 96, "should return correct value if both start time and end time are in one grid status period");

            result = _test.getAggregateCpuTimeAndQuantity(BillingInfo(new DateTime(2000, 1, 1, 1, 5, 0).ToUniversalTime(),
                new DateTime(2000, 1, 1, 2, 5, 0).ToUniversalTime()), "fakeJobId");
            Assert.True(result.Item1.First().Value == 96, "should return correct value if end time is in power off interval");

            result = _test.getAggregateCpuTimeAndQuantity(BillingInfo(new DateTime(2000, 1, 1, 1, 0, 0).ToUniversalTime(),
                new DateTime(2000, 1, 1, 4, 0, 0).ToUniversalTime()), "fakeJobId");
            Assert.True(result.Item1.Count == 2, "should return 2 entries since there are 2 types of instances");
            Assert.True(result.Item1["r4.8xlarge"] == 192, "should return correct value if both start time and end time are the same as start/end time and grid status periods");
            Assert.True(result.Item1["r4.4xlarge"] == 32, "should have correct value for each types of instance");

            result = _test.getAggregateCpuTimeAndQuantity(BillingInfo(new DateTime(2000, 1, 1, 0, 30, 0).ToUniversalTime(),
                new DateTime(2000, 1, 1, 2, 0, 0).ToUniversalTime()), "fakeJobId");
            Assert.True(result.Item1.First().Value == 96, "should return correct value if start time is earlier than the earliest timestamp of grid status periods");

            result = _test.getAggregateCpuTimeAndQuantity(BillingInfo(new DateTime(2000, 1, 1, 0, 30, 0).ToUniversalTime(),
                new DateTime(2000, 1, 1, 5, 30, 0).ToUniversalTime()), "fakeJobId");
            Assert.True(result.Item1.Count == 2, "should return 2 entries since there are 2 types of instances");
            Assert.True(result.Item1["r4.8xlarge"] == 192 && result.Item1["r4.4xlarge"] == 96, "should have correct value for each types of instance");
        }

        private BillingInfo BillingInfo(DateTime startTime, DateTime endTime)
        {
            return new BillingInfo(startTime, endTime, startTime, endTime, startTime, endTime, DateTime.MaxValue, "Complete", 10.0, 10.0);
        }
//
//        [Fact]
//        public void RunningJobStartEndTimeTest()
//        {
//            var startEndTimes = new List<Tuple<DateTime, DateTime>>(new Tuple<DateTime, DateTime>[]
//            {
//                Tuple.Create(new DateTime(2000, 1, 1, 1, 5, 0).ToUniversalTime(), new DateTime(2000, 1, 1, 1, 10, 0).ToUniversalTime()),
//                Tuple.Create(new DateTime(2000, 1, 1, 1, 15, 0).ToUniversalTime(), DateTime.MaxValue)
//            });
//            _test.adjustStartEndTime(startEndTimes);
//            Assert.True(DateTime.Compare(startEndTimes[1].Item2, DateTime.MaxValue) == 0, "should set end time of last job to DateTime.MaxValue if the last job is still running");
//            
//            startEndTimes = new List<Tuple<DateTime, DateTime>>(new Tuple<DateTime, DateTime>[]
//            {
//                Tuple.Create(new DateTime(2000, 1, 1, 1, 5, 0).ToUniversalTime(), DateTime.MaxValue),
//                Tuple.Create(DateTime.MaxValue, DateTime.MaxValue)
//            });
//            _test.adjustStartEndTime(startEndTimes);
//            Assert.True(DateTime.Compare(startEndTimes[0].Item2, DateTime.MaxValue) == 0, "should set end time of the job to DateTime.MaxValue if the job is still running");
//            Assert.True(DateTime.Compare(startEndTimes[1].Item1, DateTime.MaxValue) == 0, "should not modify start time of second job if first job is still running");
//            Assert.True(DateTime.Compare(startEndTimes[1].Item2, DateTime.MaxValue) == 0, "should not modify end time of second job if first job is still running");
//        }
        
    }
}
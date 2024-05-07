using System;
using System.Linq;
using Xunit;
using Conning.GraphQL.utility;
using Conning.Library.Utility;

namespace Conning.GraphQL.Tests
{
    public class InstanceCpuTimeTest
    {
        private DateTime[] testData { get; }
        private InstanceCpuTime _instanceCpuTime { get; }
        private InstanceCpuTime _instanceCpuTime2 { get; }
        
        public InstanceCpuTimeTest()
        {
            testData = new DateTime[]
            {
                new DateTime(2018, 10, 1, 1, 0, 0), 
                new DateTime(2018, 10, 1, 2, 0, 0),
                new DateTime(2018, 10, 1, 3, 0, 0),
                new DateTime(2018, 10, 1, 4, 0, 0),
                new DateTime(2018, 10, 1, 5, 0, 0),
                new DateTime(2018, 10, 1, 6, 0, 0),
                new DateTime(2018, 10, 1, 7, 0, 0)
            };
            
            _instanceCpuTime = new InstanceCpuTime("1", "fake type", testData[0]);
            Enumerable.Range(1, 3).ForEach(x => _instanceCpuTime.addTime(testData[x], "fake type")); 
            Enumerable.Range(4, 3).ForEach(x => _instanceCpuTime.addTime(testData[x], "fake type 2"));
            
            _instanceCpuTime2 = new InstanceCpuTime("1", "fake type", testData[0]);
            Enumerable.Range(1, 2).ForEach(x => _instanceCpuTime2.addTime(testData[x], "fake type"));
            _instanceCpuTime2.addStopTime(testData[3]);
            _instanceCpuTime2.addTime(testData[3], "fake type 2");
            _instanceCpuTime2.addTime(testData[4], "fake type 2");
        }

        [Fact]
        public void constructorTest()
        {
            var instanceTime = new InstanceCpuTime("1", "fake type", testData[0]);
            Assert.True(instanceTime.periods.Count == 1, "should have only 1 element in period list");
            Assert.True(DateTime.Compare(instanceTime.periods[0].startTime, testData[0]) == 0,
                "should have correct start time");
            Assert.True(DateTime.Compare(instanceTime.periods[0].endTime, DateTime.MaxValue) == 0,
                "should have DateTime.MaxValue as end time");
            
            instanceTime.addTime(testData[1], "fake type");
            Assert.True(instanceTime.periods.Count == 1, "should have only 1 element in period list");
            Assert.True(DateTime.Compare(instanceTime.periods[0].endTime, testData[1]) == 0,
                "should have correct end time");
            
            instanceTime.addTime(testData[2], "fake type");
            Assert.True(instanceTime.periods.Count == 2, "should have 2 elements in period list");
            Assert.True(DateTime.Compare(instanceTime.periods[1].startTime, testData[2]) == 0,
                "should have correct start time");
            Assert.True(DateTime.Compare(instanceTime.periods[1].endTime, DateTime.MaxValue) == 0,
                "should have DateTime.MaxValue as end time");
        }

        [Fact]
        public void getCpuTimeTest()
        {
            var instanceType = "fake type";
            var instanceType2 = "fake type 2";
            var result = _instanceCpuTime.getCpuTimeAndType(new DateTime(2018, 10, 1, 1, 10, 0),
                new DateTime(2018, 10, 1, 1, 15, 0));
            Assert.True(result[instanceType] == 1.0, "should round up to 1 hour if query interval is less than 1 hour (query ends before instance power off)");
            
            result = _instanceCpuTime.getCpuTimeAndType(new DateTime(2018, 10, 1, 1, 10, 0),
                new DateTime(2018, 10, 1, 2, 15, 0));
            Assert.True(result[instanceType] == 1.0, "should round up to 1 hour if query interval is less than 1 hour (query ends after instance power off)");
            
            result = _instanceCpuTime.getCpuTimeAndType(new DateTime(2018, 10, 1, 1, 10, 0),
                new DateTime(2018, 10, 1, 3, 1, 0));
            Assert.True(result[instanceType] == 2.0, "should round up to 2 hours if query interval is more than 1 hour (query expands to multiple periods)");
            
            result = _instanceCpuTime.getCpuTimeAndType(new DateTime(2018, 10, 1, 2, 10, 0),
                new DateTime(2018, 10, 1, 2, 11, 0));
            Assert.True(!result.Any(), "should return 0 if query the interval when instance is powered off");
            
            result = _instanceCpuTime.getCpuTimeAndType(new DateTime(2018, 10, 1, 0, 10, 0),
                new DateTime(2018, 10, 1, 0, 11, 0));
            Assert.True(!result.Any(), "should return 0 if query the interval before instance is powered on");
            
            result = _instanceCpuTime.getCpuTimeAndType(new DateTime(2018, 10, 1, 5, 10, 0),
                new DateTime(2018, 10, 1, 7, 11, 0));
            Assert.True(result[instanceType2] == 2.0 && result.Count == 1, "should have correct value if query interval is in last open time interval");
            
            result = _instanceCpuTime.getCpuTimeAndType(new DateTime(2018, 10, 1, 5, 10, 0),
                new DateTime(2018, 10, 1, 7, 11, 0), new DateTime(2018, 10, 1, 5, 9, 0));
            Assert.True(result[instanceType2] == 1.0 && result.Count == 1, "should have correct value if query interval is in last open time interval and doing adjustStartTime");
            
            result = _instanceCpuTime.getCpuTimeAndType(new DateTime(2018, 10, 1, 6, 0, 0),
                new DateTime(2018, 10, 1, 7, 11, 0), new DateTime(2018, 10, 1, 5, 9, 0));
            Assert.True(result[instanceType2] == 1.0 && result.Count == 1, "should have correct value if query interval is in last open time interval and doing adjustStartTime2");
            
            result = _instanceCpuTime.getCpuTimeAndType(new DateTime(2018, 10, 1, 6, 11, 0),
                new DateTime(2018, 10, 1, 7, 12, 0), new DateTime(2018, 10, 1, 5, 12, 0));
            Assert.True(result[instanceType2] == 1.0 && result.Count == 1, "should have correct value if query interval is in last open time interval and doing adjustStartTime3");
            
            result = _instanceCpuTime.getCpuTimeAndType(new DateTime(2018, 10, 1, 6, 11, 0),
                new DateTime(2018, 10, 1, 7, 12, 0), new DateTime(2018, 10, 1, 5, 11, 0));
            Assert.True(result[instanceType2] == 1.0 && result.Count == 1, "should have correct value if query interval is in last open time interval and doing adjustStartTime4");
            
            result = _instanceCpuTime.getCpuTimeAndType(new DateTime(2018, 10, 1, 6, 0, 0),
                new DateTime(2018, 10, 1, 7, 11, 0), new DateTime(2018, 10, 1, 5, 0, 0));
            Assert.True(result[instanceType2] == 1.0 && result.Count == 1, "should have correct value if query interval is in last open time interval and doing adjustStartTime5");
        }

        [Fact]
        public void getCpuTimeTestConsecutiveGridStatus()
        {
            var instanceType = "fake type";
            var instanceType2 = "fake type 2";
            
            var result = _instanceCpuTime2.getCpuTimeAndType(new DateTime(2018, 10, 1, 3, 10, 0),
                new DateTime(2018, 10, 1, 3, 15, 0));
            Assert.True(result[instanceType] == 1.0, "should round up to 1 hour if query interval is less than 1 hour (query ends before instance power off)");
            
            result = _instanceCpuTime2.getCpuTimeAndType(new DateTime(2018, 10, 1, 3, 10, 0),
                new DateTime(2018, 10, 1, 4, 15, 0));
            Assert.True(result[instanceType] == 1.0 && result[instanceType2] == 1.0, "should have 2 entries if querying 2 different instance types");

        }
    }
}
using System;
using Conning.GraphQL.utility;
using Xunit;

namespace Conning.GraphQL.Tests
{
    public class QuerySessionChargeTest
    {
        private DateTime startTime { get; }
        private DateTime endTime { get; }
        private DateTime deletedTime { get; }
        public QuerySessionChargeTest()
        {
            startTime = new DateTime(2018, 10, 1, 1, 0, 0);
            endTime = startTime.AddMinutes(5);
            deletedTime = DateTime.MaxValue;
        }



        [Fact]
        public void userQuerySessionChargeTest()
        {
            var testUserQuerySessionCharge = new UserQuerySessionCharge(startTime, endTime, "testUser");
            var newSessionStartTime = new DateTime(2018, 10, 1, 1, 0, 0);
            var newSessionEndTime = new DateTime(2018, 10, 1, 2, 0, 0);
            Assert.True(testUserQuerySessionCharge.sessionCount == 1, "should have 1 session upon creation");

            testUserQuerySessionCharge.addQuerySession(newSessionStartTime, newSessionEndTime);
            Assert.True(testUserQuerySessionCharge.sessionCount == 2, "should have 2 sessions after adding one");
            Assert.True(testUserQuerySessionCharge.sessionStartTime == newSessionStartTime,
                "session start time should remain the same after adding new session");
            Assert.True(testUserQuerySessionCharge.sessionEndTime == newSessionEndTime,
                "session end time should remain the same after adding new session");

            testUserQuerySessionCharge.addQuerySession(newSessionStartTime, newSessionEndTime);
            Assert.True(testUserQuerySessionCharge.sessionCount == 3, "should have 3 sessions after adding one");
            Assert.True(testUserQuerySessionCharge.sessionEndTime == newSessionEndTime,
                "session start time should remain the same after adding new session");
        }

        [Fact]
        public void constructorTest()
        {
            var userId = "testUser";
            var querySessionCharge = new QuerySessionCharge(startTime, deletedTime, userId);
            Assert.True(querySessionCharge.dataSessionStartTime == startTime, "should have correct start time");
            Assert.True(querySessionCharge.dataSessionEndTimeNearestHour == new DateTime(2018, 10, 1, 2, 0, 0) &&
                        querySessionCharge.dataSessionEndTime == new DateTime(2018, 10, 1, 1, 5, 0),
                "should have correct end time");

            Assert.True(querySessionCharge.querySessionByUser.ContainsKey(userId), "should have entry in querySessionByUser that we just added");
            Assert.True(querySessionCharge.querySessionByUser[userId].sessionStartTime == startTime,
                "should have correct start time of user query session");
            Assert.True(querySessionCharge.querySessionByUser[userId].sessionEndTime == startTime.AddMinutes(5),
                "should have correct end time of user query session");
        }

        [Fact]
        public void addQuerySessionOfSameUserTest()
        {
            var userId = "testUser";
            var querySessionCharge = new QuerySessionCharge(startTime, deletedTime, userId);
            var addQuerySessionStartTime = new DateTime(2018, 10, 1, 1, 30, 0);
            querySessionCharge.addQuerySession(addQuerySessionStartTime, deletedTime, userId);
            Assert.True(querySessionCharge.querySessionByUser[userId].sessionCount == 2,
                "should have correct number of seesions after addition");
            Assert.True(querySessionCharge.dataSessionEndTimeNearestHour == new DateTime(2018, 10, 1, 2, 0, 0),
                "dataSessionEndTimeNearestHour should remain the same if added querySessionEndTime is earlier than dataSessionEndTimeNearestHour");
            Console.WriteLine(querySessionCharge.dataSessionEndTime);
            Assert.True(querySessionCharge.dataSessionEndTime == new DateTime(2018, 10, 1, 1, 35, 0),
                "dataSessionEndTime should be the same as the latest querySessionEndTime");

            // Test of adding query session that starts 5 minutes before data session end time
            addQuerySessionStartTime = new DateTime(2018, 10, 1, 1, 55, 0);
            querySessionCharge.addQuerySession(addQuerySessionStartTime, deletedTime, userId);
            Assert.True(querySessionCharge.dataSessionEndTimeNearestHour == new DateTime(2018, 10, 1, 2, 0, 0),
                "dataSessionEndTimeNearestHour should remain the same if added querySessionEndTime is the same as dataSessionEndTimeNearestHour");

            // Test of adding query session that starts less than 5 minutes before data session end time
            addQuerySessionStartTime = new DateTime(2018, 10, 1, 1, 57, 0);
            querySessionCharge.addQuerySession(addQuerySessionStartTime, deletedTime, userId);
            Assert.True(querySessionCharge.dataSessionEndTimeNearestHour == new DateTime(2018, 10, 1, 3, 0, 0),
                "dataSessionEndTimeNearestHour should be extended by 1 hour if added querySessionEndTime is later than dataSessionEndTimeNearestHour");
            Assert.True(querySessionCharge.dataSessionEndTime == new DateTime(2018, 10, 1, 2, 2, 0),
                "dataSessionEndTime should be the same as the latest querySessionEndTime");
        }

        [Fact]
        public void addQuerySessionOfDifferentUserTest()
        {
            var userId = "testUser";
            var querySessionCharge = new QuerySessionCharge(startTime, deletedTime, userId);
            var addQuerySessionStartTime = new DateTime(2018, 10, 1, 1, 30, 0);
            var newUserId = "testUser2";
            querySessionCharge.addQuerySession(addQuerySessionStartTime, deletedTime, newUserId);
            Assert.True(querySessionCharge.querySessionByUser[userId].sessionCount == 1 && querySessionCharge.querySessionByUser[newUserId].sessionCount == 1,
                "should have correct number of seesions after addition");
            Assert.True(querySessionCharge.dataSessionEndTimeNearestHour == new DateTime(2018, 10, 1, 2, 0, 0),
                "dataSessionEndTimeNearestHour should remain the same if added querySessionEndTime is earlier than dataSessionEndTimeNearestHour");
        }

        [Fact]
        public void belongToCurrentDataSessionTest()
        {
            var userId = "testUser";
            var querySessionCharge = new QuerySessionCharge(startTime, deletedTime, userId);

            Assert.True(querySessionCharge.belongToCurrentDataSession(new DateTime(2018, 10, 1, 1, 59, 0)));
            Assert.False(querySessionCharge.belongToCurrentDataSession(new DateTime(2018, 10, 1, 2, 0, 0)));
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using Auth0.ManagementApi.Models;
using Conning.Library.Utility;
using MongoDB.Bson;

namespace Conning.GraphQL.utility
{
    public class QuerySessionCharge
    {
        public DateTime dataSessionStartTime { get;}
        public DateTime dataSessionEndTime { get; private set; }

        public DateTime dataSessionEndTimeNearestHour { get; private set; }
        public Dictionary<string, UserQuerySessionCharge> querySessionByUser { get; }

        public QuerySessionCharge(DateTime querySessionStartTime, DateTime simulationDeleteTime, string userId)
        {
            querySessionByUser = new Dictionary<string, UserQuerySessionCharge>();
            var querySessionEndTime = querySessionStartTime.AddMinutes(5);
            // if sim is deleted before query session ends, set query session end time to be the simulation deleted time
            querySessionEndTime = DateTime.Compare(querySessionEndTime, simulationDeleteTime) > 0 ? simulationDeleteTime : querySessionEndTime;
            dataSessionStartTime = querySessionStartTime;
            dataSessionEndTime = querySessionEndTime;
            dataSessionEndTimeNearestHour = HourUtils.RoundUpToNextHour(dataSessionStartTime, dataSessionEndTime);
            querySessionByUser.Add(userId, new UserQuerySessionCharge(querySessionStartTime, querySessionEndTime, userId));
        }

        public void addQuerySession(DateTime querySessionStartTime, DateTime simulationDeleteTime, string userId)
        {
            var querySessionEndTime = querySessionStartTime.AddMinutes(5);
            // if sim is deleted before query session ends, set query session end time to be the simulation deleted time
            querySessionEndTime = DateTime.Compare(querySessionEndTime, simulationDeleteTime) > 0 ? simulationDeleteTime : querySessionEndTime;
            if (DateTime.Compare(querySessionEndTime, dataSessionEndTime) > 0)
            {
                dataSessionEndTime = querySessionEndTime;
                dataSessionEndTimeNearestHour = HourUtils.RoundUpToNextHour(dataSessionStartTime, dataSessionEndTime);
            }
            if (querySessionByUser.ContainsKey(userId))
            {
                querySessionByUser[userId].addQuerySession(querySessionStartTime, querySessionEndTime);
            }
            else
            {
                querySessionByUser.Add(userId, new UserQuerySessionCharge(querySessionStartTime, querySessionEndTime, userId));
            }

        }

        public bool belongToCurrentDataSession(DateTime querySessionStartTime)
        {
            return DateTime.Compare(querySessionStartTime, dataSessionEndTimeNearestHour) < 0;
        }
    }

    public class UserQuerySessionCharge
    {
        public DateTime sessionStartTime { get; private set; }
        public DateTime sessionEndTime { get; private set; }
        public int sessionCount { get; private set; }
        public string userId { get; }

        public UserQuerySessionCharge(DateTime startTime, DateTime endTime, string userId)
        {
            sessionStartTime = startTime;
            sessionEndTime = endTime;
            sessionCount = 1;
            this.userId = userId;
        }

        public void addQuerySession(DateTime startTime, DateTime endTime)
        {
            sessionCount += 1;
            sessionStartTime = DateTime.Compare(sessionStartTime, startTime) > 0 ? startTime : sessionStartTime;
            sessionEndTime = DateTime.Compare(sessionEndTime, endTime) > 0 ? sessionEndTime : endTime;
        }
    }
}

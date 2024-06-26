using System;
using System.Collections.Generic;
using System.Linq;
using Auth0.ManagementApi.Models;
using Conning.Library.Utility;
using MongoDB.Bson;

namespace Conning.GraphQL.utility
{
    public class OptimizationSessionCharge
    {
        public DateTime dataSessionStartTime { get;}
        public DateTime dataSessionEndTime { get; private set; }

        public DateTime dataSessionEndTimeNearestHour { get; private set; }
        public Dictionary<string, UserSessionCharge> sessionsByUser { get; }

        public OptimizationSessionCharge(DateTime optimizationSessionStartTime, DateTime optimizationSessionEndTime, DateTime optimizationDeleteTime, string userId)
        {
            sessionsByUser = new Dictionary<string, UserSessionCharge>();
            optimizationSessionEndTime = DateTime.Compare(optimizationSessionEndTime, optimizationDeleteTime) > 0 ? optimizationDeleteTime : optimizationSessionEndTime;
            dataSessionStartTime = optimizationSessionStartTime;
            dataSessionEndTime = optimizationSessionEndTime;
            dataSessionEndTimeNearestHour = HourUtils.RoundUpToNextHour(dataSessionStartTime, dataSessionEndTime);
            sessionsByUser.Add(userId, new UserSessionCharge(optimizationSessionStartTime, optimizationSessionEndTime, userId));
        }

        public void addUserSession(DateTime optimizationSessionStartTime,  DateTime optimizationSessionEndTime, DateTime optimizationDeleteTime, string userId)
        {
            // if sim is deleted before optimization session ends, set optimization session end time to be the optimization deleted time
            optimizationSessionEndTime = DateTime.Compare(optimizationSessionEndTime, optimizationDeleteTime) > 0 ? optimizationDeleteTime : optimizationSessionEndTime;
            if (DateTime.Compare(optimizationSessionEndTime, dataSessionEndTime) > 0)
            {
                dataSessionEndTime = optimizationSessionEndTime;
                dataSessionEndTimeNearestHour = HourUtils.RoundUpToNextHour(dataSessionStartTime, dataSessionEndTime);
            }
            if (sessionsByUser.ContainsKey(userId))
            {
                sessionsByUser[userId].addUserSession(optimizationSessionStartTime, optimizationSessionEndTime);
            }
            else
            {
                sessionsByUser.Add(userId, new UserSessionCharge(optimizationSessionStartTime, optimizationSessionEndTime, userId));
            }

        }

        public bool belongToCurrentDataSession(DateTime optimizationSessionStartTime)
        {
            return DateTime.Compare(optimizationSessionStartTime, dataSessionEndTimeNearestHour) < 0;
        }

        public static List<OptimizationSessionCharge> processOptimizationSessionCharges(IEnumerable<BsonDocument> optimizationSessions, DateTime optimizationDeleteTime)
        {
            var result = new List<OptimizationSessionCharge>();
            var orderedOptimizationSessions = optimizationSessions.OrderBy(x => x["startTime"].AsBsonDateTime.ToUniversalTime());
            OptimizationSessionCharge currentOptimizationSessionCharge = null;
            orderedOptimizationSessions.ForEach(q =>
            {
                var userId = q["userId"].ToString();
                var currentOptimizationSessionStartTime = q["startTime"].AsBsonDateTime.ToUniversalTime();
                var currentOptimizationSessionEndTime = q["endTime"].AsBsonDateTime.ToUniversalTime();
                if (currentOptimizationSessionCharge == null || !currentOptimizationSessionCharge.belongToCurrentDataSession(currentOptimizationSessionStartTime))
                {
                    if(currentOptimizationSessionCharge != null) result.Add(currentOptimizationSessionCharge);
                    currentOptimizationSessionCharge = new OptimizationSessionCharge(currentOptimizationSessionStartTime, currentOptimizationSessionEndTime, optimizationDeleteTime, userId);
                }
                else
                {
                    currentOptimizationSessionCharge.addUserSession(currentOptimizationSessionStartTime, currentOptimizationSessionEndTime, optimizationDeleteTime, userId);
                }

            });
            if(currentOptimizationSessionCharge != null) result.Add(currentOptimizationSessionCharge);

            return result;
        }

    }

    public class UserSessionCharge
    {
        public DateTime sessionStartTime { get; private set; }
        public DateTime sessionEndTime { get; private set; }
        public int sessionCount { get; private set; }
        public string userId { get; }

        public UserSessionCharge(DateTime startTime, DateTime endTime, string userId)
        {
            sessionStartTime = startTime;
            sessionEndTime = endTime;
            sessionCount = 1;
            this.userId = userId;
        }

        public void addUserSession(DateTime startTime, DateTime endTime)
        {
            sessionCount += 1;
            sessionStartTime = DateTime.Compare(sessionStartTime, startTime) > 0 ? startTime : sessionStartTime;
            sessionEndTime = DateTime.Compare(sessionEndTime, endTime) > 0 ? sessionEndTime : endTime;
        }
    }
}

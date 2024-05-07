using System;
using System.Collections.Generic;
using System.Linq;
using Auth0.ManagementApi.Models;
using Conning.Library.Utility;
using MongoDB.Bson;

namespace Conning.GraphQL.utility
{
    public class CRASessionCharge
    {
        public DateTime dataSessionStartTime { get;}
        public DateTime dataSessionEndTime { get; private set; }

        public DateTime dataSessionEndTimeNearestHour { get; private set; }
        public string userId { get; }

        public CRASessionCharge(DateTime sessionStartTime, DateTime sessionEndTime, DateTime deleteTime, string userId)
        {
            sessionEndTime = DateTime.Compare(sessionEndTime, deleteTime) > 0 ? deleteTime : sessionEndTime;
            dataSessionStartTime = sessionStartTime;
            dataSessionEndTime = sessionEndTime;
            dataSessionEndTimeNearestHour = HourUtils.RoundUpToNextHour(dataSessionStartTime, dataSessionEndTime);
            this.userId = userId;
        }

        public bool belongToCurrentDataSession(DateTime sessionStartTime)
        {
            return DateTime.Compare(sessionStartTime, dataSessionEndTimeNearestHour) < 0;
        }
    }
}

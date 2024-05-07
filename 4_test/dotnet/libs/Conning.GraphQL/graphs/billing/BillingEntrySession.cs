using System;
using System.Collections.Generic;

namespace Conning.GraphQL
{
    public class BillingEntrySession
    {
        public DateTime startTime { get; }
        public DateTime endTime { get; }
        public string version { get; }
        public string billingEntryId { get; }
        public string createdBy { get; }
        public List<Session> sessions { get; }

        public BillingEntrySession(DateTime startTime, DateTime endTime, string version, string billingEntryId, string createdBy, List<Session> sessions)
        {
            this.startTime = startTime;
            this.endTime = endTime;
            this.version = version;
            this.billingEntryId = billingEntryId;
            this.createdBy = createdBy;
            this.sessions = sessions;
        }
    }
}

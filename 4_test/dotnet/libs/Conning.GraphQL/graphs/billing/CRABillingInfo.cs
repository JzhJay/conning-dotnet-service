using System;

namespace Conning.GraphQL
{
    public class CRABillingInfo : BillingInfo
    {
        public CRABillingInfo(DateTime startTime, DateTime endTime, DateTime reportStartTime,
            DateTime reportEndTime, DateTime adjustedStartTime, DateTime adjustedEndTime, DateTime deletedTime, string status, double elements) : base(startTime, endTime, reportStartTime, reportEndTime, adjustedStartTime, adjustedEndTime, deletedTime, status, elements, elements)
        {
        }
    }
}

using System;

namespace Conning.GraphQL
{
    public class IOBillingInfo : BillingInfo
    {
        public IOBillingInfo(DateTime startTime, DateTime endTime, DateTime reportStartTime,
            DateTime reportEndTime, DateTime adjustedStartTime, DateTime adjustedEndTime, DateTime deletedTime, string status, double elements,
            String instanceType, long numberOfInstances) : base(startTime, endTime, reportStartTime, reportEndTime, adjustedStartTime,
              adjustedEndTime, deletedTime, status, elements, elements, instanceType, numberOfInstances)
        {
        }
    }
}

using System;

namespace Conning.GraphQL
{
    public class SimulationBillingInfo : BillingInfo
    {
        public bool isCompiled { get; }

        public DateTime compilationEndTime { get; private set; }

        public SimulationBillingInfo(DateTime startTime, DateTime endTime, DateTime reportStartTime,
            DateTime reportEndTime, DateTime adjustedStartTime, DateTime adjustedEndTime, DateTime deletedTime, DateTime compilationEndTime, string status, double provisionedElements, double elements) : base(startTime, endTime, reportStartTime, reportEndTime, adjustedStartTime, adjustedEndTime, deletedTime, status, provisionedElements, elements)
        {
            this.compilationEndTime = compilationEndTime;
            isCompiled = DateTime.Compare(compilationEndTime, DateTime.MaxValue) != 0;

            initializeComputationChargeStartEndTime();
            initializeCollectorStartEndTime();
            initializeS3StartEndTime();
        }

        protected override void initializeCollectorStartEndTime()
        {
            collectorStartTime = DateTime.Compare(compilationEndTime, reportStartTime) > 0
                ? compilationEndTime
                : reportStartTime;
            if (zeroCollectorDuration)
            {
                collectorEndTime = endTime;
            }
            else
            {
                collectorEndTime = DateTime.Compare(endTime, reportEndTime) < 0 ? endTime : reportEndTime;
            }
        }
    }
}

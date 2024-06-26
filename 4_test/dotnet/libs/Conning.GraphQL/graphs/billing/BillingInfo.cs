using System;

namespace Conning.GraphQL
{
    public class BillingInfo
    {
        public DateTime startTime { get; }         // simulation real start time
        public DateTime endTime { get; }           // simulation real end time
        public DateTime deletedTime { get; }
        public DateTime reportStartTime { get; }   // report start time
        public DateTime reportEndTime { get; }     // report end time
        public DateTime adjustedStartTime { get; } // simulation start time adjusted for overlapped simulation, rounding to nearest hour
        public DateTime adjustedEndTime { get; }   // simulation end time adjusted for overlapped simulation, rounding to nearest hour

        public bool zeroAdjustedRunningDuration { get; protected set; }
        public bool zeroJobRunningDuration { get; protected set; }
        public bool adjustDynamicForReportStartTime { get; protected set; }
        public bool adjustStaticForReportStartTime { get; protected set; }
        public bool isRunning { get; }
        public bool isStoring { get; }
        public bool isOpenEnded { get; }

        public bool isFailed { get; }
        public bool zeroCollectorDuration { get; }
        public bool isClusterNative { get; }

        public DateTime computationAdjustedStartTime { get; protected set; }
        public DateTime computationAdjustedEndTime { get; protected set; }
        public DateTime computationJobStartTime { get; protected set; }
        public DateTime computationJobEndTime { get; protected set; }
        public DateTime collectorStartTime { get; protected set; }
        public DateTime collectorEndTime { get; protected set; }


        public DateTime s3StartTime { get; protected set; }
        public DateTime s3EndTime { get; protected set; }

        public double provisionedElements { get; }
        public double elements { get; }

        public String instanceType { get; protected set; }
        public long numberOfInstances { get; protected set; }

        public BillingInfo(DateTime startTime, DateTime endTime, DateTime reportStartTime,
            DateTime reportEndTime, DateTime adjustedStartTime, DateTime adjustedEndTime, DateTime deletedTime, string status,
            double provisionedElements, double elements, String instanceType = "", long numberOfInstances = 0)
        {
            this.startTime = startTime;
            this.endTime = endTime;
            this.reportStartTime = reportStartTime;
            this.reportEndTime = DateTime.Compare(reportEndTime, DateTime.UtcNow) < 0 ? reportEndTime : DateTime.UtcNow;
            this.deletedTime = deletedTime;
            this.adjustedStartTime = adjustedStartTime;
            this.adjustedEndTime = adjustedEndTime;
            this.provisionedElements = provisionedElements;
            this.elements = elements;
            this.instanceType = instanceType;
            this.numberOfInstances = numberOfInstances;


            adjustDynamicForReportStartTime = false;
            adjustStaticForReportStartTime = false;
            isRunning = DateTime.Compare(endTime, DateTime.MaxValue) == 0;
            zeroCollectorDuration = DateTime.Compare(endTime, reportStartTime) <= 0;
            isStoring = DateTime.Compare(deletedTime, DateTime.MaxValue) == 0;
            isOpenEnded = DateTime.Compare(reportEndTime.AddMinutes(1), DateTime.UtcNow) > 0; //If times are about the same, it's open ended
            isFailed = status == "Failed";
            isClusterNative = (instanceType != "" && numberOfInstances > 0);

            initializeComputationChargeStartEndTime();
            initializeCollectorStartEndTime();
            initializeS3StartEndTime();
        }

        /// <summary>
        /// This function populates zeroSimulationRunningDuration, adjust*ForReportStartTime, computation*StartTime, and computation*EndTime fields of current instance.
        ///
        /// </summary>
        /// <returns></returns>
        protected void initializeComputationChargeStartEndTime()
        {
            computationAdjustedStartTime = startTime;
            computationAdjustedEndTime = endTime;

            var zeroDuration = DateTime.Compare(adjustedStartTime, adjustedEndTime) == 0;
            var adjustedOutOfRange = DateTime.Compare(adjustedStartTime, reportEndTime) > 0 ||
                                     DateTime.Compare(adjustedEndTime, reportStartTime) < 0;

            zeroAdjustedRunningDuration = zeroDuration || adjustedOutOfRange;

            if (zeroAdjustedRunningDuration)
            {
                computationAdjustedStartTime = computationAdjustedEndTime;
            }
            else
            {
                computationAdjustedStartTime = DateTime.Compare(adjustedStartTime, reportStartTime) > 0
                    ? adjustedStartTime
                    : reportStartTime;
                computationAdjustedEndTime = DateTime.Compare(adjustedEndTime, reportEndTime) < 0
                    ? adjustedEndTime
                    : reportEndTime;
                // report start time is the starting time, need to adjust charging start time to not include the interval covered by prior charging hour. E.g.
                // simulation starts at 11:30 and report starts at 12:00. So reports should start charging from 12:30 since 12:00 to 12:30 is covered by another
                // report which ends at 12:00
                adjustStaticForReportStartTime = DateTime.Compare(computationAdjustedStartTime, reportStartTime) == 0;
            }

            computationJobStartTime = startTime;
            computationJobEndTime = endTime;

            zeroJobRunningDuration = DateTime.Compare(startTime, reportEndTime) > 0 ||
                                DateTime.Compare(endTime, reportStartTime) < 0;

            if (!zeroJobRunningDuration)
            {
                computationJobStartTime = DateTime.Compare(startTime, reportStartTime) > 0
                    ? startTime
                    : reportStartTime;
                computationJobEndTime = DateTime.Compare(endTime, reportEndTime) < 0
                    ? endTime
                    : reportEndTime;
                // report start time is the starting time, need to adjust charging start time to not include the interval covered by prior charging hour. E.g.
                // simulation starts at 11:30 and report starts at 12:00. So reports should start charging from 12:30 since 12:00 to 12:30 is covered by another
                // report which ends at 12:00
                // TODO: verify this is still correct for Linux
                adjustDynamicForReportStartTime = DateTime.Compare(computationJobStartTime, reportStartTime) == 0;
            }
        }

        protected virtual void initializeCollectorStartEndTime()
        {
            collectorStartTime = DateTime.Compare(startTime, reportStartTime) > 0
                ? startTime
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

        protected void initializeS3StartEndTime()
        {
            s3StartTime = DateTime.Compare(collectorEndTime, reportStartTime) > 0 ? collectorEndTime : reportStartTime;
            s3EndTime = DateTime.Compare(deletedTime, reportEndTime) > 0 ? reportEndTime : deletedTime;
        }

        public bool hasS3File()
        {
            return DateTime.Compare(deletedTime, reportEndTime) > 0;
        }

    }
}

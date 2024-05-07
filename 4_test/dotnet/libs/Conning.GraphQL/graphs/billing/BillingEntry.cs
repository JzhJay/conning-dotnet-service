using System;
using System.Collections.Generic;
using System.Linq;
using Conning.Db.Services;
using Conning.GraphQL.utility;
using Conning.Library.Utility;
using MongoDB.Bson;

namespace Conning.GraphQL
{
    public abstract class BillingEntry
    {
        public string sourceId { get; }
        public string name { get; }
        public string status { get; }
        public string gridName { get; }
        public string createdBy { get; }
        public DateTime deletedTime { get; }
        public string omdbTable { get; protected set; } // used in fetchSource

        protected string _entryType { get; set; }
        protected bool _noComputeCharge { get; set; }
        protected bool _noDataServingCharge { get; set; }
        protected bool _noDataStorageCharge { get; set; }
        protected string _jobId { get; }
        protected BillingInfo _billingInfo { get; }
        protected List<BillingEntrySession> _billingEntrySessions { get; }
        protected AggregateCpuTime _gridCpuTime { get; }

        protected Dictionary<string, object> _rates{ get; } // factor this
        protected Dictionary<string, ConningUser> _users { get; }
        protected ConningUser currentUser { get; }

        public List<BillingBaseRow> details { get; }
        public BillingBaseRow total { get; protected set; }

        public BillingEntry(string sourceId, string name, string status, string gridName, string createdBy, DateTime deletedTime, string jobId,
        BillingInfo billingInfo, List<BillingEntrySession> billingEntrySessions, AggregateCpuTime gridCpuTime,
        Dictionary<string, object> rates, Dictionary<string, ConningUser> users)
        {
            this.sourceId = sourceId;
            this.name = name;
            this.status = status;
            this.gridName = gridName;
            this.createdBy = createdBy;
            this.deletedTime = deletedTime;
            _jobId = jobId;
            _billingInfo = billingInfo;
            _billingEntrySessions = billingEntrySessions;
            _gridCpuTime = gridCpuTime;
            _rates = rates;
            _users = users;
            currentUser = _users[createdBy];
            details = new List<BillingBaseRow>();
        }

        public static int GetRoundedHoursBetween(DateTime startTime, DateTime endTime)
        {
            // Calculate the difference
            TimeSpan difference = endTime - startTime;

            // Return the hours, rounded up
            return (int)Math.Ceiling(difference.TotalHours);
        }

        public static int GetvCPUsFromInstanceType(string instanceType)
        {
            // Split the string and get the second half
            string[] parts = instanceType.Split('.');
            if (parts.Length < 2)
            {
                return 0;  // Invalid string format
            }

            string v_cpu_size = parts[1];
            
            if (v_cpu_size == "large")
            {
                return 2;
            }
            else if (v_cpu_size == "xlarge")
            {
                return 4;
            }
            else if (v_cpu_size.EndsWith("xlarge"))
            {
                string numberPart = v_cpu_size.Substring(0, v_cpu_size.Length - "xlarge".Length);
                if (int.TryParse(numberPart, out int multiplier))
                {
                    return 4 * multiplier;
                }
            }

            return 0;  // Unsupported type or invalid format
        }

        private Tuple<Dictionary<string, double>, int> calculateComputeFromInstancesAndCount(BillingInfo _billingInfo){
            var (cpuTimeByType, vCpuQuantity) = (0, 0);
            var startTime = _billingInfo.computationJobStartTime;
            var endTime = _billingInfo.computationJobEndTime;
            
            var instanceType = _billingInfo.instanceType;
            // split on dot
            // get quantity from the right hand side

            var numberOfInstances = _billingInfo.numberOfInstances;
            Console.WriteLine($"  Instance Type: {instanceType} - Number of Instances: {numberOfInstances}");
            var number_of_vCpus_in_instance_type = GetvCPUsFromInstanceType(instanceType);
            vCpuQuantity = (int)(number_of_vCpus_in_instance_type * numberOfInstances);

            // Consider doing funky manipulation to make start and end time fit the timebox.
            // This may be done already when making the billingInfo object earlier.
            cpuTimeByType = GetRoundedHoursBetween(startTime, endTime);

            var cpuHourByType = new Dictionary<string, double>();
            var cpuType = instanceType.Split('.')[0];
            if(string.IsNullOrEmpty(cpuType)){
                cpuType = "m5";
            }
            vCpuQuantity = Math.Max(1, vCpuQuantity);
            cpuHourByType.Add(cpuType, cpuTimeByType * vCpuQuantity);

            Console.WriteLine($"  {cpuType}: {cpuTimeByType} hrs");
            Console.WriteLine($"  vCPU quantity: {vCpuQuantity}");
            
            return Tuple.Create(cpuHourByType, vCpuQuantity);
        }

        public void calculateComputationCharge()
        {
            //Do not add row if charge is outside of report range
            if (!HourUtils.RangeIntersectsRange(
	            _billingInfo.reportStartTime, _billingInfo.reportEndTime,
	            _billingInfo.computationJobStartTime, _billingInfo.computationJobEndTime))
                return;

            var computationCharge = 0.0;
            var (cpuTimeByType, vCpuQuantity) = Tuple.Create(new Dictionary<string, double>(), 0);
            if(!string.IsNullOrEmpty(_billingInfo.instanceType)){
                Console.WriteLine("Adding BillingEntry computation charge using InstanceType and numberOfInstances");
                var (cpuTimeByType2, vCpuQuantity2) = calculateComputeFromInstancesAndCount(_billingInfo);
                cpuTimeByType = cpuTimeByType.Concat(cpuTimeByType2)
                                             .GroupBy(kv => kv.Key)
                                             .ToDictionary(g => g.Key, g => g.Sum(kv => kv.Value));
                vCpuQuantity += vCpuQuantity2;
            }
            else if (_billingInfo.zeroAdjustedRunningDuration && _billingInfo.zeroJobRunningDuration)
            {
                (cpuTimeByType, vCpuQuantity) = Tuple.Create(new Dictionary<string, double>(), 0);
            }
            else {
                (cpuTimeByType, vCpuQuantity) = _gridCpuTime.getAggregateCpuTimeAndQuantity(_billingInfo, _jobId);
            }

            var instanceType = cpuTimeByType.Count == 0 ? "N/A" :
                cpuTimeByType.Count > 1 ? "Mixed" : cpuTimeByType.First().Key;
            cpuTimeByType.ForEach(s =>
            {
                object currentInstanceRate;
                currentInstanceRate = _rates["Simulation"].ToBsonDocument().ToDictionary() // May need optimization rate
                    .TryGetValue(s.Key.Substring(0, 2), out currentInstanceRate)
                    ? currentInstanceRate
                    : 0.0;
                computationCharge += s.Value * (double) currentInstanceRate;
            });


            var footnotes = new List<string>();
            if (_billingInfo.isRunning)// Is this resource still active?
            {
	            footnotes.Add("*");
            }

            if (DateTime.Compare(_billingInfo.computationJobStartTime, _billingInfo.reportStartTime) <= 0) {

                footnotes.Add("†"); // Dagger footnote symbol: †
            }

            if (DateTime.Compare(_billingInfo.computationJobEndTime, _billingInfo.reportEndTime) >= 0)
            {
                footnotes.Add("‡"); // Double-Dagger footnote symbol: ‡
            }

            details.Add(new BillingComputationRow($"{_entryType} Computation", currentUser,
                _billingInfo.computationJobStartTime,
                _billingInfo.isRunning && _billingInfo.isOpenEnded ? (DateTime?) null : _billingInfo.computationJobEndTime, computationCharge, vCpuQuantity,
                cpuTimeByType.Select(s => s.Value).Sum(),
                instanceType, name, gridName, footnotes));
        }

        public void calculateDataServingCharge()
        {
			var maxElements = Math.Max(_billingInfo.provisionedElements, _billingInfo.elements);
            var dataServingChargePerHour = maxElements * (_rates["Data Serving"] as BsonDouble).AsDouble;
            var querySessionChargePerQueryPerHour = (_rates["Query Session"] as BsonDouble).AsDouble;

            if (!_noComputeCharge && HourUtils.RangeIntersectsRange(
                                      _billingInfo.reportStartTime, _billingInfo.reportEndTime,
                                      _billingInfo.collectorStartTime, _billingInfo.collectorEndTime))
            {
                var dataServingCharge = _billingInfo.zeroCollectorDuration
                    ? 0.0
                    : Math.Ceiling((_billingInfo.collectorEndTime - _billingInfo.collectorStartTime)
                          .TotalHours) * dataServingChargePerHour; // per day charge

                if (dataServingCharge > 0.0)
                {
                    details.Add(new BillingDataServingRow($"{_entryType} Data Serving", currentUser,
                        _billingInfo.collectorStartTime,
                        _billingInfo.isRunning && _billingInfo.isOpenEnded ? (DateTime?) null : _billingInfo.collectorEndTime,
                        maxElements, dataServingChargePerHour, dataServingCharge,  // uses max of provisioned, actual
                        name, gridName, new List<string>()));
                }
            }

			//	start_of_data_session = 0 # time
			//  end_of_data_session = 0
			//  end_of_qsession = 0 # five minutes after a qsession started
			//	end_of_data_session_nearest_hour = 0  # time, rounded up
			//
			//	# a query session is how it is represented in the database
			//	# a billing row, is a "grouped" query session if included in the previous hour of another session
			//	for qs in query_sessions:  # assume in order by start_time, and only for current simulation
			//
			//      (Filter by "userId" and trim times to be inside "reportTimes")
			//      end_of_qsession = qs.start_time + 5 minutes  # TODO: read out of mongo
			//
			//      if end_of_data_session < end_of_qsession:
			//			end_of_data_session = end_of_qsession
			//
			//		if start_of_data_session == 0:
			//		    start_of_data_session = qs.start_time
			//		    end_of_data_session_nearest_hour = ceil_to_nearest_hour(start_of_data_session, end_of_qsession)
			//
			//		else if qs.start_time > end_of_session_nearest_hour:
			//		    # finish off Billing row
			//		    details.Add(BillingRow(start_of_data_session, end_of_data_session_nearest_hour))
			//		    start_of_data_session = qs.start_time
			//		    end_of_data_session_nearest_hour = ceil_to_nearest_hour(start_of_data_session, end_of_qsession)
			//
			//		else if end_of_qsession > end_of_session_nearest_hour:
			//		    end_of_session_nearest_hour = ceil_to_nearest_hour(start_of_data_session, end_of_qsession)
			//
			//	# outside for loop, close off the last Query Session hour
			//	details.Add(BillingRow(start_of_data_session, end_of_data_session_nearest_hour))
			//
			//
			//	#    !-------------------1--------------------2-------------------3
			//	#    s1................!
			//	#           s2..............!-----------------!
			//	#                               s3.........!
			//	#                                                    s4.....!  # five minutes after last query
			//	#DS1 ^                                        ^
			//	#DS2                                                 ^                ^

			// We assume that if a query is still open, the duration and billing will be rounded to the nearest hour
			// and we don't represent in progress queries as TBD. All other charges can be left open
            _billingEntrySessions.ForEach(s =>
            {
	            var sessions = s.sessions.Where(q =>
	            {
		            var sessionStartTime = q.startTime;
		            var currentUserId = q.userId;
		            return DateTime.Compare(sessionStartTime, _billingInfo.reportStartTime) >= 0 &&
		                   DateTime.Compare(sessionStartTime, _billingInfo.reportEndTime) < 0 &&
		                   currentUserId.Any() &&
		                   _users.ContainsKey(currentUserId);
	            });

                processSessionCharges(sessions, s.createdBy);
            });
        }

        public abstract void processSessionCharges(IEnumerable<Session> sessions, string sessionOwner);

        public void calculateDataStorageCharge()
        {
            //Do not add row if charge is outside of report range
            if (!HourUtils.RangeIntersectsRange(
	            _billingInfo.reportStartTime, _billingInfo.reportEndTime,
	            _billingInfo.s3StartTime, _billingInfo.s3EndTime))
	            return;

            var dataStorageChargePerDay = _billingInfo.elements * (_rates["Data Storage"] as BsonDouble).AsDouble;

            var ongoingDataStorageChargePerDay =
                _billingInfo.hasS3File() ? dataStorageChargePerDay : 0.0;

            var dataStorageCharge =
                Math.Ceiling((_billingInfo.s3EndTime - _billingInfo.s3StartTime).TotalDays) *
                dataStorageChargePerDay;

            var footnotes = new List<string>();
            if (_billingInfo.isStoring)// Is this resource still active?
            {
	            footnotes.Add("*");
            }

            if (DateTime.Compare(_billingInfo.s3StartTime, _billingInfo.reportStartTime) <= 0)
            {
                footnotes.Add("†"); // Dagger footnote symbol: †
            }

            if (DateTime.Compare(_billingInfo.s3EndTime, _billingInfo.reportEndTime) >= 0)
            {
                footnotes.Add("‡"); // Double-Dagger footnote symbol: ‡
            }

            details.Add(new BillingDataStorageRow($"{_entryType} Data Storage", currentUser,
                _billingInfo.s3StartTime,
                _billingInfo.isStoring && _billingInfo.isOpenEnded ? (DateTime?) null : _billingInfo.s3EndTime, _billingInfo.elements, dataStorageChargePerDay, ongoingDataStorageChargePerDay,
                dataStorageCharge, name, gridName, footnotes));
        }

        public void calculateCharges() {
            if(!_noComputeCharge) {
                calculateComputationCharge();
            }
            if(!_noDataServingCharge) {
                calculateDataServingCharge();
            }
            // Not completely certain why _noComputeCharge is necessary
            if (!_noDataStorageCharge) {
                calculateDataStorageCharge();
            }

            total = new BillingItemTotalRow(currentUser, _billingInfo.reportStartTime, _billingInfo.reportEndTime, details, name, gridName, $"{_entryType} Total");
        }

        protected Tuple<List<string>, DateTime, DateTime> truncateTimeAndAddFootNote(DateTime reportStartTime,
	        DateTime reportEndTime, DateTime entryStartTime, DateTime entryEndTime)
        {
	        var footnotes = new List<string>();
	        var resultStartTime = entryStartTime;
	        var resultEndTime = entryEndTime;
	        if (DateTime.Compare(resultStartTime, reportStartTime) <= 0)
	        {
		        footnotes.Add("†"); // Dagger footnote symbol: †
		        resultStartTime = reportStartTime;
	        }

	        if (DateTime.Compare(resultEndTime, reportEndTime) >= 0)
	        {
		        footnotes.Add("‡"); // Double-Dagger footnote symbol: ‡
		        resultEndTime = reportEndTime;
	        }

	        return Tuple.Create(footnotes, resultStartTime, resultEndTime);
        }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using Conning.Db.Services;
using Conning.GraphQL.utility;
using Conning.Library.Utility;
using MongoDB.Bson;

namespace Conning.GraphQL
{
    public class IOBillingEntry : BillingEntry
    {
        public IOBillingEntry(string sourceId, string name, string status, string gridName,
        string createdBy, DateTime deletedTime, bool sessionBillingOnly, string jobId, IOBillingInfo billingInfo,
        List<BillingEntrySession> billingEntrySessions, AggregateCpuTime gridCpuTime,
        Dictionary<string, object> rates, Dictionary<string, ConningUser> users) :
            base(sourceId, name, status, gridName, createdBy, deletedTime, jobId, billingInfo, billingEntrySessions, gridCpuTime, rates, users)
        {
            omdbTable =  DateTime.Compare(deletedTime, DateTime.MaxValue) == 0 ? "InvestmentOptimization" : "DeletedInvestmentOptimization";
            _entryType = "Optimization";
            _noComputeCharge = sessionBillingOnly;
            _noDataServingCharge = omdbTable == "DeletedInvestmentOptimization" && _billingInfo.elements == 0;
            _noDataStorageCharge =  _noComputeCharge || _billingInfo.isRunning || _billingInfo.isFailed || (omdbTable == "DeletedInvestmentOptimization" && _billingInfo.elements == 0);
        }

        public static List<OptimizationSessionCharge> processOptimizationSessionCharges(IEnumerable<Session> sessions, DateTime optimizationDeleteTime)
        {
            var result = new List<OptimizationSessionCharge>();
            var orderedOptimizationSessions = sessions.OrderBy(x => x.startTime);
            OptimizationSessionCharge currentOptimizationSessionCharge = null;
            orderedOptimizationSessions.ForEach(q =>
            {
                var userId = q.userId;
                var currentOptimizationSessionStartTime = q.startTime;
                var currentOptimizationSessionEndTime = q.endTime;
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

        public override void processSessionCharges(IEnumerable<Session> sessions, string sessionOwner)
        {
            var userSessionsCharges = processOptimizationSessionCharges(sessions, _billingInfo.deletedTime);

	        var dataServingChargePerHour = _billingInfo.elements * (_rates["Data Serving"] as BsonDouble).AsDouble; // based on actual
	        var userSessionChargePerQueryPerHour = (_rates["Query Session"] as BsonDouble).AsDouble;

	        userSessionsCharges.ForEach(userSessionCharge =>
	        {
		        var (startOfBillingDataSession, endOfBillingDataSession) = HourUtils.BillableWithinPeriod(userSessionCharge.dataSessionStartTime,
			        userSessionCharge.dataSessionEndTime, _billingInfo.reportStartTime,
			        _billingInfo.reportEndTime);

		        var userSessionDuration = (endOfBillingDataSession - startOfBillingDataSession).TotalHours;
		        if (userSessionDuration <= 0) return;
		        var currentDataServingCharge =
			        userSessionDuration *
			        dataServingChargePerHour; // Math.Ceiling((double) userSessionDuration) * dataServingChargePerHour;

		        var (footnotes,
			        startOfDataSession,
			        endOfDataSession) = truncateTimeAndAddFootNote(_billingInfo.reportStartTime,
				        _billingInfo.reportEndTime, userSessionCharge.dataSessionStartTime,
				        userSessionCharge.dataSessionEndTime);

		        var sessionUserId =
			        sessionOwner.Any() ? sessionOwner : userSessionCharge.sessionsByUser.Keys.First();

		        userSessionCharge.sessionsByUser.Values.ForEach(v =>
		        {
			        (footnotes,
				        startOfDataSession,
				        endOfDataSession) = truncateTimeAndAddFootNote(_billingInfo.reportStartTime,
				        _billingInfo.reportEndTime, v.sessionStartTime,
				        v.sessionEndTime);

                    details.Add(new BillingDataServingRow("Session Data Serving", _users[v.userId],
                            startOfDataSession,
                            endOfDataSession, _billingInfo.elements, dataServingChargePerHour, // uses actual not provisioned
                            currentDataServingCharge, name,
                            gridName, footnotes));

			        details.Add(new BillingDataServingRow($"User Session (x{v.sessionCount})",
				        _users[v.userId], startOfDataSession,
				        endOfDataSession, _billingInfo.elements, userSessionChargePerQueryPerHour, // uses actual not provisioned
				        v.sessionCount * userSessionChargePerQueryPerHour, name,
				        gridName, footnotes));
		        });
	        });
        }
    }
}

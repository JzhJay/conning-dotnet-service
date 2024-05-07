using System;
using System.Collections.Generic;
using System.Linq;
using Conning.Db.Services;
using Conning.GraphQL.utility;
using Conning.Library.Utility;
using MongoDB.Bson;

namespace Conning.GraphQL
{
    public class SimulationBillingEntry : BillingEntry
    {
        public SimulationBillingEntry(string sourceId, string name, string status, string gridName,
        string createdBy, DateTime deletedTime, bool queryBillingOnly, string sourceType, string jobId,
        SimulationBillingInfo billingInfo, List<BillingEntrySession> billingEntrySessions, AggregateCpuTime gridCpuTime,
        Dictionary<string, object> rates, Dictionary<string, ConningUser> users) :
            base(sourceId, name, status, gridName, createdBy, deletedTime, jobId, billingInfo, billingEntrySessions, gridCpuTime, rates, users)
        {
            omdbTable =  DateTime.Compare(deletedTime, DateTime.MaxValue) == 0 ? "Simulation" : "DeletedSimulation";
            _entryType = "Simulation";
            _noComputeCharge = queryBillingOnly || (sourceType != "Simulation" && sourceType != "GEMS") || jobId == "Fake Job ID";
            _noDataServingCharge = !billingInfo.isCompiled;
            _noDataStorageCharge = _noComputeCharge || _billingInfo.isRunning || _billingInfo.isFailed || (omdbTable == "DeletedSimulation" && _billingInfo.elements == 0);
        }

        private List<QuerySessionCharge> processQuerySessionCharges(IEnumerable<Session> sessions, DateTime deleteTime)
        {
            var result = new List<QuerySessionCharge>();
            var orderedQuerySessions = sessions.OrderBy(x => x.startTime);
            QuerySessionCharge currentQuerySessionCharge = null;
            orderedQuerySessions.ForEach(q =>
            {
                var userId = q.userId;
                var currentQuerySessionStartTime = q.startTime;
                if (currentQuerySessionCharge == null || !currentQuerySessionCharge.belongToCurrentDataSession(currentQuerySessionStartTime))
                {
                    if(currentQuerySessionCharge != null) result.Add(currentQuerySessionCharge);
                    currentQuerySessionCharge = new QuerySessionCharge(currentQuerySessionStartTime, deleteTime, userId);
                }
                else
                {
                    currentQuerySessionCharge.addQuerySession(currentQuerySessionStartTime, deleteTime, userId);
                }

            });
            if(currentQuerySessionCharge != null) result.Add(currentQuerySessionCharge);

            return result;
        }

        private List<RSSimulationSessionCharge> processRSSimulationSessionCharges(IEnumerable<Session> sessions, DateTime deleteTime)
        {
            var result = new List<RSSimulationSessionCharge>();
            var orderedSessions = sessions.OrderBy(x => x.startTime);
            RSSimulationSessionCharge currentSessionCharge = null;
            orderedSessions.ForEach(q =>
            {
                var userId = q.userId;
                var currentSessionStartTime = q.startTime;
                var currentSessionEndTime = q.endTime;
                if (currentSessionCharge == null || !currentSessionCharge.belongToCurrentDataSession(currentSessionStartTime))
                {
                    if(currentSessionCharge != null) result.Add(currentSessionCharge);
                    currentSessionCharge = new RSSimulationSessionCharge(currentSessionStartTime, currentSessionEndTime, deleteTime, userId);
                }

            });
            if(currentSessionCharge != null) result.Add(currentSessionCharge);

            return result;
        }

        public override void processSessionCharges(IEnumerable<Session> sessions, string sessionOwner)
        {
            var querySessionCharges = processQuerySessionCharges(sessions.Where(s => s.type == "Query"), _billingInfo.deletedTime);
            var RSSimulationSessionCharges = processRSSimulationSessionCharges(sessions.Where(s => s.type == "GEMS"), _billingInfo.deletedTime);

	        var dataServingChargePerHour = _billingInfo.elements * (_rates["Data Serving"] as BsonDouble).AsDouble; // based on actual
	        var querySessionChargePerQueryPerHour = (_rates["Query Session"] as BsonDouble).AsDouble;

	        querySessionCharges.ForEach(querySessionCharge =>
	        {
		        var (startOfBillingDataSession, endOfBillingDataSession) = HourUtils.BillableWithinPeriod(querySessionCharge.dataSessionStartTime,
			        querySessionCharge.dataSessionEndTime, _billingInfo.reportStartTime,
			        _billingInfo.reportEndTime);

		        var querySessionDuration = (endOfBillingDataSession - startOfBillingDataSession).TotalHours;
		        if (querySessionDuration <= 0) return;
		        var currentDataServingCharge =
			        querySessionDuration *
			        dataServingChargePerHour; // Math.Ceiling((double) querySessionDuration) * dataServingChargePerHour;

		        var (footnotes,
			        startOfDataSession,
			        endOfDataSession) = truncateTimeAndAddFootNote(_billingInfo.reportStartTime,
				        _billingInfo.reportEndTime, querySessionCharge.dataSessionStartTime,
				        querySessionCharge.dataSessionEndTime);

		        var sessionUserId =
			        sessionOwner.Any() ? sessionOwner : querySessionCharge.querySessionByUser.Keys.First();

		        details.Add(new BillingDataServingRow("Query Data Serving", _users[sessionUserId],
			        startOfDataSession,
			        endOfDataSession, _billingInfo.elements, dataServingChargePerHour, // uses actual not provisioned
			        currentDataServingCharge, name,
			        gridName, footnotes));

		        querySessionCharge.querySessionByUser.Values.ForEach(v =>
		        {
			        (footnotes,
				        startOfDataSession,
				        endOfDataSession) = truncateTimeAndAddFootNote(_billingInfo.reportStartTime,
				        _billingInfo.reportEndTime, v.sessionStartTime,
				        v.sessionEndTime);
			        details.Add(new BillingDataServingRow($"Query Session (x{v.sessionCount})",
				        _users[v.userId], startOfDataSession,
				        endOfDataSession, _billingInfo.elements, querySessionChargePerQueryPerHour, // uses actual not provisioned
				        v.sessionCount * querySessionChargePerQueryPerHour, name,
				        gridName, footnotes));
		        });
	        });

            RSSimulationSessionCharges.ForEach(RSSimulationSessionCharge =>
	        {
		        var (startOfBillingDataSession, endOfBillingDataSession) = HourUtils.BillableWithinPeriod(RSSimulationSessionCharge.dataSessionStartTime,
			        RSSimulationSessionCharge.dataSessionEndTime, _billingInfo.reportStartTime,
			        _billingInfo.reportEndTime);

		        var RSSimulationSessionDuration = (endOfBillingDataSession - startOfBillingDataSession).TotalHours;
		        if (RSSimulationSessionDuration <= 0) return;
		        var currentDataServingCharge =
			        RSSimulationSessionDuration *
			        dataServingChargePerHour; // Math.Ceiling((double) userSessionDuration) * dataServingChargePerHour;

		        var (footnotes,
			        startOfDataSession,
			        endOfDataSession) = truncateTimeAndAddFootNote(_billingInfo.reportStartTime,
				        _billingInfo.reportEndTime, RSSimulationSessionCharge.dataSessionStartTime,
				        RSSimulationSessionCharge.dataSessionEndTime);

                details.Add(new BillingDataServingRow("GEMS Session",
                    _users[RSSimulationSessionCharge.userId], startOfDataSession,
                    endOfDataSession, _billingInfo.elements, querySessionChargePerQueryPerHour, // uses actual not provisioned
                    querySessionChargePerQueryPerHour, name,
                    gridName, footnotes));
	        });
        }
    }
}

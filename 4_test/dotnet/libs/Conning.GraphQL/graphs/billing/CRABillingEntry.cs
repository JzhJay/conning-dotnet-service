using System;
using System.Collections.Generic;
using System.Linq;
using Conning.Db.Services;
using Conning.GraphQL.utility;
using Conning.Library.Utility;
using MongoDB.Bson;

namespace Conning.GraphQL
{
    public class CRABillingEntry : BillingEntry
    {
        public CRABillingEntry(string sourceId, string name, string status, string gridName,
        string createdBy, DateTime deletedTime, bool sessionBillingOnly, string jobId, CRABillingInfo billingInfo,
        List<BillingEntrySession> billingEntrySessions, AggregateCpuTime gridCpuTime,
        Dictionary<string, object> rates, Dictionary<string, ConningUser> users) :
            base(sourceId, name, status, gridName, createdBy, deletedTime, jobId, billingInfo, billingEntrySessions, gridCpuTime, rates, users)
        {
            omdbTable =  DateTime.Compare(deletedTime, DateTime.MaxValue) == 0 ? "ClimateRiskAnalysis" : "DeletedClimateRiskAnalysis";
            _entryType = "CRA";
            _noComputeCharge = true;
            _noDataServingCharge = omdbTable == "DeletedClimateRiskAnalysis" && _billingInfo.elements == 0;
            _noDataStorageCharge = _billingInfo.isRunning || _billingInfo.isFailed || (omdbTable == "DeletedClimateRiskAnalysis" && _billingInfo.elements == 0);
        }

        private List<CRASessionCharge> processAnalysisSessionCharges(IEnumerable<Session> sessions, DateTime deleteTime)
        {
            var result = new List<CRASessionCharge>();
            var orderedSessions = sessions.OrderBy(x => x.startTime);
            CRASessionCharge currentSessionCharge = null;
            orderedSessions.ForEach(q =>
            {
                var userId = q.userId;
                var currentSessionStartTime = q.startTime;
                var currentSessionEndTime = q.endTime;
                if (currentSessionCharge == null || !currentSessionCharge.belongToCurrentDataSession(currentSessionStartTime))
                {
                    if(currentSessionCharge != null) result.Add(currentSessionCharge);
                    currentSessionCharge = new CRASessionCharge(currentSessionStartTime, currentSessionEndTime, deleteTime, userId);
                }

            });
            if(currentSessionCharge != null) result.Add(currentSessionCharge);

            return result;
        }

        public override void processSessionCharges(IEnumerable<Session> sessions, string sessionOwner)
        {
            var CRASessionCharges = processAnalysisSessionCharges(sessions, _billingInfo.deletedTime);

            var dataServingChargePerHour = _billingInfo.elements * (_rates["Data Serving"] as BsonDouble).AsDouble; // based on actual
	        var sessionChargePerHour = (_rates["Query Session"] as BsonDouble).AsDouble;

            CRASessionCharges.ForEach(CRASessionCharge =>
	        {
		        var (startOfBillingDataSession, endOfBillingDataSession) = HourUtils.BillableWithinPeriod(CRASessionCharge.dataSessionStartTime,
			        CRASessionCharge.dataSessionEndTime, _billingInfo.reportStartTime,
			        _billingInfo.reportEndTime);

		        var CRASessionDuration = (endOfBillingDataSession - startOfBillingDataSession).TotalHours;
		        if (CRASessionDuration <= 0) return;
		        var currentDataServingCharge =
			        CRASessionDuration *
			        dataServingChargePerHour; // Math.Ceiling((double) userSessionDuration) * dataServingChargePerHour;

		        var (footnotes,
			        startOfDataSession,
			        endOfDataSession) = truncateTimeAndAddFootNote(_billingInfo.reportStartTime,
				        _billingInfo.reportEndTime, CRASessionCharge.dataSessionStartTime,
				        CRASessionCharge.dataSessionEndTime);

                details.Add(new BillingDataServingRow("Session Data Serving", _users[CRASessionCharge.userId],
                        startOfDataSession,
                        endOfDataSession, _billingInfo.elements, dataServingChargePerHour, // uses actual not provisioned
                        currentDataServingCharge, name,
                        gridName, footnotes));

                details.Add(new BillingDataServingRow("CRA Session",
                    _users[CRASessionCharge.userId], startOfDataSession,
                    endOfDataSession, _billingInfo.elements, sessionChargePerHour, // uses actual not provisioned
                    sessionChargePerHour, name,
                    gridName, footnotes));
	        });
        }
    }
}

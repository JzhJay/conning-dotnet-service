using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Auth0.ManagementApi.Models;
using Conning.Db.Services;
using Conning.Library.Utility;
using Conning.GraphQL.utility;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Conning.GraphQL
{
    public class CRAFactory : BillingFactory
    {
        public CRAFactory(BaseUserService userService, OmdbService omdb, IMongoDatabase db, DateTime startDateFromInput, DateTime endDateFromInput,
            List<string> usersFromInput, Dictionary<string, object> rates, Dictionary<string, ConningUser> users) : base(userService, omdb, db, startDateFromInput, endDateFromInput, usersFromInput, rates, users)
        {
        }

        public async override Task createBillingEntries(List<BillingEntry> billingEntries)
        {
            var analysisSessionData =
                await getCRASessionData(_omdb, _db, startDateTime, endDateTime,
                    userIds);

            var analysisData = await getAnalysisData(_omdb, _db, startDateTime, endDateTime,
                userIds, analysisSessionData.Keys);

            sortAnalysisData(analysisData);

            var gridStatus = getGridStatusData(analysisData);

            if (analysisData.Count > 0){
                adjustAnalysisStartEndTime(analysisData);
            }

            var tasks = new List<Task>();
            var result = new List<BillingEntry>();

            tasks.AddRange(analysisData.Select(s =>
            {
                var billingData = s["billingInformation"].AsBsonDocument;
                var analysisStartTime = billingData["analysisStartTime"].AsBsonDateTime.ToUniversalTime();
                var analysisEndTime = billingData["analysisEndTime"].IsBsonNull
                    ? DateTime.MaxValue
                    : billingData["analysisEndTime"].AsBsonDateTime.ToUniversalTime();
                var deletedTime = s["deletedTime"].IsBsonNull
                    ? DateTime.MaxValue
                    : s["deletedTime"].AsBsonDateTime.ToUniversalTime();

                var adjustedStartTime = s["adjustedStartTime"].AsBsonDateTime.ToUniversalTime();
                var adjustedEndTime = s["adjustedEndTime"].AsBsonDateTime.ToUniversalTime();

                var dataElements = !billingData.Contains("elements") || billingData["elements"].IsBsonNull
                    ? 0
                    : billingData["elements"].ToInt64() / Math.Pow(10, 9); // convert measurement to billion

                var billingInfo = new CRABillingInfo(analysisStartTime, analysisEndTime,
                    startDateTime, endDateTime, adjustedStartTime, adjustedEndTime, deletedTime, s["status"].ToString(), dataElements);

                var currentAnalysisUser = _users[s["createdBy"].ToString()];


                var billingEntrySessions = new List<BillingEntrySession>();
                //parsing session data for current simulation
                if(analysisSessionData.ContainsKey(s["_id"].ToString()))
                {
                    var sessions = new List<Session>();
                    (analysisSessionData[s["_id"].ToString()]).ForEach(session =>
                    {
                        var sessionStartTime = session["createdTime"];
                        var sessionEndTime = session["endTime"];
                        var currentUserId = session["createdBy"];
                        sessions.Add(new Session((System.DateTime) sessionStartTime, (System.DateTime) sessionEndTime, (string) currentUserId, "CRA"));
                    });
                    var sessionInfo = analysisSessionData[s["_id"].ToString()][0];
                    billingEntrySessions.Add(new BillingEntrySession(
                        DateTime.MaxValue, // startTime not used
                        (System.DateTime)sessionInfo["endTime"],
                        (string)sessionInfo["version"],
                        (string)sessionInfo["climateRiskAnalysis"],
                        (string)sessionInfo["createdBy"],
                        sessions));
                }

                result.Add(new CRABillingEntry(s["_id"].ToString(), s["name"].ToString(), s["status"].ToString(), "No Grid",
                    s["createdBy"].ToString(), deletedTime,
                    s.Contains("sessionBillingOnly") && s["sessionBillingOnly"] == BsonBoolean.True,
                    "no-job-id",
                    billingInfo, billingEntrySessions, gridStatus,
                    rates, _users));
                return Task.FromResult(0);
            }));

            await Task.WhenAll(tasks);
            billingEntries.AddRange(result);
        }

        /// <summary>
        /// This function gets analysis data from Analysiss and DeletedAnalyses table for calculating billing report. The result is consisted of 3 parts:
        ///     1. Analyses that will be used for calculating analysis charge.
        ///     2. Deleted analyses that will be used for calculating analysis charge.
        ///     3. Analyses that will be used only for query session charge.
        /// </summary>
        /// <param name="omdb"></param>
        /// <param name="startDateTime"></param>
        /// <param name="endDateTime"></param>
        /// <param name="users"></param>
        /// <param name="analysisIdsFromSession"></param>
        /// <returns></returns>
        public async static Task<List<BsonDocument>> getAnalysisData(OmdbService omdb, IMongoDatabase db, DateTime startDateTime,
            DateTime endDateTime, List<string> users, IEnumerable<string> analysisIdsFromSession)
        {
            var result = new List<BsonDocument>();
            var tasks = new List<Task<List<BsonDocument>>>();
            var CRACollection = db.GetCollectionWithSecondaryPref("ClimateRiskAnalysis");
            // var endDateUnixTime = new DateTimeOffset(endDateTime);
            var filter = Builders<BsonDocument>.Filter;

            // get data from ClimateRiskAnalysis table
            var filter1 = filter.Exists("billingInformation") &
                          filter.Ne("billingInformation", BsonNull.Value) &
                          filter.Exists("billingInformation.elements") &
                          filter.Exists("billingInformation.analysisStartTime") &
                          filter.Exists("billingInformation.analysisEndTime") &
                          filter.Lt("billingInformation.analysisStartTime", endDateTime) &
                          filter.Gte("billingInformation.analysisStartTime",
                              new DateTime(1970, 1, 1, 0, 0, 0, 0)); // filter out bad data created by a bug in Julia
            var filter3 = filter.In("createdBy", users);

            // var filter4 = filter.In("status", new string[]{"Complete", "Running", "Failed"});
            var versionFilter = filter.Exists("version") & filter.Ne("version", BsonString.Empty) & filter.Lte("version", omdb.schemaVersion);


            var projection = Builders<BsonDocument>.Projection
                .Include(s => s["billingInformation"])
                .Include(s => s["deletedTime"])
                .Include(s => s["createdBy"])
                .Include(s => s["name"])
                .Include(s => s["status"]);
            tasks.Add(getAnalysisDataAsync(CRACollection, filter1 & filter3 & versionFilter, projection,
                (f) => { if(!f.Contains("deletedTime")) f.Add("deletedTime", BsonNull.Value); }));

            // get data from DeletedClimateRiskAnalysis table
            var deletedCRACollection = db.GetCollectionWithSecondaryPref("DeletedClimateRiskAnalysis");
            var filter2 = filter.Gte("deletedTime", DateTime.SpecifyKind(startDateTime, DateTimeKind.Utc));
            tasks.Add(getAnalysisDataAsync(deletedCRACollection, filter1 & filter2 & filter3 & versionFilter, projection,
                (f) =>
                {
                    if (f["billingInformation"]["analysisEndTime"].IsBsonNull)
                    {
                        f["billingInformation"]["analysisEndTime"] = new BsonInt32((Int32)(f["deletedTime"].AsBsonDateTime.MillisecondsSinceEpoch / 1000));
                    }
                }));

            var results = await Task.WhenAll(tasks); // wait for above 2 queries to finish before proceeding
            results.ForEach(r =>
            {
                result.AddRange(r);
            });

            // get analysis data used only in calculating query sessions from ClimateRiskAnalysis table
            var currentAnalysisIds = new HashSet<string>();
            var currentGridAnalysisIds = result.Select(document => document["_id"].ToString());
            currentAnalysisIds.UnionWith(currentGridAnalysisIds);

            var additionalAnalysisIdsToFetch =
                analysisIdsFromSession.Where(s => !currentAnalysisIds.Contains(s)).Select(s => ObjectId.Parse(s)).ToList();
            var filter5 = filter.In("_id", additionalAnalysisIdsToFetch);
            tasks.Clear();

            tasks.Add(getAnalysisDataAsync(CRACollection, filter1 & filter5 & versionFilter, projection,
                (f) => { f.Add("sessionBillingOnly", BsonValue.Create(true)); if(!f.Contains("deletedTime")) f.Add("deletedTime", BsonNull.Value); }));
            tasks.Add(getAnalysisDataAsync(deletedCRACollection, filter1 & filter5 & versionFilter, projection,
                (f) => { f.Add("sessionBillingOnly", BsonValue.Create(true)); if(!f.Contains("deletedTime")) f.Add("deletedTime", BsonNull.Value);}));
            results = await Task.WhenAll(tasks);

            results.ForEach(r =>
            {
                result.AddRange(r);
            });
            return result;
        }

        /// <summary>
        /// This function is a utility function. It fetches analysis data from db, makes necessary changes (or no changes)
        /// </summary>
        /// <param name="dbTable"></param>
        /// <param name="filter"></param>
        /// <param name="projection"></param>
        /// <param name="processFunc">Modifications that will be applied to each documents being fetched.</param>
        /// <returns></returns>
        private static async Task<List<BsonDocument>> getAnalysisDataAsync(IMongoCollection<BsonDocument> dbTable,
            FilterDefinition<BsonDocument> filter, ProjectionDefinition<BsonDocument> projection, Action<BsonDocument> processFunc)
        {
            var analyses = await DbUtils.getDbData(dbTable, filter, projection);
            var result = new List<BsonDocument>();
            await analyses.ForEachAsync(s =>
            {
                processFunc(s);
                result.Add(s);
            });
            return result;
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="omdb"></param>
        /// <param name="startDateTime"></param>
        /// <param name="endDateTime"></param>
        /// <param name="userIds"></param>
        /// <returns>Get all session data that matches given time interval. Filter out entries created by users we are not
        ///          interested. </returns>
        public static async Task<Dictionary<string, List<Dictionary<string, object>>>> getCRASessionData(
            OmdbService omdb, IMongoDatabase db, DateTime startDateTime,
            DateTime endDateTime, List<string> userIds)
        {
            var userSet = new HashSet<string>(userIds);
            var CRASessionCollection = db.GetCollectionWithSecondaryPref("ClimateRiskAnalysisSession");
            var filter = Builders<BsonDocument>.Filter;

            var filter1 = filter.Lt("createdTime", DateTime.SpecifyKind(endDateTime, DateTimeKind.Utc));
            var filter2 = !filter.Exists("endTime") | (filter.Exists("endTime") & (filter.Eq("endTime", BsonNull.Value) | filter.Gte("endTime", DateTime.SpecifyKind(startDateTime, DateTimeKind.Utc))));
            var versionFilter = filter.Exists("version") & filter.Ne("version", BsonString.Empty) & filter.Lte("version", omdb.schemaVersion);

            var projection = Builders<BsonDocument>.Projection
                .Include(s => s["endTime"])
                .Include(s => s["climateRiskAnalysis"])
                .Include(s => s["createdTime"])
                .Include(s => s["createdBy"])
                .Include(s => s["version"]);
            var sessions = await DbUtils.getDbData(CRASessionCollection, filter1 & filter2 & versionFilter, projection);

            var resultByClimateRiskAnalyisId = new Dictionary<string, List<Dictionary<string, object>>>();
            await sessions.ForEachAsync(s =>
            {
                var currentClimateRiskAnalyisId = s["climateRiskAnalysis"].ToString();
                if (userSet.Contains((string) s["createdBy"])) // only return session where there is user that we are interested
                {
                    var currentCRASession = new Dictionary<string, object>
                    {
                        {"climateRiskAnalysis", currentClimateRiskAnalyisId},
                        {"createdTime", s["createdTime"].AsBsonDateTime.ToUniversalTime()},
                        {"createdBy", s["createdBy"].ToString()},
                        {"version", s["version"].ToString()},
                    };
                    if (s.Contains("endTime") && !s["endTime"].IsBsonNull)
                    {
                        currentCRASession.Add("endTime", s["endTime"].AsBsonDateTime.ToUniversalTime());
                    }
                    else
                    {
                        currentCRASession.Add("endTime", s["createdTime"].AsBsonDateTime.ToUniversalTime().AddSeconds(1));
                    }

                    if (!resultByClimateRiskAnalyisId.ContainsKey(currentClimateRiskAnalyisId))
                    {
                        resultByClimateRiskAnalyisId.Add(currentClimateRiskAnalyisId, new List<Dictionary<string, object>>());
                    }

                    resultByClimateRiskAnalyisId[currentClimateRiskAnalyisId].Add(currentCRASession);
                }
            });
            return resultByClimateRiskAnalyisId;
        }

        /// <summary>
        /// This function sorts each value (list of analysis data) by start time.
        /// </summary>
        /// <param name="analysisData"></param>
        public static void sortAnalysisData(List<BsonDocument> analysisData)
        {
            analysisData.Sort((x, y) => x["billingInformation"]["analysisStartTime"].CompareTo(y["billingInformation"]["analysisStartTime"]));
        }

        /// <summary>
        /// This function fetches mocked status data, as climate risk analyzer does not use a grid
        /// </summary>
        /// <param name="analysisData"></param>
        /// <returns></returns>
        public static AggregateCpuTime getGridStatusData(List<BsonDocument> analysisData)
        {
            var gridStatus = new List<BsonDocument>();
            return new AggregateCpuTime(gridStatus.ToList());
        }

        public static void adjustAnalysisStartEndTime(List<BsonDocument> analysisData)
        {
            var adjustedStartEndTimes = extractAndSortJobStartEndTime(analysisData);

            using (var adjustedStartEndTimeEnumerator = adjustedStartEndTimes.GetEnumerator())
            {
                analysisData.ForEach(simDocument =>
                {
                    adjustedStartEndTimeEnumerator.MoveNext();
                    // need to tell BsonDocument that the added date time is UTC, otherwise it will think they are local time and convert them to UTC
                    simDocument.Add("adjustedStartTime", DateTime.SpecifyKind(adjustedStartEndTimeEnumerator.Current.Item1, DateTimeKind.Utc));
                    simDocument.Add("adjustedEndTime", DateTime.SpecifyKind(adjustedStartEndTimeEnumerator.Current.Item2, DateTimeKind.Utc));
                });
            }
        }

        /// <summary>
        /// This function extracts start and end time for each analysis and sort them based on start time. Given 2 consecutive sims:
        ///     1. If sim 2 is completely overlapped with sim 1, start and end time of sim 2 will be set to the end time of sim1.
        ///     2. If sim 2 is partially overlapped with sim 1, Do not update start end time. Do double counting.
        ///     3. If no overlap, nothing will happen.
        /// </summary>
        /// <param name="analyses"></param>
        /// <returns></returns>
        public static List<Tuple<DateTime, DateTime>> extractAndSortJobStartEndTime(List<BsonDocument> analyses)
        {
            var adjustedStartEndTimes = new List<Tuple<DateTime, DateTime>>();
            var firstAnalysisBillingInfo = analyses.First()["billingInformation"].AsBsonDocument;
            var currentStartTime = new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(firstAnalysisBillingInfo["analysisStartTime"].AsBsonDateTime.MillisecondsSinceEpoch / 1000);
            var currentEndTime = !firstAnalysisBillingInfo.Contains("analysisEndTime") ||
                                 firstAnalysisBillingInfo["analysisEndTime"].IsBsonNull
                ? DateTime.MaxValue
                : new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(firstAnalysisBillingInfo["analysisEndTime"]
                    .AsBsonDateTime.MillisecondsSinceEpoch / 1000);
            adjustedStartEndTimes.Add(Tuple.Create(currentStartTime, currentEndTime));

            for (var i = 1; i < analyses.Count; ++i)
            {
                var currentBillingInfo = analyses[i]["billingInformation"].AsBsonDocument;
                var currentSimStartTime =
                    new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(currentBillingInfo["analysisStartTime"].AsBsonDateTime.MillisecondsSinceEpoch / 1000);
                var currentSimEndTime = currentBillingInfo["analysisEndTime"].IsBsonNull
                    ? DateTime.MaxValue
                    : new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(currentBillingInfo["analysisEndTime"].AsBsonDateTime.MillisecondsSinceEpoch / 1000);

                if (DateTime.Compare(currentSimEndTime, currentEndTime) <= 0) // complete overlap
                {
                    adjustedStartEndTimes.Add(Tuple.Create(currentEndTime, currentEndTime));
                }
                else
                {
                    adjustedStartEndTimes.Add(Tuple.Create(currentSimStartTime, currentSimEndTime));
                    currentEndTime = currentSimEndTime;
                }
            }

            return adjustedStartEndTimes;
        }
    }
}

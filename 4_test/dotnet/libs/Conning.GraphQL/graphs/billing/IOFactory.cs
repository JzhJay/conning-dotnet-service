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
    public class IOFactory : BillingFactory
    {
        public IOFactory(BaseUserService userService, OmdbService omdb, IMongoDatabase db, DateTime startDateFromInput, DateTime endDateFromInput,
            List<string> usersFromInput, Dictionary<string, object> rates, Dictionary<string, ConningUser> users) : base(userService, omdb, db, startDateFromInput, endDateFromInput, usersFromInput, rates, users)
        {
        }

        public async override Task createBillingEntries(List<BillingEntry> billingEntries)
        {
            var optimizationSessionData =
                await getOptimizationSessionData(_omdb, _db, startDateTime, endDateTime,
                    userIds);

            var optimizationData = await getOptimizationData(_omdb, _db, startDateTime, endDateTime,
                userIds, optimizationSessionData.Keys);

            sortOptimizationData(optimizationData);

            var gridStatusByGridName = await getGridStatusData(_omdb, _db, optimizationData);

            adjustOptimizationStartEndTime(optimizationData, gridStatusByGridName);

            var tasks = new List<Task>();
            var result = new List<BillingEntry>();

            optimizationData.ForEach(IOByGrid => tasks.AddRange(IOByGrid.Value.Select(s =>
            {
                var billingData = s["billingInformation"].AsBsonDocument;
                var optimizationStartTime = billingData["optimizationStartTime"].AsBsonDateTime.ToUniversalTime();
                var optimizationEndTime = billingData["optimizationEndTime"].IsBsonNull
                    ? DateTime.MaxValue
                    : billingData["optimizationEndTime"].AsBsonDateTime.ToUniversalTime();
                var deletedTime = s["deletedTime"].IsBsonNull
                    ? DateTime.MaxValue
                    : s["deletedTime"].AsBsonDateTime.ToUniversalTime();

                var adjustedStartTime = s["adjustedStartTime"].AsBsonDateTime.ToUniversalTime();
                var adjustedEndTime = s["adjustedEndTime"].AsBsonDateTime.ToUniversalTime();

                var dataElements = !billingData.Contains("elements") || billingData["elements"].IsBsonNull
                    ? 0
                    : billingData["elements"].ToInt64() / Math.Pow(10, 9); // convert measurement to billion

                // Use the following two variables if the grid is "no-grid" such as on cluster-native-ao
                var instanceType = !billingData.Contains("instanceType") || billingData["instanceType"].IsBsonNull
                    ? string.Empty : billingData["instanceType"].AsString;

                var numberOfInstances = !billingData.Contains("numberOfInstances") || billingData["numberOfInstances"].IsBsonNull
                    ? 0 : billingData["numberOfInstances"].ToInt64();

                var billingInfo = new IOBillingInfo(optimizationStartTime, optimizationEndTime,
                    startDateTime, endDateTime, adjustedStartTime, adjustedEndTime, deletedTime, s["status"].ToString(), dataElements,
                    instanceType, numberOfInstances);

                var currentOptimizationUser = _users[s["createdBy"].ToString()];


                var billingEntrySessions = new List<BillingEntrySession>();
                //parsing session data for current simulation
                if(optimizationSessionData.ContainsKey(s["_id"].ToString()))
                {
                    (optimizationSessionData[s["_id"].ToString()]).ForEach(session =>
                    {
                        var sessions = new List<Session>();
        	            ((IEnumerable<BsonDocument>) session["userSessions"]).ForEach(q =>
        	            {
        		            var userSessionStartTime = q["startTime"].AsBsonDateTime.ToUniversalTime();
                            var userSessionEndTime = q["endTime"].AsBsonDateTime.ToUniversalTime();
        		            var currentUserId = q["userId"].ToString();
        		            sessions.Add(new Session(userSessionStartTime, userSessionEndTime, currentUserId, "optimization"));
        	            });

                        billingEntrySessions.Add(new BillingEntrySession(
                            DateTime.MaxValue, // startTime not used
                            (System.DateTime)session["endTime"],
                            (string)session["version"],
                            (string)session["optimization"],
                            (string)session["createdBy"],
                            sessions));
                    });
                }

                result.Add(new IOBillingEntry(s["_id"].ToString(), s["name"].ToString(), s["status"].ToString(), s["gridName"].ToString(),
                    s["createdBy"].ToString(), deletedTime,
                    s.Contains("sessionBillingOnly") && s["sessionBillingOnly"] == BsonBoolean.True,
                    s.Contains("jobIds") ? s["jobIds"][0].ToString() : "no-job-id",
                    billingInfo, billingEntrySessions, gridStatusByGridName[s["gridName"].ToString()],
                    rates, _users));
                return Task.FromResult(0);
            })));

            await Task.WhenAll(tasks);
            billingEntries.AddRange(result);
        }

        /// <summary>
        /// This function gets optimization data from Optimizations and DeletedOptimizations table for calculating billing report. The result is consisted of 3 parts:
        ///     1. Optimizations that will be used for calculating optimization charge.
        ///     2. Deleted optimizations that will be used for calculating optimization charge.
        ///     3. Optimizations that will be used only for query session charge.
        /// </summary>
        /// <param name="omdb"></param>
        /// <param name="startDateTime"></param>
        /// <param name="endDateTime"></param>
        /// <param name="users"></param>
        /// <param name="optimizationIdsFromSession"></param>
        /// <returns></returns>
        public async static Task<Dictionary<string, List<BsonDocument>>> getOptimizationData(OmdbService omdb, IMongoDatabase db, DateTime startDateTime,
            DateTime endDateTime, List<string> users, IEnumerable<string> optimizationIdsFromSession)
        {
            var result = new Dictionary<string, List<BsonDocument>>();
            var tasks = new List<Task<Dictionary<string, List<BsonDocument>>>>();
            var IOCollection = db.GetCollectionWithSecondaryPref("InvestmentOptimization");
            // var endDateUnixTime = new DateTimeOffset(endDateTime);
            var filter = Builders<BsonDocument>.Filter;

            // get data from Optimizations table
            var filter1 = filter.Exists("billingInformation") &
                          filter.Ne("billingInformation", BsonNull.Value) &
                          filter.Exists("billingInformation.elements") &
                          filter.Exists("billingInformation.optimizationStartTime") &
                          filter.Exists("billingInformation.optimizationEndTime") &
                          filter.Lt("billingInformation.optimizationStartTime", endDateTime) &
                          filter.Gte("billingInformation.optimizationStartTime",
                              new DateTime(1970, 1, 1, 0, 0, 0, 0)); // filter out bad data created by a bug in Julia
            var filter3 = filter.In("createdBy", users);

            var filter4 = filter.In("status", new string[]{"Complete", "Running", "Failed"});
            var versionFilter = filter.Exists("version") & filter.Ne("version", BsonString.Empty) & filter.Lte("version", omdb.schemaVersion);


            var projection = Builders<BsonDocument>.Projection
                .Include(s => s["billingInformation"])
                .Include(s => s["deletedTime"])
                .Include(s => s["createdBy"])
                .Include(s => s["name"])
                .Include(s => s["status"])
                .Include(s => s["gridName"]);
            tasks.Add(getOptimizationDataAndGroupByGridAsync(IOCollection, filter1 & filter3 & filter4 & versionFilter, projection,
                (f) => { if(!f.Contains("deletedTime")) f.Add("deletedTime", BsonNull.Value); }));

            // get data from DeletedOptimizations table
            var deletedIOCollection = db.GetCollectionWithSecondaryPref("DeletedInvestmentOptimization");
            var filter2 = filter.Gte("deletedTime", DateTime.SpecifyKind(startDateTime, DateTimeKind.Utc));
            tasks.Add(getOptimizationDataAndGroupByGridAsync(deletedIOCollection, filter1 & filter2 & filter3 & filter4 & versionFilter, projection,
                (f) =>
                {
                    if (f["billingInformation"]["optimizationEndTime"].IsBsonNull)
                    {
                        f["billingInformation"]["optimizationEndTime"] = new BsonInt32((Int32)(f["deletedTime"].AsBsonDateTime.MillisecondsSinceEpoch / 1000));
                    }
                }));

            var results = await Task.WhenAll(tasks); // wait for above 2 queries to finish before proceeding
            results.ForEach(r => r.ForEach(s =>
            {
                if(!result.ContainsKey(s.Key)) result.Add(s.Key, new List<BsonDocument>());
                result[s.Key].AddRange(s.Value);
            }));

            // get optimization data used only in calculating query sessions from Optimization table
            var currentOptimizationIds = new HashSet<string>();
            result.ForEach(s =>
            {
                var currentGridOptimizationIds = s.Value.Select(document => document["_id"].ToString());
                currentOptimizationIds.UnionWith(currentGridOptimizationIds);
            });
            var additionalOptimizationIdsToFetch =
                optimizationIdsFromSession.Where(s => !currentOptimizationIds.Contains(s)).Select(s => ObjectId.Parse(s)).ToList();
            var filter5 = filter.In("_id", additionalOptimizationIdsToFetch);
            tasks.Clear();

            tasks.Add(getOptimizationDataAndGroupByGridAsync(IOCollection, filter1 & filter4 & filter5 & versionFilter, projection,
                (f) => { f.Add("sessionBillingOnly", BsonValue.Create(true)); if(!f.Contains("deletedTime")) f.Add("deletedTime", BsonNull.Value); }));
            tasks.Add(getOptimizationDataAndGroupByGridAsync(deletedIOCollection, filter1 & filter4 & filter5 & versionFilter, projection,
                (f) => { f.Add("sessionBillingOnly", BsonValue.Create(true)); if(!f.Contains("deletedTime")) f.Add("deletedTime", BsonNull.Value); }));
            results = await Task.WhenAll(tasks);

            results.ForEach(r => r.ForEach(s =>
            {
                if(!result.ContainsKey(s.Key)) result.Add(s.Key, new List<BsonDocument>());
                result[s.Key].AddRange(s.Value);
            }));
            return result;
        }

        /// <summary>
        /// This function is a utility function. It fetches optimization data from db, makes necessary changes (or no changes) and groups
        /// them by grid name.
        /// </summary>
        /// <param name="dbTable"></param>
        /// <param name="filter"></param>
        /// <param name="projection"></param>
        /// <param name="processFunc">Modifications that will be applied to each documents being fetched.</param>
        /// <returns></returns>
        private static async Task<Dictionary<string, List<BsonDocument>>> getOptimizationDataAndGroupByGridAsync(IMongoCollection<BsonDocument> dbTable,
            FilterDefinition<BsonDocument> filter, ProjectionDefinition<BsonDocument> projection, Action<BsonDocument> processFunc)
        {
            var query = await DbUtils.getDbData(dbTable, filter, projection);
            var result = new Dictionary<string, List<BsonDocument>>();
            await query.ForEachAsync(s =>
            {
                processFunc(s);
                if(!s.Contains("gridName")) s.Add("gridName", BsonValue.Create("no-grid"));
                var currentGrid = s["gridName"].ToString();
                if (!result.ContainsKey(currentGrid))
                {
                    result.Add(currentGrid, new List<BsonDocument>());
                }

                result[currentGrid].Add(s);
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
        /// <returns>Get all simulation session data that matches given time interval. Filter out entries created by users we are not
        ///          interested. </returns>
        public static async Task<Dictionary<string, List<Dictionary<string, object>>>> getOptimizationSessionData(
            OmdbService omdb, IMongoDatabase db, DateTime startDateTime,
            DateTime endDateTime, List<string> userIds)
        {
            var userSet = new HashSet<string>(userIds);
            var optimizationSessionCollection = db.GetCollectionWithSecondaryPref("InvestmentOptimizationSession");
            var filter = Builders<BsonDocument>.Filter;

            var filter1 = filter.Lt("createdTime", DateTime.SpecifyKind(endDateTime, DateTimeKind.Utc));
            var filter2 = !filter.Exists("endTime") | (filter.Exists("endTime") & filter.Gte("endTime", DateTime.SpecifyKind(startDateTime, DateTimeKind.Utc)));
            var filter3 = filter.Exists("userSessions");
            var versionFilter = filter.Exists("version") & filter.Ne("version", BsonString.Empty) & filter.Lte("version", omdb.schemaVersion);

            var projection = Builders<BsonDocument>.Projection
                .Include(s => s["endTime"])
                .Include(s => s["userSessions"])
                .Include(s => s["optimization"])
                .Include(s => s["createdTime"])
                .Include(s => s["createdBy"])
                .Include(s => s["version"]);
            var session = await DbUtils.getDbData(optimizationSessionCollection, filter1 & filter2 & filter3 & versionFilter, projection);

            var resultByOptimizationId = new Dictionary<string, List<Dictionary<string, object>>>();
            await session.ForEachAsync(s =>
            {
                var currentOptimizationId = s["optimization"].ToString();
                var validUserSessions = s["userSessions"].AsBsonArray.Where(q => q.AsBsonDocument
                    .Contains("userId") && !q["userId"].IsBsonNull && userSet.Contains(q["userId"].ToString()))
                    .Select(q => q.AsBsonDocument); // filter out entries created by user we are not interested

                validUserSessions.ForEach(t =>
                {
                    if (t["endTime"].IsBsonNull)
                    {
                      t["endTime"] = new BsonDateTime(endDateTime);
                    }
                });

                if (validUserSessions.Any()) // only return simulation session where there is query session that we are interested
                {
                    var currentOptimizationSession = new Dictionary<string, object>
                    {
                        {"optimization", currentOptimizationId},
                        {"userSessions", validUserSessions},
                        {"createdTime", s["createdTime"].AsBsonDateTime.ToUniversalTime()},
                        {"createdBy", s["createdBy"].ToString()},
                        {"version", s["version"].ToString()},
                    };
                    if (s.Contains("endTime") && !s["endTime"].IsBsonNull)
                    {
                        currentOptimizationSession.Add("endTime", s["endTime"].AsBsonDateTime.ToUniversalTime());
                    }
                    else
                    {
                        currentOptimizationSession.Add("endTime", DateTime.MaxValue);
                    }

                    if (!resultByOptimizationId.ContainsKey(currentOptimizationId))
                    {
                        resultByOptimizationId.Add(currentOptimizationId, new List<Dictionary<string, object>>());
                    }

                    resultByOptimizationId[currentOptimizationId].Add(currentOptimizationSession);
                }
            });

            return resultByOptimizationId;
        }

        /// <summary>
        /// This function sorts each value (list of optimization data) by start time.
        /// </summary>
        /// <param name="optimizationData"></param>
        public static void sortOptimizationData(Dictionary<string, List<BsonDocument>> optimizationData)
        {
            optimizationData.ForEach(s =>
            {
                s.Value.Sort((x, y) => x["billingInformation"]["optimizationStartTime"].CompareTo(y["billingInformation"]["optimizationStartTime"]));
            });
        }

        /// <summary>
        /// This function fetches grid status data for a set of grids
        /// </summary>
        /// <param name="omdb"></param>
        /// <param name="optimizationData"></param>
        /// <returns></returns>
        public static async Task<Dictionary<string, AggregateCpuTime>> getGridStatusData(OmdbService omdb, IMongoDatabase db,
            Dictionary<string, List<BsonDocument>> optimizationData)
        {
            var earliestTimeStampByGrid = new Dictionary<string, DateTime>();
            var latestTimeStampByGrid = new Dictionary<string, DateTime>();

            optimizationData.ForEach(s =>
            {
                earliestTimeStampByGrid.Add(s.Key, new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(s.Value[0]["billingInformation"]["optimizationStartTime"].AsBsonDateTime.MillisecondsSinceEpoch / 1000));
                var lastBillingInfo = s.Value.Last()["billingInformation"].AsBsonDocument;
                DateTime latestTimeStamp = lastBillingInfo.Contains("optimizationEndTime") && !lastBillingInfo["optimizationEndTime"].IsBsonNull
                    ? new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(lastBillingInfo["optimizationEndTime"].AsBsonDateTime.MillisecondsSinceEpoch / 1000)
                    : DateTime.MaxValue;
                latestTimeStampByGrid.Add(s.Key, latestTimeStamp);
            });

            var result = new Dictionary<string, AggregateCpuTime>();
            var allTasks = earliestTimeStampByGrid.Select(s => DbUtils.getGridStatusDataByGrid(omdb, db, s.Key, s.Value, latestTimeStampByGrid[s.Key]));
            var aggregateCpuTimes = await Task.WhenAll(allTasks);
            aggregateCpuTimes.ForEach(a => result.Add(a.Item1, a.Item2));
            return result;
        }

        public static void adjustOptimizationStartEndTime(Dictionary<string, List<BsonDocument>> optimizationData, Dictionary<string, AggregateCpuTime> gridCpuTime)
        {
            optimizationData.ForEach(s =>
            {
                var adjustedStartEndTimes = extractAndSortJobStartEndTime(s.Value);

                using (var adjustedStartEndTimeEnumerator = adjustedStartEndTimes.GetEnumerator())
                {
                    s.Value.ForEach(simDocument =>
                    {
                        adjustedStartEndTimeEnumerator.MoveNext();
                        // need to tell BsonDocument that the added date time is UTC, otherwise it will think they are local time and convert them to UTC
                        simDocument.Add("adjustedStartTime", DateTime.SpecifyKind(adjustedStartEndTimeEnumerator.Current.Item1, DateTimeKind.Utc));
                        simDocument.Add("adjustedEndTime", DateTime.SpecifyKind(adjustedStartEndTimeEnumerator.Current.Item2, DateTimeKind.Utc));
                    });
                }
            });
        }

        /// <summary>
        /// This function extracts start and end time for each optimization and sort them based on start time. Given 2 consecutive sims:
        ///     1. If sim 2 is completely overlapped with sim 1, start and end time of sim 2 will be set to the end time of sim1.
        ///     2. If sim 2 is partially overlapped with sim 1, Do not update start end time. Do double counting.
        ///     3. If no overlap, nothing will happen.
        /// </summary>
        /// <param name="optimizations"></param>
        /// <returns></returns>
        public static List<Tuple<DateTime, DateTime>> extractAndSortJobStartEndTime(List<BsonDocument> optimizations)
        {
            var adjustedStartEndTimes = new List<Tuple<DateTime, DateTime>>();
            var firstOptimizationBillingInfo = optimizations.First()["billingInformation"].AsBsonDocument;
            var currentStartTime = new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(firstOptimizationBillingInfo["optimizationStartTime"].AsBsonDateTime.MillisecondsSinceEpoch / 1000);
            var currentEndTime = !firstOptimizationBillingInfo.Contains("optimizationEndTime") ||
                                 firstOptimizationBillingInfo["optimizationEndTime"].IsBsonNull
                ? DateTime.MaxValue
                : new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(firstOptimizationBillingInfo["optimizationEndTime"]
                    .AsBsonDateTime.MillisecondsSinceEpoch / 1000);
            adjustedStartEndTimes.Add(Tuple.Create(currentStartTime, currentEndTime));

            for (var i = 1; i < optimizations.Count; ++i)
            {
                var currentBillingInfo = optimizations[i]["billingInformation"].AsBsonDocument;
                var currentSimStartTime =
                    new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(currentBillingInfo["optimizationStartTime"].AsBsonDateTime.MillisecondsSinceEpoch / 1000);
                var currentSimEndTime = currentBillingInfo["optimizationEndTime"].IsBsonNull
                    ? DateTime.MaxValue
                    : new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(currentBillingInfo["optimizationEndTime"].AsBsonDateTime.MillisecondsSinceEpoch / 1000);

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

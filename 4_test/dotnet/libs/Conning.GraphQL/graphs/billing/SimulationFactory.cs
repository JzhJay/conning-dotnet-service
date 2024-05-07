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
    public class SimulationFactory : BillingFactory
    {
        public SimulationFactory(BaseUserService userService, OmdbService omdb, IMongoDatabase db, DateTime startDateFromInput, DateTime endDateFromInput,
            List<string> usersFromInput, Dictionary<string, object> rates, Dictionary<string, ConningUser> users) : base(userService, omdb, db, startDateFromInput, endDateFromInput, usersFromInput, rates, users)
        {
        }

        public async override Task createBillingEntries(List<BillingEntry> billingEntries)
        {
            var simulationSessionData =
                await getSimulationSessionData(_omdb, _db, startDateTime, endDateTime,
                    userIds); // simulationIds => list of simulation sessions

            var RSSimulationSessionData =
                await getRSSimulationSessionData(_omdb, _db, startDateTime, endDateTime,
                    userIds); // simulationIds => list of simulation sessions

            var simulationData = await getSimulationData(_omdb, _db, startDateTime, endDateTime,
                userIds, simulationSessionData.Keys.Concat(RSSimulationSessionData.Keys).ToList());

            sortSimulationData(simulationData);

            var gridStatusByGridName = await getGridStatusData(_omdb, _db, simulationData);

            adjustSimulationStartEndTime(simulationData, gridStatusByGridName);

            var tasks = new List<Task>();
            var result = new List<BillingEntry>();

            simulationData.ForEach(simsByGrid => tasks.AddRange(simsByGrid.Value.Select(s =>
            {
                var billingData = s["billingInformation"].AsBsonDocument;
                var simulationStartTime = new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(GetBillingStartTime(billingData));
                var simulationEndTime = !billingData.Contains("simulationWorkerEndTime") || billingData["simulationWorkerEndTime"].IsBsonNull
                    ? DateTime.MaxValue
                    : new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(billingData["simulationWorkerEndTime"].ToInt64());
                var deletedTime = s["deletedTime"].IsBsonNull
                    ? DateTime.MaxValue
                    : s["deletedTime"].AsBsonDateTime.ToUniversalTime();

                var adjustedStartTime = s["adjustedStartTime"].AsBsonDateTime.ToUniversalTime();
                var adjustedEndTime = s["adjustedEndTime"].AsBsonDateTime.ToUniversalTime();
                var compilationEndTime = !billingData.Contains("compilationEndTime") || billingData["compilationEndTime"].IsBsonNull
    	            ? DateTime.MaxValue
                    : new DateTime(1970, 1, 1, 0, 0, 0, 0)
    					.AddSeconds(billingData["compilationEndTime"].ToInt64());

                var dataElements = !billingData.Contains("elements") || billingData["elements"].IsBsonNull
                    ? 0
                    : billingData["elements"].ToInt64() / Math.Pow(10, 9); // convert measurement to billion

                var provisionedDataElements = !billingData.Contains("provisionedElements") || billingData["provisionedElements"].IsBsonNull
                    ? dataElements
                    : billingData["provisionedElements"].ToInt64() / Math.Pow(10, 9); // convert measurement to billion

                var billingInfo = new SimulationBillingInfo(simulationStartTime, simulationEndTime,
                    startDateTime, endDateTime, adjustedStartTime, adjustedEndTime, deletedTime, compilationEndTime, s["status"].ToString(), provisionedDataElements, dataElements);

                var currentSimulationUser = _users[s["createdBy"].ToString()];


                var billingEntrySessions = new List<BillingEntrySession>();
                //parsing session data for current simulation
                if(simulationSessionData.ContainsKey(s["_id"].ToString()))
                {
                    (simulationSessionData[s["_id"].ToString()]).ForEach(session =>
                    {
                        var sessions = new List<Session>();
        	            ((IEnumerable<BsonDocument>) session["querySessions"]).ForEach(q =>
        	            {
        		            var querySessionStartTime = q["startTime"].AsBsonDateTime.ToUniversalTime();
                            var querySessionEndTime = DateTime.MaxValue; // Not used
        		            var currentUserId = q["userId"].ToString();
        		            sessions.Add(new Session(querySessionStartTime, querySessionEndTime, currentUserId, "Query"));
        	            });

                        billingEntrySessions.Add(new BillingEntrySession(
                            DateTime.MaxValue, // startTime not used
                            (System.DateTime)session["endTime"],
                            (string)session["version"],
                            (string)session["simulation"],
                            (string)session["createdBy"],
                            sessions));
                    });
                }

                if(RSSimulationSessionData.ContainsKey(s["_id"].ToString()))
                {
                    var sessions = new List<Session>();
                    (RSSimulationSessionData[s["_id"].ToString()]).ForEach(session =>
                    {
                        var sessionStartTime = session["createdTime"];
                        var sessionEndTime = session["endTime"];
                        var currentUserId = session["createdBy"];
                        sessions.Add(new Session((System.DateTime) sessionStartTime, (System.DateTime) sessionEndTime, (string) currentUserId, "GEMS"));
                    });
                    var sessionInfo = RSSimulationSessionData[s["_id"].ToString()][0];
                    billingEntrySessions.Add(new BillingEntrySession(
                        DateTime.MaxValue, // startTime not used
                        (System.DateTime)sessionInfo["endTime"],
                        (string)sessionInfo["version"],
                        (string)sessionInfo["simulation"],
                        (string)sessionInfo["createdBy"],
                        sessions));
                }

                result.Add(new SimulationBillingEntry(s["_id"].ToString(), s["name"].ToString(), s["status"].ToString(), getGridNameFromBson(s, ""),
                    s["createdBy"].ToString(), deletedTime,
                    s.Contains("queryBillingOnly") && s["queryBillingOnly"] == BsonBoolean.True,
                    s["sourceType"].ToString(),
                    s.Contains("jobIds") ? s["jobIds"][0].ToString() : "no-job-id",
                    billingInfo, billingEntrySessions, gridStatusByGridName[getGridNameFromBson(s)],
                    rates, _users));
                return Task.FromResult(0);
            })));

            await Task.WhenAll(tasks);
            billingEntries.AddRange(result);
        }

        /// <summary>
        /// This function gets simulation data from Simulations and DeletedSimulations table for calculating billing report. The result is consisted of 3 parts:
        ///     1. Simulations that will be used for calculating simulation charge.
        ///     2. Deleted simulations that will be used for calculating simulation charge.
        ///     3. Simulations that will be used only for query session charge.
        /// </summary>
        /// <param name="omdb"></param>
        /// <param name="startDateTime"></param>
        /// <param name="endDateTime"></param>
        /// <param name="users"></param>
        /// <param name="simulationIdsFromSession"></param>
        /// <returns></returns>
        public async static Task<Dictionary<string, List<BsonDocument>>> getSimulationData(OmdbService omdb,
            DateTime startDateTime,
            DateTime endDateTime, List<string> users, IEnumerable<string> simulationIdsFromSession)
        {
            return SimulationFactory.getSimulationData(omdb, omdb.db, startDateTime, endDateTime, users, simulationIdsFromSession).Result;
        }

        public async static Task<Dictionary<string, List<BsonDocument>>> getSimulationData(OmdbService omdb, IMongoDatabase db, DateTime startDateTime,
            DateTime endDateTime, List<string> users, IEnumerable<string> simulationIdsFromSession)
        {
            var result = new Dictionary<string, List<BsonDocument>>();
            var tasks = new List<Task<Dictionary<string, List<BsonDocument>>>>();
            var simsCollection = db.GetCollectionWithSecondaryPref("Simulation");
            var endDateUnixTime = new DateTimeOffset(endDateTime);
            var filter = Builders<BsonDocument>.Filter;

            // get data from Simulations table
            var filter1 = filter.Exists("billingInformation") &
                          filter.Ne("billingInformation", BsonNull.Value) &
                          filter.Exists("billingInformation.elements") &
                          filter.Exists("billingInformation.startTime") &
                          filter.Exists("billingInformation.simulationWorkerEndTime") &
                          filter.Lt("billingInformation.startTime", endDateUnixTime.ToUnixTimeSeconds()) &
                          filter.Gte("billingInformation.startTime",
                              new DateTimeOffset(new DateTime(1970, 1, 1, 0, 0, 0, 0))
                                  .ToUnixTimeSeconds()); // filter out bad data created by a bug in Julia
            var filter3 = filter.In("createdBy", users);

            var filter4 = filter.In("status", new string[]{"Complete", "Run", "Parse&Compile", "Failed"});
            var versionFilter = filter.Exists("version") & filter.Ne("version", BsonString.Empty) & filter.Lte("version", omdb.schemaVersion);


            var projection = Builders<BsonDocument>.Projection                  // Is not being used
                .Include(s => s["billingInformation"])
                .Include(s => s["deletedTime"])
                .Include(s => s["createdBy"])
                .Include(s => s["name"])
                .Include(s => s["status"])
                .Include(s => s["gridName"]);
            tasks.Add(getSimulationDataAndGroupByGridAsync(simsCollection, filter1 & filter3 & filter4 & versionFilter, projection,
                (f) => {
                    if(!f.Contains("deletedTime"))
                    {
                        f.Add("deletedTime", BsonNull.Value);
                    }
                    if(!f.Contains("sourceType"))
                    {
                        f.Add("sourceType", "Simulation");
                    }
                }));

            // get data from DeletedSimulations table
            var deletedSimsCollection = db.GetCollectionWithSecondaryPref("DeletedSimulation");
            var filter2 = filter.Gte("deletedTime", DateTime.SpecifyKind(startDateTime, DateTimeKind.Utc));
            tasks.Add(getSimulationDataAndGroupByGridAsync(deletedSimsCollection, filter1 & filter2 & filter3 & filter4 & versionFilter, projection,
                (f) =>
                {
                    if (f["billingInformation"]["simulationWorkerEndTime"].IsBsonNull)
                    {
                        f["billingInformation"]["simulationWorkerEndTime"] = new BsonInt32((Int32)(f["deletedTime"].AsBsonDateTime.MillisecondsSinceEpoch / 1000));
                    }
                    if (!f.Contains("sourceType"))
                    {
                        f.Add("sourceType", "Simulation");
                    }
                }));

            var results = await Task.WhenAll(tasks); // wait for above 2 queries to finish before proceeding
            results.ForEach(r => r.ForEach(s =>
            {
                if(!result.ContainsKey(s.Key)) result.Add(s.Key, new List<BsonDocument>());
                result[s.Key].AddRange(s.Value);
            }));

            // get simulation data used only in calculating query sessions from Simulation table
            var currentSimulationIds = new HashSet<string>();
            result.ForEach(s =>
            {
                var currentGridSimulationIds = s.Value.Select(document => document["_id"].ToString());
                currentSimulationIds.UnionWith(currentGridSimulationIds);
            });
            var additionalSimulationIdsToFetch =
                simulationIdsFromSession.Where(s => !currentSimulationIds.Contains(s)).Select(s => ObjectId.Parse(s)).ToList();
            var filter5 = filter.In("_id", additionalSimulationIdsToFetch) & filter.Exists("billingInformation");
            tasks.Clear();

            tasks.Add(getSimulationDataAndGroupByGridAsync(simsCollection, filter4 & filter5 & versionFilter, projection,
                (f) => { f.Add("queryBillingOnly", BsonValue.Create(true));
                    if (!f.Contains("sourceType"))
                    {
                        f.Add("sourceType", "Simulation");
                    }
                }));
            tasks.Add(getSimulationDataAndGroupByGridAsync(deletedSimsCollection, filter4 & filter5 & versionFilter, projection,
                (f) => { f.Add("queryBillingOnly", BsonValue.Create(true));
                    if (!f.Contains("sourceType"))
                    {
                        f.Add("sourceType", "Simulation");
                    }
                }));
            results = await Task.WhenAll(tasks);

            results.ForEach(r => r.ForEach(s =>
            {
                if(!result.ContainsKey(s.Key)) result.Add(s.Key, new List<BsonDocument>());
                result[s.Key].AddRange(s.Value);
            }));
            return result;
        }

        /// <summary>
        /// This function is a utility function. It fetches simulation data from db, makes necessary changes (or no changes) and groups
        /// them by grid name.
        /// </summary>
        /// <param name="dbTable"></param>
        /// <param name="filter"></param>
        /// <param name="projection"></param>
        /// <param name="processFunc">Modifications that will be applied to each documents being fetched.</param>
        /// <returns></returns>
        private static async Task<Dictionary<string, List<BsonDocument>>> getSimulationDataAndGroupByGridAsync(IMongoCollection<BsonDocument> dbTable,
            FilterDefinition<BsonDocument> filter, ProjectionDefinition<BsonDocument> projection, Action<BsonDocument> processFunc)
        {
            var query = await DbUtils.getDbData(dbTable, filter, projection);
            var result = new Dictionary<string, List<BsonDocument>>();
            await query.ForEachAsync(s =>
            {
                processFunc(s);
                var currentGrid = getGridNameFromBson(s);
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
        public static async Task<Dictionary<string, List<Dictionary<string, object>>>> getSimulationSessionData(
            OmdbService omdb, IMongoDatabase db, DateTime startDateTime,
            DateTime endDateTime, List<string> userIds)
        {
            var userSet = new HashSet<string>(userIds);
            var simulationSessionCollection = db.GetCollectionWithSecondaryPref("SimulationSession");
            var filter = Builders<BsonDocument>.Filter;

            var filter1 = filter.Lt("createdTime", DateTime.SpecifyKind(endDateTime, DateTimeKind.Utc));
            var filter2 = !filter.Exists("endTime") | (filter.Exists("endTime") & filter.Gte("endTime", DateTime.SpecifyKind(startDateTime, DateTimeKind.Utc)));
            var filter3 = filter.Exists("querySessions"); // Sometimes not populated due to OOM exit
            var versionFilter = filter.Exists("version") & filter.Ne("version", BsonString.Empty) & filter.Lte("version", omdb.schemaVersion);

            var projection = Builders<BsonDocument>.Projection
                .Include(s => s["endTime"])
                .Include(s => s["querySessions"])
                .Include(s => s["simulation"])
                .Include(s => s["createdTime"])
                .Include(s => s["createdBy"])
                .Include(s => s["version"]);
            var query = await DbUtils.getDbData(simulationSessionCollection, filter1 & filter2 & filter3 & versionFilter, projection);

            var resultBySimulationId = new Dictionary<string, List<Dictionary<string, object>>>();
            await query.ForEachAsync(s =>
            {
                var currentSimulationId = s["simulation"].ToString();
                var validQuerySessions = s["querySessions"].AsBsonArray.Where(q => q.AsBsonDocument
                    .Contains("userId") && !q["userId"].IsBsonNull && userSet.Contains(q["userId"].ToString()) && q["queryId"].ToString().Any())
                    .Select(q => q.AsBsonDocument); // filter out entries created by user we are not interested

                if (validQuerySessions.Any()) // only return simulation session where there is query session that we are interested
                {
                    var currentSimulationSession = new Dictionary<string, object>
                    {
                        {"simulation", currentSimulationId},
                        {"querySessions", validQuerySessions},
                        {"createdTime", s["createdTime"].AsBsonDateTime.ToUniversalTime()},
                        {"createdBy", s["createdBy"].ToString()},
                        {"version", s["version"].ToString()},
                    };
                    if (s.Contains("endTime") && !s["endTime"].IsBsonNull)
                    {
                        currentSimulationSession.Add("endTime", s["endTime"].AsBsonDateTime.ToUniversalTime());
                    }
                    else
                    {
                        currentSimulationSession.Add("endTime", DateTime.MaxValue);
                    }

                    if (!resultBySimulationId.ContainsKey(currentSimulationId))
                    {
                        resultBySimulationId.Add(currentSimulationId, new List<Dictionary<string, object>>());
                    }

                    resultBySimulationId[currentSimulationId].Add(currentSimulationSession);
                }
            });

            return resultBySimulationId;
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
        public static async Task<Dictionary<string, List<Dictionary<string, object>>>> getRSSimulationSessionData(
            OmdbService omdb, IMongoDatabase db, DateTime startDateTime,
            DateTime endDateTime, List<string> userIds)
        {
            var userSet = new HashSet<string>(userIds);
            var RSSimulationSessionCollection = db.GetCollectionWithSecondaryPref("RSSimulationSession");
            var filter = Builders<BsonDocument>.Filter;

            var filter1 = filter.Lt("createdTime", DateTime.SpecifyKind(endDateTime, DateTimeKind.Utc));
            var filter2 = !filter.Exists("endTime") | (filter.Exists("endTime") & filter.Gte("endTime", DateTime.SpecifyKind(startDateTime, DateTimeKind.Utc)));
            var versionFilter = filter.Exists("version") & filter.Ne("version", BsonString.Empty) & filter.Lte("version", omdb.schemaVersion);

            var projection = Builders<BsonDocument>.Projection
                .Include(s => s["endTime"])
                .Include(s => s["simulation"])
                .Include(s => s["createdTime"])
                .Include(s => s["createdBy"])
                .Include(s => s["version"]);
            var session = await DbUtils.getDbData(RSSimulationSessionCollection, filter1 & filter2 & versionFilter, projection);

            var resultBySimulationId = new Dictionary<string, List<Dictionary<string, object>>>();
            await session.ForEachAsync(s =>
            {
                var currentSimulationId = s["simulation"].ToString();

                if (userSet.Contains((string) s["createdBy"])) // only return gems session where there is user that we are interested
                {
                    var currentRSSimulationSession = new Dictionary<string, object>
                    {
                        {"simulation", currentSimulationId},
                        {"createdTime", s["createdTime"].AsBsonDateTime.ToUniversalTime()},
                        {"createdBy", s["createdBy"].ToString()},
                        {"version", s["version"].ToString()},
                    };
                    if (s.Contains("endTime") && !s["endTime"].IsBsonNull)
                    {
                        currentRSSimulationSession.Add("endTime", s["endTime"].AsBsonDateTime.ToUniversalTime());
                    }
                    else
                    {
                        currentRSSimulationSession.Add("endTime", endDateTime);
                    }

                    if (!resultBySimulationId.ContainsKey(currentSimulationId))
                    {
                        resultBySimulationId.Add(currentSimulationId, new List<Dictionary<string, object>>());
                    }

                    resultBySimulationId[currentSimulationId].Add(currentRSSimulationSession);
                }
            });

            return resultBySimulationId;
        }

        /// <summary>
        /// This function sorts each value (list of simulation data) by start time.
        /// </summary>
        /// <param name="simulationData"></param>
        public static void sortSimulationData(Dictionary<string, List<BsonDocument>> simulationData)
        {
            simulationData.ForEach(s =>
            {
                s.Value.Sort((x, y) =>
                {
                    var xStartTime = GetBillingStartTime(x["billingInformation"].AsBsonDocument);
                    var yStartTime = GetBillingStartTime(y["billingInformation"].AsBsonDocument);
                    return xStartTime.CompareTo(yStartTime);
                });
            });
        }

        /// <summary>
        /// This function fetches grid status data for a set of grids
        /// </summary>
        /// <param name="omdb"></param>
        /// <param name="simulationData"></param>
        /// <returns></returns>
        public static async Task<Dictionary<string, AggregateCpuTime>> getGridStatusData(OmdbService omdb, IMongoDatabase db,
            Dictionary<string, List<BsonDocument>> simulationData)
        {
            var earliestTimeStampByGrid = new Dictionary<string, DateTime>();
            var latestTimeStampByGrid = new Dictionary<string, DateTime>();

            simulationData.ForEach(s =>
            {
                var billingInformation = s.Value[0]["billingInformation"].AsBsonDocument;
                var startTimestamp = GetBillingStartTime(billingInformation);
                
                earliestTimeStampByGrid.Add(s.Key, new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(startTimestamp));
                var lastBillingInfo = s.Value.Last()["billingInformation"].AsBsonDocument;
                DateTime latestTimeStamp = lastBillingInfo.Contains("simulationWorkerEndTime") && !lastBillingInfo["simulationWorkerEndTime"].IsBsonNull
                    ? new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(lastBillingInfo["simulationWorkerEndTime"].AsInt32)
                    : DateTime.MaxValue;
                latestTimeStampByGrid.Add(s.Key, latestTimeStamp);
            });

            var result = new Dictionary<string, AggregateCpuTime>();
            var allTasks = earliestTimeStampByGrid.Select(s => DbUtils.getGridStatusDataByGrid(omdb, db, s.Key, s.Value, latestTimeStampByGrid[s.Key]));
            var aggregateCpuTimes = await Task.WhenAll(allTasks);
            aggregateCpuTimes.ForEach(a => result.Add(a.Item1, a.Item2));
            return result;
        }

        public static void adjustSimulationStartEndTime(Dictionary<string, List<BsonDocument>> simulationData, Dictionary<string, AggregateCpuTime> gridCpuTime)
        {
            simulationData.ForEach(s =>
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
        /// This function extracts start and end time for each simulation and sort them based on start time. Given 2 consecutive sims:
        ///     1. If sim 2 is completely overlapped with sim 1, start and end time of sim 2 will be set to the end time of sim1.
        ///     2. If sim 2 is partially overlapped with sim 1, Do not update start end time. Do double counting.
        ///     3. If no overlap, nothing will happen.
        /// </summary>
        /// <param name="simulations"></param>
        /// <returns></returns>
        public static List<Tuple<DateTime, DateTime>> extractAndSortJobStartEndTime(List<BsonDocument> simulations)
        {
            var adjustedStartEndTimes = new List<Tuple<DateTime, DateTime>>();
            var firstSimulationBillingInfo = simulations.First()["billingInformation"].AsBsonDocument;
            var firstSimulationStartTimestamp = GetBillingStartTime(firstSimulationBillingInfo);
            var currentStartTime = new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(firstSimulationStartTimestamp);
            var currentEndTime = !firstSimulationBillingInfo.Contains("simulationWorkerEndTime") ||
                                 firstSimulationBillingInfo["simulationWorkerEndTime"].IsBsonNull
                ? DateTime.MaxValue
                : new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(firstSimulationBillingInfo["simulationWorkerEndTime"]
                    .AsInt32);
            adjustedStartEndTimes.Add(Tuple.Create(currentStartTime, currentEndTime));

            for (var i = 1; i < simulations.Count; ++i)
            {
                var currentBillingInfo = simulations[i]["billingInformation"].AsBsonDocument;
                var currentSimStartTimestamp = GetBillingStartTime(currentBillingInfo);
                var currentSimStartTime =
                    new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(currentSimStartTimestamp);
                var currentSimEndTime = !currentBillingInfo.Contains("simulationWorkerEndTime") || currentBillingInfo["simulationWorkerEndTime"].IsBsonNull
                    ? DateTime.MaxValue
                    : new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(currentBillingInfo["simulationWorkerEndTime"].AsInt32);

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

        /// <summary>
        /// get gridName from simulation data.
        /// billing calculation use this as grouping key, so return it as a non-empty string by default.
        /// </summary>
        /// <param name="simulationData"></param>
        /// <param name="defaultGridName"></param>
        /// <returns></returns>
        private static string getGridNameFromBson(BsonDocument simulationData, string defaultGridName = "No grid")
        {
	        return !simulationData.Contains("gridName") || simulationData["gridName"].IsBsonNull ? defaultGridName : simulationData["gridName"].ToString();
        }

        private static Int32 GetBillingStartTime(BsonDocument billingInformation)
        {
            if (billingInformation.Contains("startTime"))
            {
                return billingInformation["startTime"].AsInt32;
            }

            return 0;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.Runtime.Internal.Transform;
using Auth0.ManagementApi.Models;
using Conning.Db;
using Conning.Db.Services;
using Conning.GraphQL.utility;
using Conning.Library.Utility;
using MongoDB.Bson;
using MongoDB.Driver;
namespace Conning.GraphQL.utility
{
    public class DbUtils
    {
      // todo: what if firstAysnc doesn't exist
      public static async Task<Tuple<string, AggregateCpuTime>> getGridStatusDataByGrid(OmdbService omdb,
          string gridName,
          DateTime earliestJobStartTime, DateTime latestJobEndTime)
      {
          return await getGridStatusDataByGrid(omdb, omdb.db, gridName, earliestJobStartTime, latestJobEndTime);
      }

      public static async Task<Tuple<string, AggregateCpuTime>> getGridStatusDataByGrid(OmdbService omdb, IMongoDatabase db, string gridName,
          DateTime earliestJobStartTime, DateTime latestJobEndTime)
      {
          var gridStatusCollection = db.GetCollection<BsonDocument>("GridStatus");
          var filter = Builders<BsonDocument>.Filter;
          var versionFilter = filter.Exists("version") & filter.Ne("version", BsonString.Empty) & filter.Lte("version", omdb.schemaVersion);
          var projection = Builders<BsonDocument>.Projection
              .Include(s => s["timeStamp"]);
          var gridFilter = filter.Eq("gridName", gridName);
          var queryFilterStartTime = DateTime.MinValue;
          var queryFilterEndTime = DateTime.MaxValue;
          var tasks = new List<Task>();
          // Find the latest time stamp before the earliest job start time
          tasks.Add(Task.Run(async () =>
          {
              var filter1 = filter.Lt("timeStamp", DateTime.SpecifyKind(earliestJobStartTime, DateTimeKind.Utc));
              using (var cursor = await getDbData(gridStatusCollection, filter1 & gridFilter & versionFilter, projection, "timeStamp",
                  false, 1))
              {
                  await cursor.MoveNextAsync(); // this record should always exist
                  if (cursor.Current.Any())
                  {
                      queryFilterStartTime = cursor.Current.First()["timeStamp"].AsBsonDateTime.ToUniversalTime();
                      queryFilterStartTime.AddSeconds(-20); // make sure to include only the latest grid status entry before job starts.
                  }

              }
          }));
          // Find the earliest time stamp after the latest job end time
          tasks.Add(Task.Run(async () =>
          {
              var filter1 = filter.Gte("timeStamp", DateTime.SpecifyKind(latestJobEndTime, DateTimeKind.Utc));
              using (var cursor =
                  await getDbData(gridStatusCollection, filter1 & gridFilter & versionFilter, projection, "timeStamp", true, 1))
              {
                  await cursor.MoveNextAsync();
                  if (cursor.Current.Any()) // this value may not exist
                  {
                      queryFilterEndTime = cursor.Current.First()["timeStamp"].AsBsonDateTime.ToUniversalTime();
                  }
              }
          }));

          await Task.WhenAll(tasks);
          var filter3 = filter.Gte("timeStamp", queryFilterStartTime) & filter.Lte("timeStamp", queryFilterEndTime);
          projection = Builders<BsonDocument>.Projection
              .Include(s => s["timeStamp"])
              .Include(s => s["instanceType"])
              .Include(s => s["windowsInstances"])
              .Include(s => s["linuxInstances"]);
          var query = await getDbData(gridStatusCollection, gridFilter & filter3 & versionFilter, projection, "timeStamp");
          return Tuple.Create(gridName, new AggregateCpuTime(query.ToList()));
      }

      public static Task<IAsyncCursor<BsonDocument>> getDbData(
          IMongoCollection<BsonDocument> dbCollection, FilterDefinition<BsonDocument> filter,
          ProjectionDefinition<BsonDocument> projection, string sortBy = "", bool sortAsc = true, int limit = 0)
      {
          Task<IAsyncCursor<BsonDocument>> result;
          if (sortBy.Any())
          {
              IFindFluent<BsonDocument, BsonDocument> query;
              if (sortAsc)
              {
                  query = limit == 0
                      ? dbCollection.Find(filter).SortBy(x => x[sortBy])
                      : dbCollection.Find(filter).SortBy(x => x[sortBy]).Limit(limit);
              }
              else
              {
                  query = limit == 0
                      ? dbCollection.Find(filter).SortByDescending(x => x[sortBy])
                      : dbCollection.Find(filter).SortByDescending(x => x[sortBy]).Limit(limit);
              }
              result = query.ToCursorAsync();
          }
          else
          {
              var findOption = new FindOptions<BsonDocument, BsonDocument> {};
              result = dbCollection.FindAsync(filter, findOption);
          }

          return result;
      }
    }
}

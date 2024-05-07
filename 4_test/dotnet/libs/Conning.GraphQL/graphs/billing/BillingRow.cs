using System;
using System.Collections.Generic;
using System.Linq;
using Conning.Db.Services;
using GraphQL.Resolvers;
using GraphQL.Types;
using MongoDB.Bson;

namespace Conning.GraphQL
{

	public class SimulationBillingDetailsGraph : ObjectGraphType<SimulationBillingDetails>
	{
		public SimulationBillingDetailsGraph(OmdbService omdb)
		{
			Field(_ => _.simulationStartTime);
			Field(_ => _.simulationFinishTime);
			Field(_ => _.simulationDuration);
			Field(_ => _.vCPUsWindows);
			Field(_ => _.windowsInstanceType);
			Field(_ => _.simulationCharge);
			Field(_ => _.dataElements);
			Field(_ => _.dataServingChargeSimulation);
			Field(_ => _.dataServingChargePerHour);
			Field(_ => _.dataStorageDuration);
			Field(_ => _.dataStorageChargePerDay);
			Field(_ => _.dataStorageCharge);
			Field(_ => _.dataServingDurationQuery);
			Field(_ => _.dataServingChargeQuery);

			this.AddFieldLazy(omdbGraph => new FieldType
			{
				Name = "simulation",
				ResolvedType = omdbGraph.ObjectTypes["Simulation"],
				Resolver = new FuncFieldResolver<SimulationBillingDetails, object>(async ctx =>
				{
					//
					return await omdb.FindOneAsync("Simulation", ctx.Source._id.ToString());
				})
			});
		}
	}

	public class SimulationBillingDetails
	{
		public ObjectId _id { get; set; }
		public DateTime simulationStartTime { get; }
		public DateTime simulationFinishTime { get; }
		public double simulationDuration { get; }
		public int vCPUsWindows { get; }
		public string windowsInstanceType { get; }
		public double simulationCharge { get; set; }

		public double dataElements { get; }

		public double dataServingChargeSimulation { get; }
		public double dataServingChargePerHour { get; }
		public double dataStorageDuration { get; }
		public double dataStorageChargePerDay { get; }
		public double ongoingDataStorageChargePerDay { get; }
		public double dataStorageCharge { get; }
		public double dataServingDurationQuery { get; }
		public double dataServingChargeQuery { get; }

		public SimulationBillingDetails(dynamic dbData, Dictionary<string, object> rates, DateTime startDate, DateTime endDate)
		{
			_id = dbData._id;

			var billingData = dbData.billingInformation;
			DateTime deletedTime;
			if (!DateTime.TryParse(dbData.deletedTime, out deletedTime))
			{
				deletedTime = DateTime.MaxValue;
			}

			simulationStartTime = new DateTime(1970, 1, 1, 0, 0, 0, 0);
			simulationFinishTime = new DateTime(1970, 1, 1, 0, 0, 0, 0);
			simulationStartTime = simulationStartTime.AddSeconds(billingData.startTime);
			simulationFinishTime = simulationFinishTime.AddSeconds(billingData.simulationWorkerEndTime);
			var actualFinishTime = new DateTime(Math.Min(simulationFinishTime.Ticks, endDate.Ticks));
			var actualStartTime = new DateTime(Math.Max(simulationStartTime.Ticks, startDate.Ticks));
			simulationDuration = (actualFinishTime - actualStartTime).TotalHours;

			windowsInstanceType = billingData.windowsEC2InstanceType[0];
			vCPUsWindows = billingData.windowsEC2InstanceQuantity;

			object currentInstanceRate;
			currentInstanceRate = ((Dictionary<string, object>) rates["Simulation"]).TryGetValue(windowsInstanceType.Substring(0, 2), out currentInstanceRate)
				? currentInstanceRate
				: 0.0;
			simulationCharge = Math.Ceiling(simulationDuration) * vCPUsWindows * (double) currentInstanceRate;

			dataElements = billingData.elements / Math.Pow(10, 9);
			dataServingChargePerHour = dataElements * (double) rates["Data Serving"];
			dataServingChargeSimulation = dataServingChargePerHour * Math.Ceiling(simulationDuration);

			var actualFinishTimeDataStorage = new DateTime(Math.Min(deletedTime.Ticks, endDate.Ticks));
			dataStorageDuration = (actualFinishTimeDataStorage - actualStartTime).TotalDays;
			dataStorageChargePerDay = dataElements * (double) rates["Data Storage"];
			ongoingDataStorageChargePerDay = DateTime.Compare(endDate, deletedTime) > 0 ? 0.0 : dataStorageChargePerDay;

			dataStorageCharge = Math.Ceiling(dataStorageDuration) * dataStorageChargePerDay;
		}
	}

	public abstract class BillingBaseRow
	{
		public string chargeType { get; set; }
		public ConningUser user { get; set; }
		public DateTime startDateTime { get; set; }
		public DateTime? finishDateTime { get; set; }
		public double? duration { get; set; }
		public double? totalCharge { get; set; }
		public double? computationCharge { get; set; }
		public double? dataServingCharge { get; set; }
		public double? dataStorageCharge { get; set; }
		public int? maximumVCPUs { get; set; }
		public double? totalCPUTime { get; set; }
		public string instanceType { get; set; }
		public double? dataElements { get; set; }
		public double? dataServingChargePerHour { get; set; }
		public double? dataStorageChargePerDay { get; set; }
		public double? ongoingDataStorageChargePerDay { get; set; }
		public string simulationName { get; set; }
		public string gridName { get; set; }
		// public string rowType { get; set; }
		public bool hasDataServingCharge { get; set; }
		public bool hasDataStorageCharge { get; set; }
		public List<string> flags { get; set; }
		public BillingBaseRow(string rowType, ConningUser user, DateTime reportStartDateTime, DateTime? reportFinishDateTime, string simulationName, string gridName)
		{
			// Fields initialized here are required for all types of row
			chargeType = rowType;
			this.user = user;
			startDateTime = reportStartDateTime;
			finishDateTime = reportFinishDateTime;
			duration = reportFinishDateTime != null
				? (reportFinishDateTime.Value - reportStartDateTime).TotalHours
				: (DateTime.UtcNow - reportStartDateTime).TotalHours;
			this.simulationName = simulationName;
			this.gridName = gridName;
			flags = new List<string>();
		}
	}

	public class BillingBaseRowGraph : ObjectGraphType<BillingBaseRow>
	{
		public BillingBaseRowGraph()
		{
			Field(_ => _.chargeType);
			Field<ConningUserGraph>()
				.Name("user")
				.Resolve(ctx => ctx.Source.user);
			Field(_ => _.startDateTime);
			Field(_ => _.finishDateTime, nullable: true);
			Field(_ => _.duration, nullable: true);
			Field(_ => _.totalCharge, nullable: true);
			Field(_ => _.computationCharge, nullable: true);
			Field(_ => _.dataServingCharge, nullable: true);
			Field(_ => _.dataStorageCharge, nullable: true);
			Field(_ => _.maximumVCPUs, nullable: true);
			Field(_ => _.totalCPUTime, nullable: true);
			Field(_ => _.instanceType, nullable: true);
			Field(_ => _.dataElements, nullable: true);
			Field(_ => _.dataServingChargePerHour, nullable: true);
			Field(_ => _.dataStorageChargePerDay, nullable: true);
			Field(_ => _.ongoingDataStorageChargePerDay, nullable: true);
			Field(_ => _.hasDataServingCharge);
			Field(_ => _.hasDataStorageCharge);
			Field(_ => _.flags);
			//Field(_ => _.rowType);
		}
	}

	public class BillingComputationRow : BillingBaseRow
	{
		public BillingComputationRow(string rowType, ConningUser currentUser, DateTime reportStartDateTime,
			DateTime? reportFinishDateTime, double computationCharge, int maximumVCPUs, double totalCPUTime, string instanceType, string simulationName, string gridName, List<string> flags) :
			base(rowType, currentUser, DateTime.SpecifyKind(reportStartDateTime, DateTimeKind.Unspecified), reportFinishDateTime != null ? DateTime.SpecifyKind(reportFinishDateTime.Value, DateTimeKind.Unspecified) : (DateTime?) null, simulationName, gridName)
		{   // set reportStartDateTime and reportFinishDateTime to DateTimeKind.Unspecified, otherwise there will be a 'Z' when displayed in billing report page
			this.computationCharge = computationCharge;
			this.maximumVCPUs = maximumVCPUs;
			this.totalCPUTime = totalCPUTime;
			this.instanceType = instanceType;
			this.flags = flags;
			//this.rowType = "Compute";
		}
	}

	public class BillingDataServingRow : BillingBaseRow
	{
		public BillingDataServingRow(string rowType, ConningUser currentUser, DateTime reportStartDateTime,
			DateTime? reportFinishDateTime, double dataElements,double dataServingChargePerHour, double dataServingCharge, string simulationName, string gridName, List<string>  flags) :
			base(rowType, currentUser, DateTime.SpecifyKind(reportStartDateTime, DateTimeKind.Unspecified), reportFinishDateTime != null ? DateTime.SpecifyKind(reportFinishDateTime.Value, DateTimeKind.Unspecified) : (DateTime?) null, simulationName, gridName)
		{
			this.dataServingChargePerHour = dataServingChargePerHour;
			this.dataElements = dataElements;
			this.dataServingCharge = dataServingCharge;
			this.flags = flags;
			//this.rowType = "Serve";
			hasDataServingCharge = true;
		}
	}

	public class BillingDataStorageRow : BillingBaseRow
	{
		public BillingDataStorageRow(string rowType, ConningUser currentUser, DateTime reportStartDateTime,
			DateTime? reportFinishDateTime, double dataElements, double dataStorageChargePerDay, double ongoingDataStorageChargePerDay, double dataStorageCharge, string simulationName, string gridName, List<string>  flags) :
			base(rowType, currentUser, DateTime.SpecifyKind(reportStartDateTime, DateTimeKind.Unspecified), reportFinishDateTime != null ? DateTime.SpecifyKind(reportFinishDateTime.Value, DateTimeKind.Unspecified) : (DateTime?) null, simulationName, gridName)
		{
			this.dataElements = dataElements;
			this.dataStorageChargePerDay = dataStorageChargePerDay;
			this.ongoingDataStorageChargePerDay = ongoingDataStorageChargePerDay;
			this.dataStorageCharge = dataStorageCharge;
			this.flags = flags;
			//this.rowType = "Storage";
			hasDataStorageCharge = true;
		}
	}

	public class BillingItemTotalRow : BillingBaseRow
	{
		public BillingItemTotalRow(ConningUser currentUser, DateTime reportStartDateTime,
			DateTime reportFinishDateTime, List<BillingBaseRow> details, string simulationName, string gridName, string chargeType) : base(chargeType, currentUser, reportStartDateTime, reportFinishDateTime, simulationName, gridName)
		{
			var computationRow = details.SingleOrDefault(s => s.GetType() == typeof(BillingComputationRow));
			var dataServingRows = details.Where(s => s.GetType() == typeof(BillingDataServingRow));
			var dataStorageRow = details.SingleOrDefault(s => s.GetType() == typeof(BillingDataStorageRow));
			computationCharge = computationRow?.computationCharge;
			dataServingCharge = dataServingRows.Any() ? dataServingRows.Select(s => s.dataServingCharge).Sum() : null;
			dataStorageCharge = dataStorageRow?.dataStorageCharge;
			totalCharge = computationCharge.GetValueOrDefault(0.0) + dataServingCharge.GetValueOrDefault(0.0) + dataStorageCharge.GetValueOrDefault(0.0);
			var finishDateTimeTicks = details.Any()
				? details.Select(s => s.finishDateTime?.Ticks ?? DateTime.MaxValue.Ticks).Max()
				: DateTime.MaxValue.Ticks;
			finishDateTime = finishDateTimeTicks == DateTime.MaxValue.Ticks
				? (DateTime?) null
				: new DateTime(Math.Min(finishDateTimeTicks, reportFinishDateTime.Ticks));
			var startDateTimeTicks = details.Any()
			  ? details.Select(s => s.startDateTime.Ticks).Min()
				: DateTime.MinValue.Ticks;
			startDateTime = new DateTime(Math.Max(startDateTimeTicks, reportStartDateTime.Ticks));
			duration = finishDateTime != null ? (finishDateTime.Value - startDateTime).TotalHours : (DateTime.UtcNow - startDateTime).TotalHours;

			maximumVCPUs = computationRow?.maximumVCPUs;
			totalCPUTime = computationRow?.totalCPUTime;
			instanceType = computationRow?.instanceType;

			hasDataStorageCharge = dataStorageRow != null;
			hasDataServingCharge = dataServingRows.Any();
			dataElements = hasDataStorageCharge ? dataStorageRow.dataElements :             // use dataStorageRow for dataElements if available
			               hasDataServingCharge ? dataServingRows.Last().dataElements : 0;  // otherwise last serving row, which will be a query if possible, a simulation serving row if not

			dataStorageChargePerDay = dataStorageRow?.dataStorageChargePerDay;
			ongoingDataStorageChargePerDay = dataStorageRow?.ongoingDataStorageChargePerDay;
			dataServingChargePerHour = null; // this changes based on provisioned v actual elements used for different row types... don't roll up.

			var computationFlags = computationRow?.flags ?? new List<string>();
			var dataServingFlags = hasDataServingCharge ? dataServingRows.SelectMany(s => s.flags) : new List<string>();
			var dataStorageFlags = dataStorageRow?.flags ?? new List<string>();
			flags = computationFlags.Union(dataServingFlags).Union(dataStorageFlags).ToList();
			/*foreach (var flag in new[]{"*","†"})
			{
				if ((computationRow?.chargeType.Contains(flag) ?? false)
				    || (dataServingRows.Any() ? dataServingRows.Any(s => s.chargeType.Contains(flag)) : false)
				    || (dataStorageRow?.chargeType.Contains(flag) ?? false))
				{
					chargeType += flag;
				}*/
			//rowType = "SimTotal";
		}
	}

	public class BillingTotalRow : BillingBaseRow
	{
		public BillingTotalRow(ConningUser currentUser, DateTime reportStartDateTime,
			DateTime reportFinishDateTime, List<BillingBaseRow> totalRows) : base("Total", null, reportStartDateTime, reportFinishDateTime, "Total (in period)", "")
		{
			var startTime = totalRows.Any() ? new DateTime(totalRows.Select(s => s.startDateTime.Ticks).Min()) :
				reportStartDateTime;
			var finishTime = totalRows.Any() ? new DateTime(totalRows.Select(s => s.finishDateTime?.Ticks ?? DateTime.MaxValue.Ticks).Min()) :
				reportFinishDateTime;

			startDateTime = startTime;
			finishDateTime = finishTime;
			duration = finishDateTime != null ? (finishDateTime.Value - startDateTime).TotalHours : (double?) null;
			totalCharge = totalRows.Select(s => s.totalCharge).Sum();
			computationCharge = totalRows.Select(s => s.computationCharge).Sum();
			dataServingCharge = totalRows.Select(s => s.dataServingCharge).Sum();
			dataStorageCharge = totalRows.Select(s => s.dataStorageCharge).Sum();
			dataElements = totalRows.Select(s => s.dataElements).Sum();
			ongoingDataStorageChargePerDay = totalRows.Select(s => s.ongoingDataStorageChargePerDay).Sum();
			hasDataServingCharge = totalRows.Any(s => s.hasDataServingCharge);
			hasDataStorageCharge = totalRows.Any(s => s.hasDataStorageCharge);
			//rowType = "Total";
		}
	}

}

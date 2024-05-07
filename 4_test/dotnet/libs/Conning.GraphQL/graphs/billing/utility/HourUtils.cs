using System;

namespace Conning.GraphQL.utility
{
	public class HourUtils
	{
		public static DateTime RoundUpToNextHour(DateTime startTime, DateTime endTime)
		{
			var totalHours = (endTime - startTime).TotalHours;
			return startTime.AddHours(Math.Ceiling((double) totalHours));
		}

		public static Tuple<DateTime, DateTime> BillableWithinPeriod(DateTime startTime, DateTime endTime,
			DateTime reportStartTime, DateTime reportEndTime)
		{
			var retStartTime = startTime;
			while(DateTime.Compare(retStartTime, reportStartTime) < 0) //Add hours while start time not within period
			{
				retStartTime = retStartTime.AddHours(1);
			}

			var retEndTime = retStartTime;
			while (DateTime.Compare(retEndTime, endTime) < 0 && DateTime.Compare(retEndTime, reportEndTime) < 0)
			{
				retEndTime = retEndTime.AddHours(1);
			}
			return Tuple.Create(retStartTime, retEndTime);
		}

		// Useful for footnote inclusion, was the charge in one report period, or more?
		public static bool RangeIsFullSubsetOfRange(DateTime r1, DateTime r2, DateTime x1, DateTime x2)
		{
			// TODO: check for bad data? like if r2 is less than r1 or x2 is less than x1?
			return (DateTime.Compare(r1, x1) < 0 && DateTime.Compare(r2, x2) > 0);
		}
		
		// Useful for checking if we need to include a row or not
		public static bool RangeIntersectsRange(DateTime r1, DateTime r2, DateTime x1, DateTime x2)
		{
			// TODO: check for bad data? like if r2 is less than r1 or x2 is less than x1?
			return (DateTime.Compare(x1, r2) < 0 && DateTime.Compare(x2, r1) > 0);
		}
	}
}

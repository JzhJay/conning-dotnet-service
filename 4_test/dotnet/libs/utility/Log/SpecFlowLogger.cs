using System.Linq;
using TechTalk.SpecFlow.Tracing;

namespace Conning.Library.Utility.Log
{
	/// <summary>
	/// 	A class to capture SpecFlow console logging so that we can custom format it.
	/// </summary>
	public class SpecFlowLogger : ITraceListener
	{
		public const string Name = "SpecFlow";

		#region ITraceListener Members

		/// <summary>
		/// 	This is called to announce each step.
		/// </summary>
		public void WriteTestOutput(string message)
		{
			Logging.LoggerFor(Name).Info(message);
		}

		/// <summary>
		/// 	This is for SpecFlow tool output, like saying when a step is done or reporting timeout errors.
		/// </summary>
		public void WriteToolOutput(string message)
		{
			if (message.IndexOf("error:") == 0) Logging.LoggerFor(Name).Error(message);
			else Logging.LoggerFor(Name).Debug(message);
		}

		#endregion
	}
}
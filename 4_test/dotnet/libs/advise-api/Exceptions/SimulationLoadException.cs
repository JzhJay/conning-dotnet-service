using System;
using System.Linq;

namespace Conning.Library.AdviseApi.Exceptions
{
	/// <summary>
	/// 	Thrown when an exception is found loading a simulation.
	/// </summary>
	public class SimulationLoadException : Exception
	{
		/// <summary>
		/// 	Constructor.
		/// </summary>
		public SimulationLoadException(string msg)
			: base(msg)
		{
		}
	}
}
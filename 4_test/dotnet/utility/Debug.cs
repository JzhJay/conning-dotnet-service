using System.Diagnostics;
using System.Linq;

namespace Conning.Library.Utility
{
	public static class SmartDebug
	{
		/// <summary>
		/// 	Breaks in the debugger when an assert fails.
		/// </summary>
		/// <param name="statement"> </param>
		public static void Assert(bool statement)
		{
#if DEBUG
            if (!statement)
            {
                Debugger.Break();
            }
#else
			Debug.Assert(statement);
#endif
		}
	}
}
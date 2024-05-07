using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using Conning.Library.Utility;
using Microsoft.Win32;

namespace Conning.Library.AdviseApi
{
	/// <summary>
	/// A class for communicating with advise.exe
	/// </summary>
	public static class AdviseApplication
	{
		/// <summary>
		/// 	Path containing the K application (advise.exe).
		/// </summary>
		public static string KPath
		{
			get;
			private set;
		}

		/// <summary>
		/// 	Root path of ADVISE/GEMS application.
		/// </summary>
		public static string AppRoot
		{
			get; set;
		}

		
		/// <summary>
		/// 	Name of application, e.g., ADVISE or GEMS.
		/// </summary>
		public static string AppName
		{
			get; set;
		}

		/// <summary>
		/// Loads registry settings
		/// </summary>
		public static void LoadConfigurableSettings()
		{
			// Load configurable settings
			LoadRegistrySettings();
			FindApplicationExe();
		}

		/// <summary>
		/// Starts ADVISE
		/// </summary>
		public static void StartAdviseApplication()
		{
			var startInfo = new ProcessStartInfo();
			startInfo.FileName = Path.Combine(KPath, AppName + ".exe");
			startInfo.Arguments = AppArgs;
			startInfo.WorkingDirectory = AppRoot;
			startInfo.WindowStyle = ProcessWindowStyle.Hidden;
			Process.Start(startInfo);
		}


		/// <summary>
		///		Arguments to be passed onto K interpreter.
		/// </summary>
		public static string AppArgs
		{
			get; set;
		}

		

		private static void FindApplicationExe()
		{
			var arch = "32";
			if (Environment.GetEnvironmentVariable("PROCESSOR_ARCHITECTURE") == "AMD64" ||
			    Environment.GetEnvironmentVariable("PROCESSOR_ARCHITEW6432") == "AMD64")
			{
				arch = "x64";
			}
			KPath = Path.Combine(AppRoot, "arch", "win" + arch, AppName.ToLower());
		}

		private static void LoadRegistrySettings()
		{
			if (!IsRunningInProductionMode)
			{
				object appRoot = Registry.GetValue(@"HKEY_CURRENT_USER\Software\ADVISE\Conning.Web", "InstallPath", null);
				if (appRoot == null)
				{
					throw new Exception(AppName + " Path not found, run Conning.Web.Setup.cmd in the " + AppName + " working copy.");
				}
				AppRoot = appRoot + "";
			}
		}


		/// <summary>
		///		True when the name of the executable is not kui.exe or kui.vshost.exe; this means the user is running as ADVISE.exe or GEMS.exe (or some other production name), is under the arch\win\kui folder, and that any and all development stuff should be hidden.
		///		If possible, this flag should be merged with IsRunningInDevelopmentMode and/or IsRunningAsApplication.
		/// </summary>
		public static bool IsRunningInProductionMode
		{
			get;
			set;
		}
	}
}

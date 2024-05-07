using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Conning.Library.Utility
{
	public static class StringEscaper
	{
		static readonly IDictionary<string, string> m_replaceDict
			= new Dictionary<string, string>();

		const string ms_regexEscapes = @"[\a\b\f\n\r\t\v\\""]";

		/// <summary>
		/// Convert various things like newlines, return characters, etc into their literal representation suitable for debugging
		/// </summary>
		/// <param name="s"></param>
		/// <returns></returns>
		public static string Escape(this string s)
		{
			if (String.IsNullOrEmpty(s))
				return string.Empty;

			return Regex.Replace(s, ms_regexEscapes, match);
		}

		public static string CharLiteral(char c)
		{
			return c == '\'' ? @"'\''" : string.Format("'{0}'", c);
		}

		private static string match(Match m)
		{
			string match = m.ToString();
			if (m_replaceDict.ContainsKey(match))
			{
				return m_replaceDict[match];
			}

			throw new NotSupportedException();
		}

		static StringEscaper()
		{
			m_replaceDict.Add("\a", @"\a");
			m_replaceDict.Add("\b", @"\b");
			m_replaceDict.Add("\f", @"\f");
			m_replaceDict.Add("\n", @"\n");
			m_replaceDict.Add("\r", @"\r");
			m_replaceDict.Add("\t", @"\t");
			m_replaceDict.Add("\v", @"\v");

			m_replaceDict.Add("\\", @"\\");
			m_replaceDict.Add("\0", @"\0");

			//The SO parser gets fooled by the verbatim version 
			//of the string to replace - @"\"""
			//so use the 'regular' version
			m_replaceDict.Add("\"", "\\\"");
		}
	}
}

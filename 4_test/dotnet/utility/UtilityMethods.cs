using System;
using System.CodeDom;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net.NetworkInformation;
using System.Reflection;
using System.Text;
using System.Threading;

namespace Conning.Library.Utility {
    /// <summary>
    /// 	Useful static methods
    /// </summary>
    public static class UtilityMethods {
        #region INotifyPropertyChanged

        /// <summary>
        /// 	Raise a PropertyChangedEventHandler but only when it's non-null
        /// </summary>
        public static void Raise(this PropertyChangedEventHandler handler
                                 , object sender, string propertyName) {
            if (handler != null) {
                handler(sender, new PropertyChangedEventArgs(propertyName));
            }
        }

        /// <summary>
        /// 	Raise a PropertyChangedEventHandler for each property specified, but only when the handler is non-null
        /// </summary>
        public static void Raise(this PropertyChangedEventHandler handler
                                 , object sender, params string[] propertyNames) {
            if (handler != null) {
                if (sender is Expression<Func<object>>[]) {
                    foreach (Expression<Func<object>> e in sender as Expression<Func<object>>[]) {
                        if (e.Body is UnaryExpression) {
                            var memberExpression = (e.Body as UnaryExpression).Operand as MemberExpression;
                            var expression = memberExpression.Expression as ConstantExpression;
                            handler(expression.Value, new PropertyChangedEventArgs(memberExpression.Member.Name));
                        }
                        else if (e.Body is MemberExpression) {
                            var memberExpression = e.Body as MemberExpression;
                            var expression = memberExpression.Expression as ConstantExpression;
                            handler(expression.Value, new PropertyChangedEventArgs(memberExpression.Member.Name));
                        }
                        else {
                            throw new NotImplementedException("Raise() does not implement a way to handle lambda expressions of type " + e.Body.GetType().Name);
                        }
                    }
                }
                else if (!(sender is INotifyPropertyChanged)) {
                    throw new ArgumentException(sender + " must be of type INotifyPropertyChanged");
                }
                else {
                    foreach (string propertyName in propertyNames) {
                        handler(sender, new PropertyChangedEventArgs(propertyName));
                    }
                }
            }
        }

        #endregion INotifyPropertyChanged

        private static int Timeout {
            get {
                return 15000;
            }
        }

        private static int PollRate {
            get {
                return 100;
            }
        }

        /// <summary>
        /// 	Centers a string (measured as # of characters, NOT using a fixed width font) by padding the sides uniformly
        /// </summary>
        /// <param name="o"> </param>
        /// <param name="width"> </param>
        /// <param name="c"> </param>
        /// <returns> </returns>
        public static string PadCenter(this object o, int width, char c = ' ') {
            string s = (o == null) ? String.Empty : o.ToString();

            if (width <= s.Length) {
                return s;
            }

            int padding = width - s.Length;
            return s.PadLeft(s.Length + padding / 2, c).PadRight(width, c);
        }

        public static void Swap(ref int x, ref int y) {
            int temp = x;
            x = y;
            y = temp;
        }

        public static bool IsWithinRange(this int v, int bound1, int bound2) {
            if (bound1 < bound2) {
                return bound1 <= v && v <= bound2;
            }
            else {
                return bound1 >= v && v >= bound2;
            }
        }

        /// <summary>
        /// 	Foreach implementation for IEnumerable
        /// </summary>
        public static void ForEach<T>(this IEnumerable<T> enumeration, Action<T> action) {
            foreach (T item in enumeration) {
                action(item);
            }
        }

        /// <summary>
        /// 	Waits for the specified lambda to return true using a timeout and poll rate
        /// </summary>
        /// <param name="lambda"> </param>
        /// <param name="failureMessage"> The message to be returned in the event of a timemout exception</param>
        /// <param name="timeout"> Timeout.Infinite or -1 to block the caller until the lambda comes back true. In milliseconds </param>
        /// <param name="pollRate"> In milliseconds </param>
        /// <param name="throwException"> If true, an exception will be thrown on timeout event, else just return </param>
        public static void WaitFor(Func<bool> lambda, Func<string> failureMessage = null, int timeout = -2, int pollRate = -2, bool throwException = true) {
            Exception internalException = null;

            if (timeout == -2) {
                timeout = Timeout; //get the default value
            }
            if (pollRate == -2) {
                pollRate = PollRate; //get the default value
            }

            ManualResetEvent resetEvent = new ManualResetEvent(false);

            Thread thread = new Thread(() => {
                try {
                    for (int i = 0; (timeout == -1) || (i < timeout / pollRate); i++) {
                        if (lambda()) {
                            resetEvent.Set();
                            break;
                        }
                        else {
                            Thread.Sleep(pollRate);
                        }
                    }
                } catch (Exception e) {
                    if (e is ThreadAbortException) {
                        //Caused by the thread.abort below.  Clean up and continue WaitFor execution
                        Thread.ResetAbort();
                    }
                    else {
                        Console.WriteLine(e.ToString() + ". lambda target: " + lambda.Target, e.InnerException);
                        internalException = e;
                        resetEvent.Set();
                    }
                }
            });
            thread.Name = "UtilityMethods - object.WaitFor()";

            thread.Start();

            if (!resetEvent.WaitOne(timeout)) {
                if (thread.IsAlive) {
                    thread.Abort();
                    //Wait for aborted thread to end before continuing
                    thread.Join();
                }

                if (throwException) {
                    string errorMessage = "Timed-out after " + timeout.ToString("N0") + "ms";
                    if (failureMessage != null) {
                        errorMessage += "\n" + failureMessage();
                    }

                    throw new TimeoutException(errorMessage);
                }
            }

            if (throwException && internalException != null) {
                throw internalException;
            }
        }

        /// <summary>
        /// 	An extension method that adds easy to access friendly names for enums.
        /// </summary>
        /// <param name="value"> The enum value to retrieve the description of. </param>
        /// <returns> The contents of the enum value's Description attribute, or null if not found. </returns>
        /// <remarks>
        /// 	http://stackoverflow.com/questions/1415140/c-enums-can-my-enums-have-friendly-names/1415187#1415187
        /// </remarks>
        public static string GetDescription(this Enum value) {
            Type type = value.GetType();
            string name = Enum.GetName(type, value);
            if (name != null) {
                FieldInfo field = type.GetField(name);
                if (field != null) {
                    DescriptionAttribute attr =
                        Attribute.GetCustomAttribute(field,
                                                     typeof(DescriptionAttribute)) as DescriptionAttribute;
                    if (attr != null) {
                        return attr.Description;
                    }
                }
            }
            return null;
        }

        /// <summary>
        /// 	Converts a list of objects to a formatted string item1, item2, item3, etc
        /// </summary>
        public static string ToFormattedString(this IEnumerable<object> list, string join = ", ", bool addQuotesIfString = true) {
            var result = new StringBuilder();

            bool first = true;
            foreach (object item in list) {
                if (first) {
                    first = false;
                }
                else {
                    result.Append(join);
                }

                if ((item is String || item == null) && addQuotesIfString) {
                    result.Append("\"" + item + "\"");
                }
                else {
                    result.Append(item);
                }
            }
            return result.ToString();
        }

        /// <summary>
        /// 	Converts a list of objects to a formatted string item1, item2, item3, etc
        /// </summary>
        public static string ToFormattedString(this double[] list, bool addQuotesIfString = true) {
            var result = new StringBuilder();

            bool first = true;
            foreach (object item in list) {
                if (first) {
                    first = false;
                }
                else {
                    result.Append(", ");
                }

                if ((item is String) && addQuotesIfString) {
                    result.Append("\"" + item + "\"");
                }
                else {
                    result.Append(item);
                }
            }
            return result.ToString();
        }

        /// <summary>
        /// 	Converts a list of objects to a formatted string item1, item2, item3, etc
        /// </summary>
        public static string ToFormattedString(this int[] list, bool addQuotesIfString = true) {
            var result = new StringBuilder();

            bool first = true;
            foreach (object item in list) {
                if (first) {
                    first = false;
                }
                else {
                    result.Append(", ");
                }

                if ((item is String) && addQuotesIfString) {
                    result.Append("\"" + item + "\"");
                }
                else {
                    result.Append(item);
                }
            }
            return result.ToString();
        }

        public static string ToExplodedString(this string[] strArray) {
            var result = new StringBuilder();

            bool first = true;
            foreach (string str in strArray) {
                if (first) {
                    first = false;
                }
                else {
                    result.Append("|");
                }

                result.Append(str);
            }

            return result.ToString();
        }

        ///<summary>
        ///	Return the number of occurrences of 'ch' in the string.
        ///</summary>
        public static int Count(this string str, char ch, int start = 0, int length = -1) {
            if (length - start > str.Length)
                length = str.Length - start;

            string s = (length == -1) ? str.Substring(start) : str.Substring(start, length);
            return s.Count(c => c == ch);
        }

        /// <summary>
        /// 	Given the name of a command line flag (a command line argument that is has no corresponding value) return true if flag is present on the command line or false if not
        /// </summary>
        public static bool IsCommandLineFlagSpecified(string flagName) {
            return Environment.GetCommandLineArgs().FirstOrDefault(s => s.ToLower() == flagName.ToLower()) != null;
        }

        /// <summary>
        /// 	Given the name of a command line argument (a command line argument that should have a corresponding value specified as a string following a blank after the argument) return the value of the argument if the argument was specified on the command line and has a value, or null
        /// </summary>
        public static string GetCommandLineArgValue(string argName) {
            argName = argName.ToLower();
            string argValue = null;
            if (IsCommandLineFlagSpecified(argName)) {
                string[] args = Environment.GetCommandLineArgs();
                argName = argName.ToLower();
                for (int i = 0; i < args.Length; i++) {
                    if (args[i].ToLower() == argName) {
                        if ((i + 1) < args.Length) {
                            argValue = args[i + 1];
                        }
                        break;
                    }
                }
            }
            return argValue;
        }

        // write out the string or list of strings in msg as an AutoTest result file of type msgType.  msgType can be "success", "warning", or "error"
        // File will be written out to the path specified by appInstallPath, which should be the root ADVISE installation directory if this needs to work with LabManager
        public static void WriteAutoTestResult(string appInstallPath, object msg, string msgType) {
            try {
                var msgList = new List<string>(5);
                if (msg is string) {
                    msgList.Add((string)msg);
                }
                else {
                    msgList = (List<string>)msg;
                }
                string resultType = "Successes";
                if (msgType.Equals("warning")) {
                    resultType = "Warnings";
                }
                else if (msgType.Equals("error")) {
                    resultType = "Errors";
                }

                using (FileStream fileStream = new FileStream(
                    appInstallPath + @"\AutoTest" + resultType + ".txt",
                    FileMode.Append,
                    FileAccess.Write,
                    FileShare.ReadWrite)) {
                    using (StreamWriter writer = new StreamWriter(fileStream)) {
                        foreach (string line in msgList) {
                            writer.WriteLine(line);
                        }
                        writer.Flush();
                    }
                }
            } catch (Exception ex) {
                Debug.WriteLine("Error writing AutoTest result file: " + ex.Message);
            }
        }

        public static void Truncate(this StringBuilder result, int charactersToTruncate = 1) {
            result.Remove(result.Length - charactersToTruncate, charactersToTruncate);
        }

        public static bool IsLocalPortInUse(int port) {
            return IPGlobalProperties.GetIPGlobalProperties().GetActiveTcpConnections().Any(p => p.LocalEndPoint.Port == port);
        }

        public static bool IsLocalPortListening(int port) {
            return IPGlobalProperties.GetIPGlobalProperties().GetActiveTcpListeners().Any(p => p.Port == port);
        }


        /// <summary>
        /// An extension method for making a new array from an old one of different size, copying the elements that exist
        /// in the old, and initializing all the ones that don't to the same value.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="oldT"></param>
        /// <param name="count"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static T[] ResizeArray<T>(this T[] oldT, int count, T value = default(T)) {
            if (oldT == null) {
                oldT = new T[0];
            }

            if (oldT.Length == count) {
                return oldT;
            }

            var newT = new T[count];
            for (var i = 0; i < count; i++) {
                newT[i] = i < oldT.Length ? oldT[i] : value;
            }

            return newT;
        }


        /// <summary>
        /// An extension method for making a new array from an old one of different size, copying the elements that exist
        /// in the old, and initializing all the ones that don't to the same value.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="oldT"></param>
        /// <param name="count"></param>		
        /// <returns></returns>
        public static T[] ResizeArrayC<T>(this T[] oldT, int count) where T : class, new() {
            if (oldT == null) {
                oldT = new T[0];
            }

            if (oldT.Length == count) {
                return oldT;
            }

            var newT = new T[count];
            for (var i = 0; i < count; i++) {
                newT[i] = i < oldT.Length ? oldT[i] : new T();
            }

            return newT;
        }

        /// <summary>
        /// For example could round 177 -> 200 given 177,StepUpToNearest(25);
        /// </summary>
        /// <param name="n"></param>
        /// <param name="nearest"></param>
        /// <returns></returns>
        public static int StepUpToNearest(this int n, int nearest) {
            var mod = n % nearest;
            if (mod == 0)
                return n;
            else
                return n - mod + nearest;
        }

        //public struct ReplaceItem
        //{
        //    public string From;
        //    public string To;
        //}


        //public static string MultiReplace(this string input, bool caseInsensitive, params ReplaceItem[] items)
        //{
        //    var result = input;
        //    var search = caseInsensitive ? input.ToLower() : input;

        //    foreach (var item in items)
        //    {
        //        var searchTerm = caseInsensitive ? item.From.ToLower() : item.From;

        //        int index = search.IndexOf(searchTerm);
        //        while (index != -1)
        //        {
        //            input.
        //        }
        //    }
        //}

        static public string Replace(this string original, string pattern, string replacement, StringComparison comparisonType) {
            return Replace(original, pattern, replacement, comparisonType, -1);
        }

        static string Replace(string original, string pattern, string replacement, StringComparison comparisonType, int stringBuilderInitialSize) {
            if (original == null) {
                return null;
            }

            if (String.IsNullOrEmpty(pattern)) {
                return original;
            }


            int posCurrent = 0;
            int lenPattern = pattern.Length;
            int idxNext = original.IndexOf(pattern, comparisonType);
            StringBuilder result = new StringBuilder(stringBuilderInitialSize < 0 ? Math.Min(4096, original.Length) : stringBuilderInitialSize);

            while (idxNext >= 0) {
                result.Append(original, posCurrent, idxNext - posCurrent);
                result.Append(replacement);

                posCurrent = idxNext + lenPattern;

                idxNext = original.IndexOf(pattern, posCurrent, comparisonType);
            }

            result.Append(original, posCurrent, original.Length - posCurrent);

            return result.ToString();
        }


        /// <summary>
        /// Cap the minimum size of a control (height or width) but bump it up to its preferred size if it's near the maximum minimum value
        /// </summary>
        /// <param name="preferredSize"> </param>
        /// <param name="minimumSize"> </param>
        /// <param name="maxMinimumSize"></param>
        /// <param name="maxDelta"></param>
        /// <returns></returns>
        public static int CalculateMinimumSizeToUseAndCap(int preferredSize, int minimumSize, int maxMinimumSize, int maxDelta = 50) {
            int minSize = minimumSize;

            if (preferredSize > maxMinimumSize && Math.Abs(preferredSize - maxMinimumSize) <= maxDelta)
                minSize = preferredSize;

            if (minSize > maxMinimumSize + maxDelta)
                minSize = maxMinimumSize;

            return minSize;
        }
        
        public static bool HasProperty(dynamic d, string name)
        {
            return ((IDictionary<string, object>)d).ContainsKey(name);
        }
    }
}
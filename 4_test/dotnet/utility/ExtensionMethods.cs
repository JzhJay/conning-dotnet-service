using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Dynamic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace Conning.Library.Utility
{
    public static class ExtensionMethods
    {
        public static dynamic ToDynamic(this Dictionary<string, object> dict)
        {
            var result = new ExpandoObject();
            var eoColl = (ICollection<KeyValuePair<string, object>>) result;

            foreach (var kvp in dict)
            {
                eoColl.Add(kvp);
            }

            return result;
        }
       
        public static string ToPrettyString<TKey, TValue>(this Dictionary<TKey, TValue> d, string prepend = "")
        {
            return "{" + string.Join(",", d.Select(kv => kv.Key + "=" + kv.Value.ToPrettyString()).ToArray()) + "}";
        }

        public static string ToPrettyString(this object o, string prepend = "")
        {
            if (o is Dictionary<string, object>)
            {
                return (o as Dictionary<string, object>).ToPrettyString();
            }

            var result = new StringBuilder();

            if (o is Array)
            {
                var a = o as Array;

                result.AppendLine(prepend + String.Format("       {0}", String.Join(",", a)));
            }
            else
            {
                foreach (PropertyDescriptor descriptor in TypeDescriptor.GetProperties(o))
                {
                    string name = descriptor.Name;
                    object value = descriptor.GetValue(o);
                    if (value == null)
                    {
                        result.AppendLine(prepend + String.Format("       {0}:  {1}", name, "null"));
                    }
                    else if (value is String || value is Int32 || value is Double || value is Boolean)
                    {
                        result.AppendLine(prepend + String.Format("       {0}:  {1}", name, value));
                    }
                    else if (value is Array)
                    {
                        var a = value as Array;

                        result.AppendLine(prepend + String.Format("       {0}:  {1}", name, String.Join(",", a)));
                    }
                    else
                    {
                        result.AppendLine(prepend + String.Format("       {0}:", name));
                        result.AppendLine(prepend + value.ToPrettyString(prepend + "\t"));
                    }
                }
            }            

            return result.ToString();
        }
        
        public static dynamic JsonToDynamic(this string v)
        {
            return (dynamic) JsonConvert.DeserializeObject<ExpandoObject>(v);
        }
        
        public static string Truncate(this string str, int length, bool addEllipsis = true)
        {
            if(length < 0)
            {
                throw new ArgumentOutOfRangeException(nameof(length), "Length must be >= 0");
            }

            if (str == null)
            {
                return null;
            }

            int maxLength = Math.Min(str.Length, length);

            var result = str.Substring(0, maxLength);
            if (!addEllipsis || maxLength == str.Length)
            {
                return result;
            }
            else
            {
                return $"{result}...";
            }
        }              
    }
}
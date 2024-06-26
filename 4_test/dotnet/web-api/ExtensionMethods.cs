using System.Dynamic;
using System.Linq;
using System.Security;
using System.Security.Claims;
using GraphQL.Types;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Newtonsoft.Json;

namespace Conning.Kui.Web
{
    public static class ExtensionMethods
    {
        public static dynamic JsonToDynamic(this string v)
        {
            return (dynamic) JsonConvert.DeserializeObject<ExpandoObject>(v);
        }

        public static bool IsDebug(this IHtmlHelper<GlobalSettings> htmlHelper)
        {
#if DEBUG
            return true;
#else
      return false;
#endif
        }
    }
}
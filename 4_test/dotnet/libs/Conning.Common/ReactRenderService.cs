using System.Diagnostics.Tracing;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using GraphQL.Introspection;
using React;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;


namespace Conning.Common
{
    public class ReactRenderService
    {
        private readonly IOptions<AdviseAppSettings> _settings;
        public ReactRenderService(IOptions<AdviseAppSettings> settings)
        {
            _settings = settings;
        }
        
        public async Task<string> renderComponent(string component, dynamic props)
        {
            // React.net has a dependency on HTTPContext and we are unable to perform SSR outside of an HTTP request.
            // To hackaround this we can make a request to ourselves and perform the rendering in that request.
            var handler = new HttpClientHandler();
            HttpClient client = new HttpClient(handler);
            client.DefaultRequestHeaders.Add("x-forwarded-port", "81"); // Only accessible internally
            
            var stringPayload = await Task.Run(() => JsonConvert.SerializeObject(new {component=component, props=props}));
            var httpContent = new StringContent(stringPayload, Encoding.UTF8, "application/json");

            return await (await client.PostAsync($"http://localhost:{_settings.Value.webServerPort}/internal/render", httpContent)).Content.ReadAsStringAsync();
        }

        public static string renderComponentInternal(string component, dynamic props)
        {
            /*
           Initializer.Initialize(registration => registration.AsSingleton());
           var container = React.AssemblyRegistration.Container;
           // Register some components that are normally provided by the integration library
           // (eg. React.AspNet or React.Web.Mvc4)
           container.Register<ICache, NullCache>();
           container.Register<IFileSystem, SimpleFileSystem>();

           ReactSiteConfiguration.Configuration
               .SetReuseJavaScriptEngines(false)
               .AddScript("NotificationEmail.jsx");

           JsEngineSwitcher.Current.DefaultEngineName = ChakraCoreJsEngine.EngineName;
           JsEngineSwitcher.Current.EngineFactories.AddChakraCore();
           */

            //ControllerContext.HttpContext = new DefaultHttpContext();
            //ControllerContext.HttpContext.Request.Headers["device-id"] = "20317";
            
            //HttpContext.Current = CreateHttpContextCurrent();
            
            //var httpContext = new DefaultHttpContext(); // or mock a `HttpContext`
            //httpContext.Request.Headers["token"] = "fake_token"; //Set header
            
            var environment = ReactEnvironment.GetCurrentOrThrow;
            var reactComponent = environment.CreateComponent(component, props);
            // renderServerOnly omits the data-reactid attributes
            var html = reactComponent.RenderHtml(renderServerOnly: true);

            return html;    
        }
       
    }
}

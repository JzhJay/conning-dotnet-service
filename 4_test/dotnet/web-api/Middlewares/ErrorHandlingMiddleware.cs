using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Conning.Kui.Web.Middlewares
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate next;
        private ILogger<ErrorHandlingMiddleware> _log;

        public ErrorHandlingMiddleware(ILogger<ErrorHandlingMiddleware> log, RequestDelegate next)
        {
            _log = log;
            this.next = next;
        }

        public async Task Invoke(HttpContext context /* other scoped dependencies */)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                try
                {
                    await HandleExceptionAsync(context, ex);
                }
                catch (Exception e)
                {
                    _log.LogError(e.ToString());
                }

                _log.LogError(ex.ToString());
                
                await next(context);
            }
        }
    

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var code = HttpStatusCode.InternalServerError; // 500 if unexpected

            var result = JsonConvert.SerializeObject(new
            {
                message = exception.Message,
                stackTrace = exception.StackTrace,
                source = exception.Source
            });
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int) code;
            return context.Response.WriteAsync(result);
        }
    }
}
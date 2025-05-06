using MediatR;

namespace EndearingApp.Web.Middlwares;

public class UnsuccessfulResponseLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<UnsuccessfulResponseLoggingMiddleware> _logger;

    public UnsuccessfulResponseLoggingMiddleware(RequestDelegate next, ILogger<UnsuccessfulResponseLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        context.Request.EnableBuffering();

        using var reqReader = new StreamReader(context.Request.Body);
        var requestBody = await reqReader.ReadToEndAsync();
        context.Request.Body.Seek(0, SeekOrigin.Begin);

        await _next(context);
        
        if (context.Response.StatusCode >= 400)
        {
            string responseBody = string.Empty;
            if (context.Response.Body.CanSeek)
            {
                using var resReader = new StreamReader(context.Response.Body);
                responseBody = await resReader.ReadToEndAsync();
            }

            _logger.Log(
                LogLevel.Error,
                "Request: {RequestMethod} {RequestPath} | Status Code: {StatusCode} | Request Body: {RequestBody} | Response Body: {ResponseBody}",
                context.Request.Method,
                context.Request.Path,
                context.Response.StatusCode,
                requestBody,
                responseBody);
        }
    }
}

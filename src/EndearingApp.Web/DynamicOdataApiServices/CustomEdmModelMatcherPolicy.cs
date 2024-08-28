using Microsoft.AspNetCore.OData.Abstracts;
using Microsoft.AspNetCore.OData.Extensions;
using Microsoft.AspNetCore.OData.Routing.Template;
using Microsoft.AspNetCore.OData.Routing;
using Microsoft.AspNetCore.Routing.Matching;
using Microsoft.OData.Edm;
using Microsoft.OData.UriParser;
using System.Data.Common;
using System.Diagnostics.CodeAnalysis;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using Microsoft.AspNetCore.Http.Extensions;
using EndearingApp.Web.Endpoints.OdataApi;
using MediatR;

namespace EndearingApp.Web.DynamicOdataApiServices;

/// <summary>
/// Defines a policy that applies behaviors to the OData Uri matcher.
/// </summary>
internal class CustomEdmModelMatcherPolicy : MatcherPolicy, IEndpointSelectorPolicy
{
    private readonly IEdmModelManager _modelManager;


    public CustomEdmModelMatcherPolicy(IEdmModelManager modelManager)
    {
        _modelManager = modelManager;
    }

    /// <summary>
    /// Gets a value that determines the order of this policy.
    /// </summary>
    public override int Order => 900 - 1;

    /// <summary>
    /// Returns a value that indicates whether the matcher applies to any endpoint in endpoints.
    /// </summary>
    /// <param name="endpoints">The set of candidate values.</param>
    /// <returns>true if the policy applies to any endpoint in endpoints, otherwise false.</returns>
    public bool AppliesToEndpoints(IReadOnlyList<Endpoint> endpoints)
    {
        return endpoints.Any(e => e.Metadata.OfType<ODataRoutingMetadata>().FirstOrDefault() != null);
    }

    /// <summary>
    /// Applies the policy to the CandidateSet.
    /// </summary>
    /// <param name="httpContext">The context associated with the current request.</param>
    /// <param name="candidates">The CandidateSet.</param>
    /// <returns>The task.</returns>
    [SuppressMessage("Design", "CA1031:Do not catch general exception types", Justification = "<Pending>")]
    public Task ApplyAsync(HttpContext httpContext, CandidateSet candidates)
    {
        if (httpContext == null)
        {
            throw new ArgumentNullException(nameof(httpContext));
        }

        var odataFeature = httpContext.ODataFeature();
        if (odataFeature.Path != null)
        {
            // If we have the OData path setting, it means there's some Policy working.
            // Let's skip this default OData matcher policy.
            return Task.CompletedTask;
        }

        // The goal of this method is to perform the final matching:
        // Map between route values matched by the template and the ones we want to expose to the action for binding.
        // (tweaking the route values is fine here)
        // Invalidating the candidate if the key/function values are not valid/missing.
        // Perform overload resolution for functions by looking at the candidates and their metadata.
        for (var i = 0; i < candidates.Count; i++)
        {
            ref CandidateState candidate = ref candidates[i];
            if (!candidates.IsValidCandidate(i))
            {
                continue;
            }

            var model = _modelManager.GetModel();
            if (model == null)
            {
                continue;
            }

            var translatorContext
                = new ODataTemplateTranslateContext(httpContext, candidate.Endpoint, candidate.Values, model);

            try
            {
                var odataPath = GetPath(httpContext);
                if (odataPath != null)
                {
                    odataFeature.RoutePrefix = OdataConstants.OdataRoute;
                    odataFeature.Model = model;
                    odataFeature.Path = odataPath;
                    
                    MergeRouteValues(translatorContext.UpdatedValues, candidate.Values!);
                }
                else
                {
                    candidates.SetValidity(i, false);
                }
            }
            catch
            {
            }
        }

        return Task.CompletedTask;
    }
    private ODataPath GetPath(HttpContext httpContext)
    {
        var fullUrl = httpContext.Request.GetDisplayUrl();
        var relativeUrlStartIndex =
            fullUrl.IndexOf(OdataConstants.OdataRoute) + OdataConstants.OdataRoute.Length;
        var relativeUri = new Uri(fullUrl.Substring(relativeUrlStartIndex), UriKind.Relative);
        var parser = GetParser(relativeUri);

        var paths = parser.ParsePath();
        return paths;
    }
    private ODataUriParser GetParser(Uri relativeUri)
    {
        var parser = new ODataUriParser(_modelManager.GetModel(), relativeUri);
        parser.Resolver.EnableCaseInsensitive = true;
        parser.Resolver.EnableNoDollarQueryOptions = true;

        return parser;
    }

    private static void MergeRouteValues(RouteValueDictionary updates, RouteValueDictionary source)
    {
        foreach (var data in updates)
        {
            source[data.Key] = data.Value;
        }
    }

}

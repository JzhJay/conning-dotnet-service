using Microsoft.AspNetCore.Authorization;

namespace Conning.Kui.Web.Authorization
{
    public class HasPermissionRequirement : IAuthorizationRequirement
    {
        public string Permission { get; }

        public HasPermissionRequirement(string permission)
        {
            Permission = permission;
        }
    }
}
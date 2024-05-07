﻿using System;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
 using Conning.Db.Services;


 namespace Conning.Kui.Web.Authorization
{
    public class HasPermissionHandler : AuthorizationHandler<HasPermissionRequirement>
    {
        private BaseUserService _userService;
        
        public HasPermissionHandler(BaseUserService userService)
        {
            _userService = userService;
        }
        
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, HasPermissionRequirement requirement)
        {
            var permissions = _userService.GetCurrentUserPermissions();
            if (permissions != null && permissions.Any())
            {
                if (permissions.Any(s => s == requirement.Permission))
                    context.Succeed(requirement);
            }
            
            return Task.CompletedTask;
        }
    }
}
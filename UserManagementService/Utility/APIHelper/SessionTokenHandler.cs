using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.Utility.APIHelper
{
    public class SessionTokenHandler : DelegatingHandler
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SessionTokenHandler(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            string empId = _httpContextAccessor.HttpContext.User.FindFirst("EmpId")?.Value;
         
            string token = _httpContextAccessor.HttpContext.Request.Cookies[$"t_{empId}"];


            if (!string.IsNullOrEmpty(token))
            {
                token = EncDecHelper.Decrypt(token);
                request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            }

            return await base.SendAsync(request, cancellationToken);

            
        }
    }

}

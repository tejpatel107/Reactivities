using System.Security.Claims;
using Application.Interface;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
    public class UserAccessor : IUserAcessor
    {
        private readonly IHttpContextAccessor _hthttpContextAccessor;

        public UserAccessor(IHttpContextAccessor httpContextAccessor)
        {
            _hthttpContextAccessor=httpContextAccessor;
        }
        public string GetUsername()
        {
            return _hthttpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
        }
    }
}
using API.Services;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Persistence;
using System.Text;

namespace API.Extensions {

    public static class IdentityServicesExtensions 
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config) {
            
            services.AddIdentityCore<AppUser>(opt => {
                opt.Password.RequireNonAlphanumeric = false;
            }).AddEntityFrameworkStores<DataContext>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(
                opt=>{
                    opt.TokenValidationParameters = new TokenValidationParameters {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"])),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.FromMinutes(15)
                    };

                    opt.Events = new JwtBearerEvents{
                        OnMessageReceived = context => {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chat")){
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };

                    // opt
                }
            );

            services.AddAuthorization(opt => 
            {
                opt.AddPolicy(
                "IsActivityHost", policy => {policy.AddRequirements(
                    new IsHostRequirement());
                });
            });
            services.AddTransient<IAuthorizationHandler,IsHostRequirementHandler>();
            services.AddScoped<TokenServices>();
            return services;
        }
    }
}
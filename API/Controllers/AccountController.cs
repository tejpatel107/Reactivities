using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenServices _tokenServices;

        public AccountController(UserManager<AppUser> userManager, TokenServices tokenServices)
        {
            _userManager = userManager;
            _tokenServices = tokenServices;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized();

            var results = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (results)
            {
                return GetUserDto(user);
            }

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (_userManager.Users.Any(x => x.UserName == registerDto.UserName))
            {
                ModelState.AddModelError("username","username taken");
                return ValidationProblem();
            }

            if (_userManager.Users.Any(x => x.Email == registerDto.Email))
            {
                ModelState.AddModelError("email","email taken");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.UserName
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                return GetUserDto(user);
            }

            return BadRequest(result.Errors);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrent()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

            return GetUserDto(user);
        }

        private UserDto GetUserDto(AppUser user)
        {
            return new UserDto
            {
                Token = _tokenServices.CreateToken(user),
                DisplayName = user.DisplayName,
                Image = null,
                UserName = user.UserName
            };
        }
    }
}
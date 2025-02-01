using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }

        [HttpPut("{username}")]
        public async Task<IActionResult> UpdateBio([FromBody] Dictionary<string, object> body)
        {
            if (body.TryGetValue("bio", out var bioValue))
            {
                string bio = bioValue?.ToString();
                return HandleResult(await Mediator.Send(new Update.Command { Bio = bio }));
            }
            return (IActionResult)Result<Unit>.Success(Unit.Value);
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetUserActivities(string username, string predicate)
        {
            return HandleResult(await Mediator.Send(new ListAcitvities.Query { Username = username, Predicate = predicate }));
        }
    }
}
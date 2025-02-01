using Application.Interface;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListAcitvities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAcessor _userAcessor;

            public Handler(DataContext context, IMapper mapper, IUserAcessor userAcessor)
            {
                _context = context;
                _mapper = mapper;
                _userAcessor = userAcessor;
            }
            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.ActivityAttendees
                    .Where(u => u.AppUser.UserName == request.Username)
                    .OrderBy(a => a.Activity.Date)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                    .AsQueryable();

                query = request.Predicate switch
                {
                    "past" => query.Where(a => a.Date <= DateTime.Now),
                    "hosting" => query.Where(a => a.HostUsername == request.Username),
                    _ => query.Where(a => a.Date >= DateTime.Now),
                };

                var activities = await query.ToListAsync();

                return Result<List<UserActivityDto>>.Success(activities);
            }
        }

    }
}
using Application.Interface;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profiles.Profile>>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query,Result<List<Profiles.Profile>>>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;
            private readonly IUserAcessor _userAcessor;

            public Handler(DataContext dataContext, IMapper mapper, IUserAcessor userAcessor)
            {
                _dataContext = dataContext;
                _mapper = mapper;
                _userAcessor = userAcessor;
            }

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profiles.Profile>();

                switch (request.Predicate)
                {
                    case "followers":
                        profiles = await _dataContext.UserFollowings.Where(x => x.Target.UserName == request.Username)
                        .Select(x => x.Observer)
                        .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, 
                            new { currentUsername = _userAcessor.GetUsername()})
                        .ToListAsync();
                        break;
                    case "following":
                        profiles = await _dataContext.UserFollowings.Where(x => x.Observer.UserName == request.Username)
                        .Select(x => x.Target)
                        .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, new { currentUsername = _userAcessor.GetUsername()})
                        .ToListAsync();
                        break;
                }

                return Result<List<Profiles.Profile>>.Success(profiles);
            }
        }
    }
}
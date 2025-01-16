using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Application.Interface;
using Application.Core;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<PageList<ActivityDto>>> 
        { 
            public ActivityParams Params {get; set;}
        }

        public class Handler : IRequestHandler<Query, Result<PageList<ActivityDto>>>
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

            public async Task<Result<PageList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities
                    .Where(d => d.Date >= request.Params.StartDate)
                    .OrderBy(d => d.Date)
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new { currentUsername = _userAcessor.GetUsername()})
                    .AsQueryable();

                if (request.Params.isGoing && !request.Params.isHost)
                {
                    query = query.Where(x => x.Attendees.Any(a => a.Username == _userAcessor.GetUsername()));
                }

                if (request.Params.isHost && !request.Params.isGoing)
                {
                    query = query.Where(x => x.HostUsername == _userAcessor.GetUsername());
                }

                return Result<PageList<ActivityDto>>.Success(
                    await PageList<ActivityDto>.CreateAsync(query, 
                        request.Params.PageNumber , request.Params.PageSize)
                );
            }
        }
    }
}

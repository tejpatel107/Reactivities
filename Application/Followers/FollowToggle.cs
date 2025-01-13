using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interface;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAcessor _userAcessor;

            public Handler(DataContext dataContext, IUserAcessor userAcessor)
            {
                _dataContext = dataContext;
                _userAcessor = userAcessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _dataContext.Users.FirstOrDefaultAsync(u => u.UserName == _userAcessor.GetUsername());

                var target = await _dataContext.Users.FirstOrDefaultAsync(u => u.UserName == request.TargetUsername);

                var following = await _dataContext.UserFollowings.FindAsync(observer.Id, target.Id);

                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };

                    await _dataContext.UserFollowings.AddAsync(following);
                }
                else
                {
                    _dataContext.UserFollowings.Remove(following);
                }

                var result = await _dataContext.SaveChangesAsync() > 0;

                if (result) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed to update following.");
            }
        }

    }
}
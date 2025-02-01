using Application.Interface;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Update
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Bio { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAcessor _userAcessor;
            private readonly IMapper _mapper;

            public Handler(DataContext dataContext, IUserAcessor userAcessor, IMapper mapper)
            {
                _dataContext = dataContext;
                _userAcessor = userAcessor;
                _mapper = mapper;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users.FirstOrDefaultAsync(
                    u => u.UserName == _userAcessor.GetUsername());
                
                if (user == null) return Result<Unit>.Failure("Error finding user");

                user.Bio = request.Bio;
                var result = await _dataContext.SaveChangesAsync() > 0;
                
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Error updating bio");
            }
        }
    }
}
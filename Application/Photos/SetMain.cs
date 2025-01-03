using Application.Interface;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
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
                var user = await _dataContext.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.UserName == _userAcessor.GetUsername());

                if (user == null) return null;

                var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

                if (photo == null) return null;

                var currentMainPhoto = user.Photos.FirstOrDefault(p => p.IsMain);

                if (currentMainPhoto != null) currentMainPhoto.IsMain = false;

                photo.IsMain = true;

                var success = await _dataContext.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem setting the photo as main photo.");
            }
        }
    }
}
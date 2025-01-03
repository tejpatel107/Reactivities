using Application.Interface;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly DataContext _dataContext;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAcessor _userAcessor;

            public Handler(DataContext dataContext, IPhotoAccessor photoAccessor, IUserAcessor userAcessor)
            {
                _dataContext = dataContext;
                _photoAccessor = photoAccessor;
                _userAcessor = userAcessor;
            }
            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.UserName == _userAcessor.GetUsername());

                if (user == null) return null;

                var photoUploadResult = await _photoAccessor.AddPhoto(request.File);

                var photo = new Photo{
                    Url = photoUploadResult.Url,
                    Id = photoUploadResult.PublicId
                };

                if (!user.Photos.Any(p=>p.IsMain)) photo.IsMain = true;

                user.Photos.Add(photo);

                var result = await _dataContext.SaveChangesAsync() > 0;
                
                if (result) return Result<Photo>.Success(photo);

                return Result<Photo>.Failure("Problem adding photo.");
            }
        }
    }
}
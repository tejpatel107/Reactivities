using Application.Interface;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

public class Create 
{
    public class Command : IRequest<Result<Unit>>
    {
        public Activity Activity { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
        }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IUserAcessor _userAccessor;
        public Handler(DataContext context, IUserAcessor userAcessor)
        {
            _context = context;
            _userAccessor = userAcessor; 
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            _context.Activities.Add(request.Activity);

            var user = await _context.Users.FirstOrDefaultAsync(x=>
                x.UserName == _userAccessor.GetUsername());

            var attendee = new ActivityAttendee{
                AppUser = user,
                Activity = request.Activity,
                IsHost = true
            };

            request.Activity.Attendees.Add(attendee);

            _context.Activities.Add(request.Activity);

            var result = await _context.SaveChangesAsync() > 0;

            if(!result) return Result<Unit>.Failure("Failed to create the activity");

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    public class ActivityParams : PagingParams
    {
        public bool isGoing { get; set; }        
        public bool isHost { get; set; }        
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
    }
}
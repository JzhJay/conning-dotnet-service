using System;

namespace Conning.GraphQL
{
    public class Session
    {
        public DateTime startTime { get; }
        public DateTime endTime { get; }
        public string userId { get; }
        public string type { get; }

        public Session(DateTime startTime, DateTime endTime, string userId, string type)
        {
            this.startTime = startTime;
            this.endTime = endTime;
            this.userId = userId;
            this.type = type;
        }
    }
}

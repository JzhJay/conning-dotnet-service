using System;
using System.Collections.Generic;
using MongoDB.Bson;

namespace Conning.Models.Notifications
{
       public class NotificationSubscription
    {
        public ObjectId _id { get; set; }
        public string owner { get; set; }
        public string target { get; set; }
        public string trigger { get; set; }
        public string severity { get; set; }
        public dynamic extra { get; set; }
        public bool? email { get; set; }
        public bool? emailSecondary { get; set; }
        public bool? mobile { get; set; }
        public bool? desktop { get; set; }
        public string scope { get; set; }
        
        public string tenant { get; set; }
    }

    public class Endpoint
    {
        public string type { get; set; }
        public string value { get; set; }
    }

    public class SentNotification
    {
        public ObjectId _id { get; set; }
        public string title { get; set; }
        public DateTime sentTime { get; set; }
        public string owner { get; set; }
        public Endpoint endpoint { get; set; }
        public string messageKey { get; set; } // Unique ID used to determine if a threshold notification has been sent
        public string messageID { get; set; } // AWS message ID: Used for tracking bounced emails
        public bool? delivered { get; set; }
    }
    
    public class DesktopNotificationEvent
    {
        public string title { get; set; }
        public string message { get; set; }
        public double timeout { get; set; }
        public string userId { get; set; }
    }


    public class NotificationMessageParam
    {
        public string jobID { get; set; }
        public string messageType { get; set; }
        public string simulationName { get; set; }
        public string gridName { get; set; }
        public string status { get; set; }
        public long? runTime { get; set; }
        public long? gridUptime { get; set; }
        public double? billTotal { get; set; }
        public double? threshold { get; set; }
        public string owner { get; set; }
    }
}
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using Conning.Models.Notifications;

namespace Conning.Common
{
    public interface IDesktopNotificationQueue
    {
        ConcurrentStack<DesktopNotificationEvent> NotificationsQuery { get; }
        IObservable<DesktopNotificationEvent> NotificationsForUser(string userId);
#if DEBUG
        IObservable<DesktopNotificationEvent> AllNotifications { get; }
#endif
        //Message AddMessage(ReceivedMessage message);
        DesktopNotificationEvent AddNotificationEvent(DesktopNotificationEvent desktopNotificationEvent);
    }

    public class DesktopNotificationQueue : IDesktopNotificationQueue
    {
        public DesktopNotificationQueue()
        {
            NotificationsQuery = new ConcurrentStack<DesktopNotificationEvent>();
            NotificationsQuery.Push(new DesktopNotificationEvent() {message = "bar", title = "foo", userId = "noah.shipley"});
            NotificationsQuery.Push(new DesktopNotificationEvent()
            {
                message = "bar2",
                title = "foo2",
                userId = "rashaine.johnson"
            });
        }

        public ConcurrentStack<DesktopNotificationEvent> NotificationsQuery { get; }

        private readonly Dictionary<string, ISubject<DesktopNotificationEvent>> _notificationsByUser =
            new Dictionary<string, ISubject<DesktopNotificationEvent>>();

#if DEBUG
        private ISubject<DesktopNotificationEvent> _allNotifications = new ReplaySubject<DesktopNotificationEvent>(1);
        public IObservable<DesktopNotificationEvent> AllNotifications => _allNotifications.AsObservable();
#endif

//        public Message AddMessage(ReceivedMessage message)
//        {
//            if (!Users.TryGetValue(message.FromId, out var displayName))
//            {
//                displayName = "(unknown)";
//            }
//
//            return AddMessage(new Message
//            {
//                Content = message.Content,
//                SentAt = message.SentAt,
//                From = new MessageFrom
//                {
//                    DisplayName = displayName,
//                    Id = message.FromId
//                }
//            });
//        }
//
//        public Message AddMessage(Message message)
//        {
//            AllNotifications.Push(message);
//            _messageStream.OnNext(message);
//            return message;
//        }
//      

        public DesktopNotificationEvent AddNotificationEvent(DesktopNotificationEvent desktopNotificationEvent)
        {
            NotificationsQuery.Push(desktopNotificationEvent);

#if DEBUG
            _allNotifications.OnNext(desktopNotificationEvent);
#endif
            
            var stream = NotificationStreamForUser(desktopNotificationEvent.userId);            
            stream.OnNext(desktopNotificationEvent);
            return desktopNotificationEvent;
        }

        private ISubject<DesktopNotificationEvent> NotificationStreamForUser(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return null;
            }

            if (!_notificationsByUser.ContainsKey(userId))
            {
                _notificationsByUser.Add(userId, new Subject<DesktopNotificationEvent>());
            }

            return _notificationsByUser[userId];
        }


        public IObservable<DesktopNotificationEvent> NotificationsForUser(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return null;
            }

            return NotificationStreamForUser(userId).AsObservable();
        }


//        public void AddError(Exception exception)
//        {
//            _notificationStream.OnError(exception);
//        }
    }
}
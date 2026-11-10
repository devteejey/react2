
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  X,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
  selectNotifications,
  selectUnreadCount,
} from "../features/notifications/notificationsSlice";

import "./notifications.css";

function NotificationBell() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle color="#16a34a" />;

      case "warning":
        return <AlertTriangle color="#d97706" />;

      case "error":
        return <XCircle color="#dc2626" />;

      default:
        return <Info color="#2563eb" />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const handleNotificationClick = (notification) => {
    dispatch(markAsRead(notification.id));

    if (notification.link) {
      window.location.assign(notification.link);
    }
  };

  return (
    <div className="notification-wrapper">
      <button
        className="notification-bell"
        onClick={() => setOpen(!open)}
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={open}
      >
        <Bell size={22} />

        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <div>
              <h3>Notifications</h3>
              <small>{unreadCount} unread</small>
            </div>

            <button
              className="icon-button"
              onClick={() => setOpen(false)}
              aria-label="Close notifications"
            >
              <X size={18} />
            </button>
          </div>

          <div className="notification-actions">
            <button
              onClick={() => dispatch(markAllAsRead())}
              disabled={unreadCount === 0}
            >
              <CheckCheck size={15} />
              Mark all read
            </button>

            <button
              onClick={() => dispatch(clearNotifications())}
              disabled={notifications.length === 0}
            >
              <Trash2 size={15} />
              Clear all
            </button>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">
                <Bell size={32} />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${
                    notification.read ? "read" : "unread"
                  }`}
                >
                  <div className="notification-icon">
                    {getIcon(notification.type)}
                  </div>

                  <div
                    className="notification-content"
                    onClick={() =>
                      handleNotificationClick(notification)
                    }
                    role={notification.link ? "link" : "button"}
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleNotificationClick(notification);
                      }
                    }}
                  >
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                    <small>
                      {formatDate(notification.createdAt)}
                    </small>
                  </div>

                  <div className="notification-item-actions">
                    {!notification.read && (
                      <button
                        title="Mark as read"
                        aria-label="Mark as read"
                        onClick={() =>
                          dispatch(markAsRead(notification.id))
                        }
                      >
                        <Check size={16} />
                      </button>
                    )}

                    <button
                      title="Delete notification"
                      aria-label="Delete notification"
                      onClick={() =>
                        dispatch(deleteNotification(notification.id))
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;


import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,

  reducers: {
    // ADD NOTIFICATION
    addNotification: {
      reducer: (state, action) => {
        state.notifications.unshift(action.payload);

        // Keep the most recent 50 notifications
        state.notifications = state.notifications.slice(0, 50);
      },

      prepare: ({ title, message, type = "info", link = null }) => ({
        payload: {
          id: nanoid(),
          title,
          message,
          type,
          link,
          read: false,
          createdAt: new Date().toISOString(),
        },
      }),
    },

    // MARK ONE AS READ
    markAsRead: (state, action) => {
      const notification = state.notifications.find(
        (item) => item.id === action.payload
      );

      if (notification) {
        notification.read = true;
      }
    },

    // MARK ALL AS READ
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
    },

    // DELETE ONE NOTIFICATION
    deleteNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (item) => item.id !== action.payload
      );
    },

    // CLEAR ALL NOTIFICATIONS
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
} = notificationsSlice.actions;

// SELECTORS
export const selectNotifications = (state) =>
  state.notifications.notifications;

export const selectUnreadCount = (state) =>
  state.notifications.notifications.filter(
    (notification) => !notification.read
  ).length;

export default notificationsSlice.reducer;

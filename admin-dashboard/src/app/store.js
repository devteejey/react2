
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import usersReducer from "../features/users/usersSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import themeReducer from "../features/theme/themeSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    dashboard: dashboardReducer,
    theme: themeReducer,
    notifications: notificationsReducer,
  },
});

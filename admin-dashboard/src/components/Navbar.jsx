import { useAuth } from "../context/auth";
import { useTheme } from "../context/theme";
import { useLocation } from "react-router-dom";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const pageNames = {
    "/": "Dashboard",
    "/users": "User dashboard",
    "/analytics": "Analytics",
    "/settings": "Settings",
  };
  const initials = user?.name?.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase() ?? "A";

  return (
    <header className="navbar">
      <div className="navbar-title">
        <span className="navbar-context">ADMIN WORKSPACE</span>
        <h1>{pageNames[pathname] ?? (pathname.startsWith("/users/") ? "User details" : "Dashboard")}</h1>
      </div>
      <div className="nav-right">
        <NotificationBell />
        <button className="button button-secondary theme-btn" type="button" onClick={toggleTheme} aria-label={`Switch to ${darkMode ? "light" : "dark"} theme`}>
          <span aria-hidden="true">{darkMode ? "☀" : "◐"}</span>
          <span>{darkMode ? "Light mode" : "Dark mode"}</span>
        </button>
        <span className="nav-divider" />
        <span className="avatar nav-avatar" aria-hidden="true">{initials}</span>
        <div className="nav-user">
          <strong>{user?.name ?? "Admin"}</strong>
          <span>Administrator</span>
        </div>
        <button className="button button-quiet logout-btn" type="button" onClick={logout}>Log out</button>
      </div>
    </header>
  );
}
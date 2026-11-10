import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [workspaceName, setWorkspaceName] = useState(() => {
    const savedSettings = localStorage.getItem("admin-dashboard-settings");
    if (!savedSettings) return "AdminPro";
    try {
      return JSON.parse(savedSettings).workspace || "AdminPro";
    } catch (error) {
      console.error("Unable to read the workspace name:", error);
      return "AdminPro";
    }
  });

  useEffect(() => {
    const updateWorkspaceName = (event) => {
      setWorkspaceName(event.detail.workspace || "AdminPro");
    };
    window.addEventListener("admin-dashboard-settings-updated", updateWorkspaceName);
    return () => window.removeEventListener("admin-dashboard-settings-updated", updateWorkspaceName);
  }, []);

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">A</span>
        <span>{workspaceName}</span>
      </div>
      <p className="sidebar-label">MENU</p>
      <nav aria-label="Main navigation">
        <NavLink to="/" end><span className="nav-icon">⌂</span>Dashboard</NavLink>
        <NavLink to="/users"><span className="nav-icon">♙</span>Users</NavLink>
        <NavLink to="/analytics"><span className="nav-icon">▥</span>Analytics</NavLink>
        <NavLink to="/settings"><span className="nav-icon">⚙</span>Settings</NavLink>
      </nav>
      <div className="sidebar-footer">
        <span className="online-dot" />
        Demo workspace
      </div>
    </aside>
  );
}
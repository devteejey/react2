import { useState } from "react";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/theme";
import { getUsers } from "../services/userService";
import { downloadJson } from "../services/downloadService";

const SETTINGS_KEY = "admin-dashboard-settings";
const defaultSettings = {
  workspace: "AdminPro",
  email: "admin@example.com",
  weeklySummary: true,
};

function getSettings() {
  const savedSettings = localStorage.getItem(SETTINGS_KEY);
  if (!savedSettings) return defaultSettings;
  try {
    return { ...defaultSettings, ...JSON.parse(savedSettings) };
  } catch (error) {
    console.error("Unable to read saved settings:", error);
    return defaultSettings;
  }
}

export default function Settings() {
  const [settings, setSettings] = useState(getSettings);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const { darkMode, toggleTheme } = useTheme();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      window.dispatchEvent(new CustomEvent("admin-dashboard-settings-updated", { detail: settings }));
      setNotice("Your settings have been saved.");
    } catch (saveError) {
      console.error("Unable to save settings:", saveError);
      setError("Settings could not be saved in this browser.");
    }
  };

  const exportWorkspace = async () => {
    try {
      const users = await getUsers();
      downloadJson("adminpro-workspace-backup.json", {
        exportedAt: new Date().toISOString(),
        settings,
        users,
      });
      setNotice("Workspace backup downloaded.");
      setError("");
    } catch (exportError) {
      console.error("Unable to export workspace data:", exportError);
      setError(exportError.response?.data?.message || "The workspace backup could not be created.");
    }
  };

  return (
    <>
      <Navbar />
      <section className="page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Workspace</p>
            <h2>Settings</h2>
            <p className="page-description">Customize your workspace preferences.</p>
          </div>
          <span className="demo-badge">SAVED IN THIS BROWSER</span>
        </div>
        <section className="panel settings-panel">
          <div className="panel-heading">
            <div>
              <h3>General</h3>
              <p>These preferences are stored locally in this browser.</p>
            </div>
          </div>
          <form className="settings" onSubmit={handleSubmit}>
            <label>
              Workspace name
              <input
                name="workspace"
                type="text"
                value={settings.workspace}
                onChange={(event) => setSettings({ ...settings, workspace: event.target.value })}
                required
                maxLength={80}
              />
            </label>
            <label>
              Contact email
              <input
                name="email"
                type="email"
                value={settings.email}
                onChange={(event) => setSettings({ ...settings, email: event.target.value })}
                required
              />
            </label>
            <label className="checkbox-label">
              <input
                name="weeklySummary"
                type="checkbox"
                checked={settings.weeklySummary}
                onChange={(event) => setSettings({ ...settings, weeklySummary: event.target.checked })}
              />
              <span>Send me a weekly activity summary</span>
            </label>
            <label>
              Appearance
              <select
                name="appearance"
                value={darkMode ? "dark" : "light"}
                onChange={(event) => {
                  if ((event.target.value === "dark") !== darkMode) toggleTheme();
                }}
              >
                <option value="light">Light theme</option>
                <option value="dark">Dark theme</option>
              </select>
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            {notice && <p className="form-success" role="status">{notice}</p>}
            <div className="form-actions">
              <button className="button button-primary" type="submit">Save settings</button>
            </div>
          </form>
        </section>
        <section className="panel backup-panel">
          <div className="panel-heading">
            <div>
              <h3>Data backup</h3>
              <p>Download a copy of your workspace settings and user list.</p>
            </div>
            <button className="button button-secondary" type="button" onClick={exportWorkspace}>
              Download backup
            </button>
          </div>
          <p className="backup-note">Workspace preferences are stored in this browser; the user list is downloaded from the server.</p>
        </section>
      </section>
    </>
  );
}
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/users/UsersDashboard";
import UserDetails from "./pages/users/UserDetails";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="layout">
              <Sidebar />

              <main className="content">
                <Routes>
                  <Route
                    path="/"
                    element={<Dashboard />}
                  />

                  <Route
                    path="/users/:userId"
                    element={<UserDetails />}
                  />

                  <Route
                    path="/users"
                    element={<Users />}
                  />

                  <Route
                    path="/analytics"
                    element={<Analytics />}
                  />

                  <Route
                    path="/settings"
                    element={<Settings />}
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
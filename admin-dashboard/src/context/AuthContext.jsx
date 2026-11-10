import { useState } from "react";
import { AuthContext } from "./auth";

function getSavedUser() {
  const savedUser = localStorage.getItem("user");
  if (!savedUser) return null;

  try {
    const user = JSON.parse(savedUser);
    return typeof user?.email === "string" ? user : null;
  } catch (error) {
    console.error("Unable to read the saved login:", error);
    localStorage.removeItem("user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  const login = (email, password) => {
    if (
      email.trim().toLowerCase() !== "admin@example.com" ||
      password !== "password123"
    ) {
      return false;
    }

    const loggedUser = {
      name: "Admin",
      email: email.trim().toLowerCase(),
    };
    localStorage.setItem("user", JSON.stringify(loggedUser));
    setUser(loggedUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

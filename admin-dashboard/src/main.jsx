import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/dashboard.css";

ReactDOM.createRoot(
  document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <React.StrictMode>
        <Provider store={store}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </Provider>
      </React.StrictMode>
    </AuthProvider>
  </BrowserRouter>
);

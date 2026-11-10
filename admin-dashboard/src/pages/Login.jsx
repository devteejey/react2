import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (loginEmail, loginPassword) => {
    setError("");
    try {
      if (login(loginEmail, loginPassword)) {
        navigate("/", { replace: true });
      } else {
        setError("That email and password combination is not correct.");
      }
    } catch (loginError) {
      console.error("Unable to sign in:", loginError);
      setError("Sign in could not be completed. Please try again.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="login-page">
      <div className="login-brand">
        <span className="brand-mark">A</span>
        <span>AdminPro</span>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Sign in to your account</h1>
        <p className="login-description">Enter your details to access your workspace.</p>
        {error && <p className="error" role="alert">{error}</p>}
        <label>
          Email address
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <span className="password-field">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </span>
        </label>
        <button className="button button-primary login-submit" type="submit">Sign in</button>
        <button
          className="button button-secondary demo-fill"
          type="button"
          onClick={() => handleLogin("admin@example.com", "password123")}
        >
          Sign in with demo account
        </button>
        <p className="login-footnote">Demo account only · Your data stays in this browser</p>
      </form>
    </div>
  );
}

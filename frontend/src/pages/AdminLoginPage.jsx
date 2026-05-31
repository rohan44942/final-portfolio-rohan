import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin, setAuthToken } from "../lib/api";
import { setStoredToken } from "../lib/storage";
import ThemeSwitch from "../components/ThemeSwitch";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = await loginAdmin(email, password);
      setStoredToken(token);
      setAuthToken(token);
      navigate("/admin");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-shell">
      <div className="admin-top-controls">
        <ThemeSwitch />
      </div>
      <div className="admin-login-wrap">
        <form className="card admin-form admin-login-card" onSubmit={handleSubmit}>
          <h1>Admin Login</h1>
          <p className="muted">Manage your portfolio content securely.</p>
          <label htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <div className="admin-login-footer">
            <Link to="/" className="back-home-link">
              ← Back to Home
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default AdminLoginPage;

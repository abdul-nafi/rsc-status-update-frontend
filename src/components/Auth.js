import React, { useState } from "react";
import api from "../services/api";

function Auth({ onLoginSuccess }) {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [signupDisabled, setSignupDisabled] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      if (mode === "login") {
        const res = await api.post("api-token-auth/", {
          username: form.username,
          password: form.password,
        });
        localStorage.setItem("token", res.data.token);
        onLoginSuccess && onLoginSuccess();
      } else {
        // Signup mode: create user, then auto login
        await api.post("signup/", form); 
        const loginRes = await api.post("api-token-auth/", {
          username: form.username,
          password: form.password,
        });
        localStorage.setItem("token", loginRes.data.token);
        setMsg("Signup and login successful!");
        setSignupDisabled(true);
        setMode("login");
        onLoginSuccess && onLoginSuccess();
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Signup is disabled: user already exists.");
        setSignupDisabled(true);
      } else {
        setError(err.response?.data?.detail || "Authentication failed");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>{mode === "login" ? "Login" : "Sign up"}</h2>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          autoComplete="username"
        />
        {mode === "signup" && (
          <input
            name="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
        )}
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
        <button type="submit">{mode === "login" ? "Login" : "Sign up"}</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {msg && <p style={{ color: "green" }}>{msg}</p>}
      <p style={{ marginTop: 12 }}>
        {mode === "login" ? "No account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => {
            setError("");
            setMsg("");
            setForm({ username: "", password: "", email: "" });
            setMode(mode === "login" ? "signup" : "login");
          }}
          style={{ background: "none", border: "none", color: "blue", cursor: "pointer", padding: 0 }}
        >
          {mode === "login" ? "Sign up" : "Login"}
        </button>
      </p>
    </div>
  );
}

export default Auth;

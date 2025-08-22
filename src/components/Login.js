import React, { useState } from "react";
import api from "../services/api";

function Login({ onLoginSuccess }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post("/api-token-auth/", form);

      localStorage.setItem("token", res.data.token);
      setError("");
      onLoginSuccess(); // Notify parent of login success
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
      <button type="submit">Login</button>
      {error && <p style={{color:"red"}}>{error}</p>}
    </form>
  );
}

export default Login;

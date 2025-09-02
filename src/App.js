import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <div className="app-container">
      {loggedIn ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <Auth onLoginSuccess={() => setLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;

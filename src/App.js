import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import AdminDashboard from "./pages/AdminDashboard";
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true); // User is logged in if token exists
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <div className="app-container">
      {loggedIn ? (
        <AdminDashboard onLogout={handleLogout}/>
      ) : (
        <Login onLoginSuccess={() => setLoggedIn(true)} />
        
      )}
    </div>
  );
}

export default App;

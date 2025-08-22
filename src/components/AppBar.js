import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AppBar() {
  const location = useLocation();

  return (
    <nav>
      <div className="logo-container">
        <img 
          src="/rsclogo.jpg" 
          alt="Logo" 
          style={{ height: 40, width: 'auto' }} 
        />
      </div>
      <div className="links-container">
        <Link to="/add-member" className={location.pathname === "/add-member" ? "active" : ""}>Add Member</Link>
        <Link to="/members" className={location.pathname === "/members" ? "active" : ""}>Members</Link>
      </div>
    </nav>
  );
}

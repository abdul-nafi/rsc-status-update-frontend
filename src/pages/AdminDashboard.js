import React, { useState } from "react";
import MemberList from "../components/MemberList";
import MemberForm from "../components/MemberForm";

function AdminDashboard({ onLogout }) {
  const [editingMember, setEditingMember] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleEdit = (member) => setEditingMember(member);
  const handleFormSaved = () => {
    setEditingMember(null);
    setRefreshFlag((prev) => !prev);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout(); // Will update App state
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} style={{
          padding: '.6rem 1.2rem',
          borderRadius: '8px',
          background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
          color: 'white',
          border: 'none',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Logout
        </button>
      </div>
      <MemberForm memberToEdit={editingMember} onSaved={handleFormSaved} />
      <MemberList key={refreshFlag} onEdit={handleEdit} />
    </div>
  );
}

export default AdminDashboard;

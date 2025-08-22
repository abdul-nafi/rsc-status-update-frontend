import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppBar from "../components/AppBar";
import MemberForm from "../components/MemberForm";
import MembersPage from "./MembersPage"; // import the members listing page

function AdminDashboard({ onLogout }) {
  const [editingMember, setEditingMember] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  return (
    <>
      <AppBar />
      <div className="admin-dashboard-container">
        <button
          onClick={handleLogout}
          style={{
            padding: ".6rem 1.2rem",
            borderRadius: "8px",
            background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
            color: "white",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: "1rem",
          }}
        >
          Logout
        </button>

        <Routes>
          <Route path="/" element={<Navigate to="/add-member" />} />
          <Route
            path="/add-member"
            element={
              <div className="form-container">
                <MemberForm
                  memberToEdit={editingMember}
                  onSaved={() => setEditingMember(null)}
                />
              </div>
            }
          />
          <Route
            path="/members"
            element={<MembersPage onEdit={setEditingMember} />}
          />
        </Routes>
      </div>
    </>
  );
}

export default AdminDashboard;

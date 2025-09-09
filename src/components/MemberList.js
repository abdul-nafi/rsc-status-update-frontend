import React, { useEffect, useState } from "react";

import MemberCard from "./MemberCard";

function MemberList({ onEdit }) {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");

  const fetchMembers = async () => {
    try {
      const res = await api.get("/api/members/");
      setMembers(res.data);
      setError("");
    } catch {
      setError("Failed to load members");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div>
      <h2>Party Members</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="member-grid">
        {members.map((m) => (
          <MemberCard key={m.id} member={m} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
}

export default MemberList;

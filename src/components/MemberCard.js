import React from "react";

function MemberCard({ member, onEdit }) {
  return (
    <div className="member-card">
      <h3>{member.name}</h3>
      <p>Phone: {member.contact_number}</p>
      <p>Email: {member.email}</p>
      <p>Unit: {member.unit}</p>
      <p>Working: {member.is_working ? "Yes" : "No"}</p>
      <p>Job Title: {member.job_title}</p>
      <p>Last Updated: {new Date(member.last_updated).toLocaleString()}</p>
      {onEdit && <button onClick={() => onEdit(member)}>Edit</button>}
    </div>
  );
}

export default MemberCard;

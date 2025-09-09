import React, { useState, useEffect } from "react";
import api from "../services/api";
import { jsPDF } from "jspdf";
import Modal from "../components/Modal";
import MemberForm from "../components/MemberForm";

function MembersPage() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, vacation, exited
  const [unitFilter, setUnitFilter] = useState(""); // New: unit filter state
  const [units, setUnits] = useState([]); // New: list of units for dropdown
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch members
  useEffect(() => {
    api
      .get("/api/members/")
      .then((res) => setMembers(res.data))
      .catch(() => setMembers([]));
  }, []);

  // Fetch unit names for filter dropdown
  useEffect(() => {
    api
      .get("/api/unit-names/")
      .then((res) => setUnits(res.data))
      .catch(() => setUnits([]));
  }, []);

  // Filter members based on search, status, and unit
  useEffect(() => {
    let filtered = [...members];
    const search = searchTerm.trim().toLowerCase();

    if (search) {
      filtered = filtered.filter(
        (m) =>
          (m.name && m.name.toLowerCase().includes(search)) ||
          (m.contact_number && m.contact_number.toLowerCase().includes(search)) ||
          (m.unit && m.unit.toLowerCase().includes(search))
      );
    }

    if (statusFilter === "active") {
      filtered = filtered.filter(
        (m) => !m.is_on_vacation && !m.is_exited_country
      );
    } else if (statusFilter === "vacation") {
      filtered = filtered.filter((m) => m.is_on_vacation);
    } else if (statusFilter === "exited") {
      filtered = filtered.filter((m) => m.is_exited_country);
    }

    if (unitFilter) {
      filtered = filtered.filter((m) => m.unit === unitFilter);
    }

    setFilteredMembers(filtered);
  }, [members, searchTerm, statusFilter, unitFilter]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Member Phone Numbers", 10, 10);
    doc.setFontSize(12);
    let y = 20;

    filteredMembers.forEach((m) => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(`${m.name} (${m.unit}): ${m.contact_number}`, 10, y);
      y += 10;
    });

    doc.save("member_numbers.pdf");
  };

  const handleEditClick = (member) => {
    setEditingMember(member);
    setModalOpen(true);
  };

  const handleFormSaved = () => {
    setEditingMember(null);
    setModalOpen(false);
    api.get("/api/members/").then((res) => setMembers(res.data));
  };

  const handleCloseModal = () => {
    setEditingMember(null);
    setModalOpen(false);
  };

  const handleDeleteClick = async (memberId) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      await api.delete(`/api/members/${memberId}/`);
      const res = await api.get("/api/members/");
      setMembers(res.data);
    } catch (error) {
      alert("Failed to delete member.");
    }
  };

  return (
    <div>
      <h2>Members</h2>
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search by Name, Number or Unit"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", flexGrow: 1, minWidth: 200 }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "6px" }}
        >
          <option value="all">All Members</option>
          <option value="active">Active Members</option>
          <option value="vacation">Vacation Members</option>
          <option value="exited">Exited Members</option>
        </select>

        {/* New Unit Filter Dropdown */}
        <select
          value={unitFilter}
          onChange={(e) => setUnitFilter(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "6px" }}
        >
          <option value="">All Units</option>
          {units.map((unit, i) => (
            <option value={unit} key={i}>
              {unit}
            </option>
          ))}
        </select>

        <button
          onClick={exportToPDF}
          style={{
            background: "#43cea2",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "0.5rem 1rem",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Download Numbers (PDF)
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="member-card"
            style={{
              cursor: "default",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ flexGrow: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  className={`status-dot ${
                    member.is_exited_country
                      ? "status-exited"
                      : member.is_on_vacation
                      ? "status-vacation"
                      : "status-active"
                  }`}
                ></span>
                <h3 style={{ margin: 0 }}>{member.name}</h3>
              </div>
              <p>
                <strong>Unit:</strong> {member.unit}
              </p>
              <p>
                <strong>Contact:</strong> {member.contact_number}
              </p>
              <p>
                <strong>On Vacation:</strong> {member.is_on_vacation ? "Yes" : "No"}
              </p>
              <p>
                <strong>Exited Country:</strong> {member.is_exited_country ? "Yes" : "No"}
              </p>
              <p>
                <strong>Job Title:</strong> {member.job_title}
              </p>
            </div>

            <button
              onClick={() => handleEditClick(member)}
              style={{
                marginTop: "12px",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#43cea2",
                color: "white",
                cursor: "pointer",
                fontWeight: "600",
                alignSelf: "stretch",
              }}
            >
              Update
            </button>
            <button
              onClick={() => handleDeleteClick(member.id)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#f44336",
                color: "white",
                cursor: "pointer",
                fontWeight: "600",
                flexGrow: 1,
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
        <MemberForm memberToEdit={editingMember} onSaved={handleFormSaved} />
      </Modal>
    </div>
  );
}

export default MembersPage;

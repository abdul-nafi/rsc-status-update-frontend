import React, { useEffect, useState } from "react";
import api from "../services/api";

function MemberForm({ memberToEdit, onSaved }) {
  const [units, setUnits] = useState([]);
  const [form, setForm] = useState({
    name: "",
    contact_number: "",
    email: "",
    unit: "",
    is_working: false,
    job_title: "",
    is_exited_country: false,
    is_on_vacation: false,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/unit-names/")
      .then((res) => setUnits(res.data))
      .catch(() => setUnits([]));
  }, []);

  useEffect(() => {
    if (memberToEdit) setForm(memberToEdit);
  }, [memberToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Handle "Exited Country" logic:
    if (name === "is_exited_country" && checked) {
      setForm((prev) => ({
        ...prev,
        is_exited_country: true,
        is_on_vacation: false,
        is_working: false,      // <-- CLEAR "Working"
        job_title: "",          // <-- CLEAR "Job Title"
      }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await api.put(`/members/${form.id}/`, form);
      } else {
        await api.post("/members/", form);
      }
      setError("");
      onSaved();
      setForm({
        name: "",
        contact_number: "",
        email: "",
        unit: "",
        is_working: false,
        job_title: "",
        is_exited_country: false,
        is_on_vacation: false,
      });
    } catch (err) {
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Failed to save member");
      }
    }
  };

  return (
    <form className="glass-card" onSubmit={handleSubmit}>
      <h2>{form.id ? "Edit Member" : "Add Member"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="contact_number"
        placeholder="Contact Number"
        value={form.contact_number}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        list="units"
        name="unit"
        placeholder="Enter or select unit"
        value={form.unit}
        onChange={handleChange}
        required
      />
      <datalist id="units">
        {units.map((unit, i) => (
          <option key={i} value={unit} />
        ))}
      </datalist>

      <label>
        Exited Country:
        <input
          type="checkbox"
          name="is_exited_country"
          checked={form.is_exited_country}
          onChange={handleChange}
        />
      </label>

      {/* Only show these fields if NOT exited country */}
      {!form.is_exited_country && (
        <>
          <label>
            On Vacation:
            <input
              type="checkbox"
              name="is_on_vacation"
              checked={form.is_on_vacation}
              onChange={handleChange}
            />
          </label>
          <label>
            Working:
            <input
              name="is_working"
              type="checkbox"
              checked={form.is_working}
              onChange={handleChange}
            />
          </label>
          <input
            name="job_title"
            placeholder="Job Title"
            value={form.job_title}
            onChange={handleChange}
          />
        </>
      )}

      <button type="submit">{form.id ? "Update" : "Add"}</button>
    </form>
  );
}

export default MemberForm;

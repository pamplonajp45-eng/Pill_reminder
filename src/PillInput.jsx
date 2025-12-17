import { useState, useEffect } from "react";
import "./PillInput.css";

export default function PillInput({ onAdd, editingPill, onUpdate, onCancelEdit }) {
  const [pillName, setPillName] = useState("");
  const [pillTimes, setPillTimes] = useState([""]);
  const [dosage, setDosage] = useState("");
  const [recurring, setRecurring] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingPill) {
      setPillName(editingPill.name);
      setPillTimes(editingPill.times);
      setDosage(editingPill.dosage || "");
      setRecurring(editingPill.recurring);
    }
  }, [editingPill]);

  function handleSubmit() {
    // Validation
    if (!pillName.trim()) {
      setError("Pill name is required");
      return;
    }
    
    if (pillTimes.some(t => !t)) {
      setError("All time slots must be filled");
      return;
    }

    const pillData = {
      name: pillName.trim(),
      times: pillTimes,
      dosage: dosage.trim(),
      recurring: recurring
    };

    if (editingPill) {
      onUpdate(editingPill.id, pillData);
    } else {
      onAdd(pillData);
    }

    resetForm();
  }

  function resetForm() {
    setPillName("");
    setPillTimes([""]);
    setDosage("");
    setRecurring(true);
    setError("");
  }

  function handleCancel() {
    resetForm();
    onCancelEdit();
  }

  function addTimeSlot() {
    setPillTimes([...pillTimes, ""]);
  }

  function removeTimeSlot(index) {
    setPillTimes(pillTimes.filter((_, i) => i !== index));
  }

  function updateTime(index, value) {
    const newTimes = [...pillTimes];
    newTimes[index] = value;
    setPillTimes(newTimes);
    setError(""); // Clear error on input
  }

  return (
    <div className="pill-input">
      {editingPill && <h3>✏️ Edit Pill</h3>}
      
      {error && <div className="error-message">{error}</div>}
      
      <input
        type="text"
        placeholder="Enter pill name..."
        value={pillName}
        onChange={(e) => {
          setPillName(e.target.value);
          setError("");
        }}
      />

      <input
        type="text"
        placeholder="Dosage (e.g., 500mg, 2 tablets)..."
        value={dosage}
        onChange={(e) => setDosage(e.target.value)}
      />

      <div className="time-slots">
        <label>⏰ Reminder Time(s):</label>
        {pillTimes.map((time, index) => (
          <div key={index} className="time-slot">
            <input
              type="time"
              value={time}
              onChange={(e) => updateTime(index, e.target.value)}
            />
            {pillTimes.length > 1 && (
              <button
                type="button"
                className="remove-time"
                onClick={() => removeTimeSlot(index)}
              >
                ❌
              </button>
            )}
          </div>
        ))}
        <button type="button" className="add-time" onClick={addTimeSlot}>
          + Add Another Time
        </button>
      </div>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={recurring}
          onChange={(e) => setRecurring(e.target.checked)}
        />
        📅 Daily reminder
      </label>

      <div className="button-group">
        <button className="submit-btn" onClick={handleSubmit}>
          {editingPill ? "Update Pill" : "Add Pill"}
        </button>
        {editingPill && (
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
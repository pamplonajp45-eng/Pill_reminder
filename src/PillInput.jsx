import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import "./PillInput.css";

export default function PillInput({
  onAdd,
  editingPill,
  onUpdate,
  onCancelEdit,
}) {
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
    if (!pillName.trim()) {
      setError("Pill name is required");
      return;
    }

    if (pillTimes.some((t) => !t)) {
      setError("All time slots must be filled");
      return;
    }

    const pillData = {
      name: pillName.trim(),
      times: pillTimes,
      dosage: dosage.trim(),
      recurring: recurring,
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
    if (editingPill) onCancelEdit();
  }

  function handleCancel() {
    resetForm();
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
    setError("");
  }

  return (
    <motion.div
      className="pill-input-container"
      layout
    >
      <div className="pill-input">
        {editingPill ? <h3>Edit Pill</h3> : <h3>Add New Pill</h3>}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-message"
          >
            {error}
          </motion.div>
        )}

        <div className="input-group">
          <label>Pill Name</label>
          <input
            type="text"
            placeholder="e.g., Vitamin C"
            value={pillName}
            onChange={(e) => {
              setPillName(e.target.value);
              setError("");
            }}
          />
        </div>

        <div className="input-group">
          <label>Dosage</label>
          <input
            type="text"
            placeholder="e.g., 500mg"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
          />
        </div>

        <div className="time-slots">
          <label>⏰ Reminder Time(s)</label>
          <AnimatePresence>
            {pillTimes.map((time, index) => (
              <motion.div
                key={index}
                className="time-slot"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
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
                    <FaTimes />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <button type="button" className="add-time" onClick={addTimeSlot}>
            <FaPlus /> Add Time Slot
          </button>
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
          />
          <span>Daily reminder</span>
        </label>

        <div className="button-group">
          <button className="submit-btn" onClick={handleSubmit}>
            {editingPill ? <><FaCheck /> Update Pill</> : <><FaPlus /> Add Pill</>}
          </button>
          {editingPill && (
            <button className="cancel-btn" onClick={handleCancel}>
              <FaTimes /> Cancel
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}


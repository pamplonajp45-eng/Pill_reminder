import { useState, useEffect } from "react";
import { generateId } from "../utils/generatedId";

export function usePills() {
  const [pills, setPills] = useState(() => {
    const saved = localStorage.getItem("pills");
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    return parsed.map((pill) => ({
      id: pill.id || generateId(),
      name: pill.name,
      times: pill.times || [pill.time],
      dosage: pill.dosage || "",
      recurring: pill.recurring !== undefined ? pill.recurring : true,
      takenToday: pill.takenToday || false,
    }));
  });

  // Persist pills
  useEffect(() => {
    localStorage.setItem("pills", JSON.stringify(pills));
  }, [pills]);

  // Robust Reset logic (handles app being closed at midnight)
  useEffect(() => {
    const checkReset = () => {
      const now = new Date();
      const today = now.toDateString(); // e.g., "Mon Dec 22 2025"
      const lastReset = localStorage.getItem("lastResetDate");

      if (lastReset !== today) {
        setPills((prev) =>
          prev.map((p) => (p.recurring ? { ...p, takenToday: false } : p))
        );
        localStorage.setItem("lastResetDate", today);
        console.log("Pills reset for the new day:", today);
      }
    };

    // Check on mount
    checkReset();

    // Check periodically (every minute)
    const interval = setInterval(checkReset, 60000);
    return () => clearInterval(interval);
  }, []);

  function addPill(pillData) {
    const newPill = {
      ...pillData,
      id: generateId(),
      takenToday: false,
    };
    setPills((prev) => [...prev, newPill]);
  }

  function updatePill(id, updatedData) {
    setPills((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)),
    );
  }

  function deletePill(id) {
    if (window.confirm("Are you sure you want to delete this pill?")) {
      setPills((prev) => prev.filter((p) => p.id !== id));
    }
  }

  function markAsTaken(id) {
    setPills((prev) =>
      prev.map((p) => (p.id === id ? { ...p, takenToday: true } : p)),
    );
  }

  function unmarkAsTaken(id) {
    setPills((prev) =>
      prev.map((p) => (p.id === id ? { ...p, takenToday: false } : p)),
    );
  }

  return {
    pills,
    addPill,
    updatePill,
    deletePill,
    markAsTaken,
    unmarkAsTaken,
  };
}


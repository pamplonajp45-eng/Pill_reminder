import { useState, useEffect } from "react";
import { generateId } from "../utils/generatedId";

export function usePills() {
  const [pills, setPills] = useState(() => {
    const saved = localStorage.getItem("pills");
    if (!saved) return [];
    
    const parsed = JSON.parse(saved);
    return parsed.map(pill => ({
      id: pill.id || generateId(),
      name: pill.name,
      times: pill.times || [pill.time],
      dosage: pill.dosage || "",
      recurring: pill.recurring !== undefined ? pill.recurring : true,
      takenToday: pill.takenToday || false
    }));
  });

  useEffect(() => {
    localStorage.setItem("pills", JSON.stringify(pills));
  }, [pills]);

  // Reset at midnight
  useEffect(() => {
    const checkMidnight = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setPills(prev =>
          prev.map(p => (p.recurring ? { ...p, takenToday: false } : p))
        );
      }
    }, 60000);

    return () => clearInterval(checkMidnight);
  }, []);

  function addPill(pillData) {
    const newPill = {
      ...pillData,
      id: generateId(),
      takenToday: false
    };
    setPills(prev => [...prev, newPill]);
  }

  function updatePill(id, updatedData) {
    setPills(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedData } : p))
    );
  }

  function deletePill(id) {
    if (window.confirm("Are you sure you want to delete this pill?")) {
      setPills(prev => prev.filter(p => p.id !== id));
    }
  }

  function markAsTaken(id) {
    setPills(prev =>
      prev.map(p => (p.id === id ? { ...p, takenToday: true } : p))
    );
  }

  function unmarkAsTaken(id) {
    setPills(prev =>
      prev.map(p => (p.id === id ? { ...p, takenToday: false } : p))
    );
  }

  return {
    pills,
    addPill,
    updatePill,
    deletePill,
    markAsTaken,
    unmarkAsTaken
  };
}
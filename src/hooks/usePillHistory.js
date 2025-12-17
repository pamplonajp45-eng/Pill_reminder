import { useState, useEffect } from "react";

export function usePillHistory() {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("pillHistory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("pillHistory", JSON.stringify(history));
  }, [history]);

  function addHistory(pill) {
    const historyEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pillId: pill.id,
      pillName: pill.name,
      dosage: pill.dosage,
      scheduledTimes: pill.times,
      takenAt: new Date().toLocaleString(),
      timestamp: Date.now()
    };
    setHistory(prev => [historyEntry, ...prev]);
  }

  function clearHistory() {
    if (window.confirm("Are you sure you want to clear all history?")) {
      setHistory([]);
    }
  }

  return {
    history,
    addHistory,
    clearHistory
  };
}
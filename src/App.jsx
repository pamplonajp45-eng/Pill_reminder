import { useState, useEffect } from "react";
import { usePills } from "./hooks/usePills";
import { usePillHistory } from "./hooks/usePillHistory";
import { useAlarm } from "./hooks/useAlarm";
import PillInput from "./PillInput";
import PillList from "./PillList";
import PillHistory from "./PillHistory";
import "./App.css";

export default function App() {
  const { pills, addPill, updatePill, deletePill, markAsTaken, unmarkAsTaken } = usePills();
  const { history, addHistory, clearHistory } = usePillHistory();
  
  const handlePillTaken = (pill) => {
    markAsTaken(pill.id);
    addHistory(pill);
  };

  const handlePillSnoozed = (pill) => {
    unmarkAsTaken(pill.id);
  };

  useAlarm(pills, handlePillTaken, handlePillSnoozed);

  const [editingPill, setEditingPill] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  }

  // Request notification permission
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}, []);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="app">
      <h1>Pill Reminder</h1>
      
      <div className="tab-buttons">
        <button 
          className={!showHistory ? "active" : ""} 
          onClick={() => setShowHistory(false)}
        >
          My Pills
        </button>
        <button 
          className={showHistory ? "active" : ""} 
          onClick={() => setShowHistory(true)}
        >
          History ({history.length})
        </button>
      </div>

      {!showHistory ? (
        <>
          <PillInput
            onAdd={addPill}
            editingPill={editingPill}
            onUpdate={updatePill}
            onCancelEdit={() => setEditingPill(null)}
          />
          
          {pills.length === 0 ? (
            <p className="empty-state">No pills added yet...</p>
          ) : (
            <PillList
              pills={pills}
              onDelete={deletePill}
              onMarkTaken={(id) => {
                const pill = pills.find(p => p.id === id);
                if (pill) handlePillTaken(pill);
              }}
              onEdit={setEditingPill}
            />
          )}
        </>
      ) : (
        <PillHistory history={history} onClear={clearHistory} />
      )}
    </div>
  );
}
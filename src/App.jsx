import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePills } from "./hooks/usePills";
import { usePillHistory } from "./hooks/usePillHistory";
import { useAlarm } from "./hooks/useAlarm";
import PillInput from "./PillInput";
import PillList from "./PillList";
import PillHistory from "./PillHistory";
import "./App.css";
import { FaHistory, FaPills } from "react-icons/fa";
import { usePushSubscription } from "./hooks/usePushSubscription";

export default function App() {
  const { pills, addPill, updatePill, deletePill, markAsTaken, unmarkAsTaken } =
    usePills();
  const { history, addHistory, clearHistory } = usePillHistory();

  const handlePillTaken = (pill) => {
    markAsTaken(pill.id);
    addHistory(pill);
  };

  const handlePillSnoozed = (pill) => {
    unmarkAsTaken(pill.id);
  };

  const { subscription, subscribeUser } = usePushSubscription();

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        subscribeUser();
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') subscribeUser();
        });
      }
    }
  }, [subscribeUser]);

  useAlarm(pills, handlePillTaken, handlePillSnoozed, { subscription });

  const [editingPill, setEditingPill] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="app">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        LUNO
      </motion.h1>

      <div className="tab-buttons">
        <button
          className={!showHistory ? "active" : ""}
          onClick={() => setShowHistory(false)}
        >
          <FaPills /> My Pills
        </button>
        <button
          className={showHistory ? "active" : ""}
          onClick={() => setShowHistory(true)}
        >
          <FaHistory /> History ({history.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!showHistory ? (
          <motion.div
            key="pills"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
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
                  const pill = pills.find((p) => p.id === id);
                  if (pill) handlePillTaken(pill);
                }}
                onEdit={setEditingPill}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PillHistory history={history} onClear={clearHistory} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


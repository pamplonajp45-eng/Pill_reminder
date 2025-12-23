import { FaHistory, FaTrashAlt, FaCheckCircle, FaCalendarAlt } from "react-icons/fa";
import "./PillHistory.css";

export default function PillHistory({ history, onClear }) {
  if (history.length === 0) {
    return (
      <div className="history-empty fade-in">
        <FaHistory size={48} style={{ opacity: 0.2, marginBottom: "1rem" }} />
        <p>No history yet. Start taking your pills!</p>
      </div>
    );
  }

  return (
    <div className="pill-history fade-in">
      <div className="history-header">
        <h2>Pill History</h2>
        <button className="clear-history" onClick={onClear}>
          <FaTrashAlt /> Clear
        </button>
      </div>

      <div className="history-list">
        {history.map((entry) => (
          <div key={entry.id} className="history-entry">
            <div className="history-pill-info">
              <span className="history-pill-name">{entry.pillName}</span>
              {entry.dosage && (
                <span className="history-dosage">{entry.dosage}</span>
              )}
            </div>
            <div className="history-details">
              <span className="history-time">
                <FaCheckCircle color="var(--primary)" /> Taken: {entry.takenAt}
              </span>
              <span className="history-scheduled">
                <FaCalendarAlt /> Scheduled: {entry.scheduledTimes.join(", ")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


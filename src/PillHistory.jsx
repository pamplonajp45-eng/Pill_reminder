import "./PillHistory.css";

export default function PillHistory({ history, onClear }) {
  if (history.length === 0) {
    return (
      <div className="history-empty">
        <p>No history yet. Start taking your pills!</p>
      </div>
    );
  }

  return (
    <div className="pill-history">
      <div className="history-header">
        <h2>Pill History</h2>
        <button className="clear-history" onClick={onClear}>
          Clear History
        </button>
      </div>

      <div className="history-list">
        {history.map((entry) => (
          <div key={entry.id} className="history-entry">
            <div className="history-pill-name">
              {entry.pillName}
              {entry.dosage && (
                <span className="history-dosage"> ({entry.dosage})</span>
              )}
            </div>
            <div className="history-details">
              <span className="history-time">✅ Taken: {entry.takenAt}</span>
              <span className="history-scheduled">
                📅 Scheduled: {entry.scheduledTimes.join(", ")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
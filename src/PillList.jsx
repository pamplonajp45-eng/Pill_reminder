import "./PillList.css";

export default function PillList({ pills, onDelete, onMarkTaken, onEdit }) {
  return (
    <ul className="pill-list">
      {pills.map((pill) => (
        <li key={pill.id} className={pill.takenToday ? "taken" : ""}>
          <div className="pill-main-info">
            <div className="pill-header">
              <span className="pill-name">{pill.name}</span>
              {pill.dosage && (
                <span className="pill-dosage">{pill.dosage}</span>
              )}
            </div>
            
            <div className="pill-times">
              {pill.times.map((time, i) => (
                <span key={i} className="pill-time">
                  ⏰ {time}
                </span>
              ))}
            </div>

            {pill.recurring && (
              <span className="recurring-badge">📅 Daily</span>
            )}

            {pill.takenToday && (
              <span className="taken-badge">✅ Taken Today</span>
            )}
          </div>

          <div className="pill-actions">
            {!pill.takenToday && (
              <button
                className="action-btn taken-btn"
                onClick={() => onMarkTaken(pill.id)}
                title="Mark as taken"
              >
                ✓
              </button>
            )}
            <button
              className="action-btn edit-btn"
              onClick={() => onEdit(pill)}
              title="Edit"
            >
              ✏️
            </button>
            <button
              className="action-btn delete-btn"
              onClick={() => onDelete(pill.id)}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
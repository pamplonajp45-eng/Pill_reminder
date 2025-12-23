import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaCheck, FaClock } from "react-icons/fa";
import "./PillList.css";

export default function PillList({ pills, onDelete, onMarkTaken, onEdit }) {
  return (
    <ul className="pill-list">
      <AnimatePresence>
        {pills.map((pill) => (
          <motion.li
            key={pill.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={pill.takenToday ? "taken" : ""}
            layout
          >
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
                    <FaClock size={12} /> {time}
                  </span>
                ))}
              </div>

              <div className="pill-badges">
                {pill.recurring && (
                  <span className="badge recurring">Daily</span>
                )}
                {pill.takenToday && (
                  <span className="badge taken">Taken Today</span>
                )}
              </div>
            </div>

            <div className="pill-actions">
              {!pill.takenToday && (
                <button
                  className="action-btn taken-btn"
                  onClick={() => onMarkTaken(pill.id)}
                  title="Mark as taken"
                >
                  <FaCheck />
                </button>
              )}
              <button
                className="action-btn edit-btn"
                onClick={() => onEdit(pill)}
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                className="action-btn delete-btn"
                onClick={() => onDelete(pill.id)}
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}


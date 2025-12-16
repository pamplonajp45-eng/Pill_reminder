import { useState, useEffect } from "react";
import PillInput from "./PillInput";
import PillList from "./PillList";

export default function App() {
const [pills, setPills] = useState(() => {
    const saved = localStorage.getItem("pills");
    return saved ? JSON.parse(saved) : [];
  });

useEffect(() => {
  localStorage.setItem("pills", JSON.stringify(pills));
  }, [pills]);

function addPill(pill) {
    setPills(prev => [...prev, pill]);
  }

function deletePill(index) {
    setPills(prev => prev.filter((_,i) => i !== index));
  }

return (
    <div>
      <h1>Pill Reminder</h1>
      

      <PillInput
        onAdd={addPill}  />
        {pills.length === 0 ? (
          <p>No pills added yet...</p>
        ):(<PillList
        pills={pills}
        onDelete={deletePill} />)}
      
    </div>
  );
}

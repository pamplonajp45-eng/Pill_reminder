import { useState } from "react";

import PillInput from "./PillInput";
import PillList from "./PillList";

export default function App() {
  const [pills, setPills] = useState ([]);

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
      <PillList
        pills={pills}
        onDelete={deletePill} />
    </div>
  );
}

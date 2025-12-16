import { useState } from "react";

export default function PillInput({onAdd}) {
  const [pillName, setPillName] = useState("");

  function handleAdd() {
    if (!pillName.trim()) return;
    onAdd(pillName.trim());
    setPillName("");
  }

  return (
    <div>
      <input
        type="text"
        placeholder="type heree..."
        value={pillName}
        onChange={(e) => setPillName(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

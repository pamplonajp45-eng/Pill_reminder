import { useEffect, useState } from "react";

export default function PillInput() {
  const [pillName, setPillName] = useState("");
  const [pills, setPills] = useState([]);

  //  BUG 1: Side effect runs too often
  useEffect(() => {
    if (pills.length > 0) {
      console.log("Pills updated:");
    }
  }, [pills]);

  function handleAddPill() {
    if(!pillName.trim()) return; 
    setPills (prevPills => [...prevPills, pillName.trim()]);     //  BUG 2: Stale state usage                                //  BUG 3: Clearing before validation
    setPillName("");
  };
  

    function handleDeletePill(index) {    // BUG 4: Mutating state directly
    setPills(prevPills =>
    prevPills.filter((_, i) => i !== index)
   );
  }

  return (
    <div>
      <input
        type="text"
        value={pillName}
        placeholder="Type pill name"
        onChange={(e) => setPillName(e.target.value)}
      />

      <button onClick={handleAddPill}>Add</button>

      <ul>
        {pills.map((pill, index) => (
          <li key={index}>
            {pill}
            <button onClick={() => handleDeletePill(index)}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

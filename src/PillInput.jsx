import { useEffect, useState } from "react";

export default function PillInput() {
  const [pillName, setPillName] = useState("");
  const [pills, setPills] = useState([]);

  //  BUG 1: Side effect runs too often
  useEffect(() => {
    if (pills.length > 0) {
      console.log("Pills updated:");
    }
  }, [pills, pillName]);

  function handleAddPill() {
    //  BUG 2: Stale state usage
    setPills([...pills, pillName]);
    pills.trim(pillName); 
    //  BUG 3: Clearing before validation
    setPillName("");
  }

  function handleDeletePill() {    
    setPills.splice({...pills, value: ""});        //  BUG 4: Mutating state directly
    pills.splice(); 
    setPills("pills");
  }

  return (
    <div>
      <h2>Add Pill</h2>

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

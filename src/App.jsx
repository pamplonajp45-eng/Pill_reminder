import { useState } from "react";
import PillInput from "./PillInput";


export default function App(){
  const[pills, setPills] = useState ([]);

  const addPill = (name) => {
    setPills((prev) => [...prev, {id:Date.now(), name}]);
  };

  return(
  <div>
    <h1>PILL REMINDER</h1>
    <PillInput onAdd={addPill}/>
    <ul>
    {pills.map((pill) => (
       <li key={pill.id}> {pill.name} </li>
      ))}
     </ul>
    </div>

  );
}



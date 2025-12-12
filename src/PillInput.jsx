import { useState } from "react";

export default function PillInput({onAdd}) {
const [ pillName, setPillName] = useState("");

const handleSubmit = () =>{
if(!pillName.trim()) return;
onAdd (pillName.trim());
setPillName("");
};

return(
<div>
<input
className="pill-input"
type="text"
placeholder="Please insert a pill name..."
value={pillName}
onChange={(e) => setPillName(e.target.value)}
/>
<button className="pill-button"
onClick={handleSubmit}

> Add pill</button>
</div>
)
}
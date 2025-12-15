export default function PillList({ pills, onDelete }) {
  return (
    <ul>
      {pills.map((pill, index) => (
        <li key={index}>
          {pill}
          <button onClick={() => onDelete(index)}>❌</button>
        </li>
      ))}
    </ul>
  );
}

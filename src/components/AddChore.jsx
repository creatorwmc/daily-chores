import { useState } from 'react';

export default function AddChore({ onAdd, onCancel }) {
  const [name, setName] = useState('');
  const [assignedTo, setAssignedTo] = useState('both');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), assignedTo);
  };

  return (
    <div className="add-chore-overlay">
      <form className="add-chore-form" onSubmit={handleSubmit}>
        <h2>Add Chore</h2>
        <input
          type="text"
          placeholder="Chore name (e.g., Take out trash)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
          <option value="both">Both of us</option>
          <option value="anyone">Anyone</option>
        </select>
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" disabled={!name.trim()}>
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

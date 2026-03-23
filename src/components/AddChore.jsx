import { useState } from 'react';

const FREQUENCIES = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'irregular', label: 'Irregular' },
];

const TIMES = [
  { id: 'morning', label: 'Morning' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'evening', label: 'Evening' },
];

function toggleSet(set, value) {
  const next = new Set(set);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

export default function AddChore({ onAdd, onCancel, members = [] }) {
  const [name, setName] = useState('');
  const [assignedTo, setAssignedTo] = useState('both');
  const [frequencies, setFrequencies] = useState(new Set(['daily']));
  const [times, setTimes] = useState(new Set(['morning']));

  const hasDaily = frequencies.has('daily');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || frequencies.size === 0) return;

    // Create a chore for each frequency + time combination
    const entries = [];
    for (const freq of frequencies) {
      if (freq === 'daily') {
        const timesToUse = times.size > 0 ? times : new Set(['morning']);
        for (const time of timesToUse) {
          entries.push({ frequency: freq, timeOfDay: time });
        }
      } else {
        entries.push({ frequency: freq, timeOfDay: null });
      }
    }

    onAdd(name.trim(), assignedTo, entries);
  };

  const choreCount = (() => {
    let count = 0;
    for (const freq of frequencies) {
      if (freq === 'daily') {
        count += Math.max(times.size, 1);
      } else {
        count += 1;
      }
    }
    return count;
  })();

  return (
    <div className="add-chore-overlay">
      <form className="add-chore-form" onSubmit={handleSubmit}>
        <h2>Add Chore</h2>
        <input
          type="text"
          placeholder="Chore name (e.g., Feed pigs)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <label className="chip-label">Frequency</label>
        <div className="chip-group">
          {FREQUENCIES.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`chip ${frequencies.has(f.id) ? 'chip-active chip-' + f.id : ''}`}
              onClick={() => setFrequencies(toggleSet(frequencies, f.id))}
            >
              {f.label}
            </button>
          ))}
        </div>

        {hasDaily && (
          <>
            <label className="chip-label">Time of Day</label>
            <div className="chip-group">
              {TIMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`chip ${times.has(t.id) ? 'chip-active chip-daily' : ''}`}
                  onClick={() => setTimes(toggleSet(times, t.id))}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </>
        )}

        <label className="chip-label">Assign To</label>
        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
          <option value="both">Both of us</option>
          <option value="anyone">Anyone</option>
          {members.map((m) => (
            <option key={m.uid} value={m.uid}>{m.name}</option>
          ))}
        </select>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" disabled={!name.trim() || frequencies.size === 0}>
            {choreCount > 1 ? `Add ${choreCount} Chores` : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
}

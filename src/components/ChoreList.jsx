export default function ChoreList({ chores, completions, userId, onToggle, onDelete }) {
  const isCompleted = (choreId) =>
    completions.some((c) => c.choreId === choreId && c.userId === userId);

  const completedBy = (choreId) =>
    completions
      .filter((c) => c.choreId === choreId)
      .map((c) => c.userName);

  const sortedChores = [...chores].sort((a, b) => {
    const aDone = isCompleted(a.id);
    const bDone = isCompleted(b.id);
    if (aDone !== bDone) return aDone ? 1 : -1;
    return (a.name || '').localeCompare(b.name || '');
  });

  if (chores.length === 0) {
    return (
      <div className="empty-state">
        <p>No chores yet!</p>
        <p>Tap the + button to add your first chore.</p>
      </div>
    );
  }

  const done = chores.filter((c) => isCompleted(c.id)).length;
  const total = chores.length;

  return (
    <div className="chore-list">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(done / total) * 100}%` }} />
        <span className="progress-text">
          {done}/{total} done
        </span>
      </div>

      {sortedChores.map((chore) => {
        const done = isCompleted(chore.id);
        const others = completedBy(chore.id).filter(
          (name) => name !== (userId ? undefined : undefined)
        );

        return (
          <div key={chore.id} className={`chore-item ${done ? 'completed' : ''}`}>
            <button
              className={`chore-check ${done ? 'checked' : ''}`}
              onClick={() => onToggle(chore.id)}
            >
              {done ? '✓' : ''}
            </button>
            <div className="chore-info">
              <span className="chore-name">{chore.name}</span>
              {completedBy(chore.id).length > 0 && (
                <span className="chore-completed-by">
                  Done by {completedBy(chore.id).join(', ')}
                </span>
              )}
            </div>
            <button className="chore-delete" onClick={() => onDelete(chore.id)}>
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}

import { useState } from 'react';
import { db } from '../config/firebase';
import { doc, updateDoc, deleteDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

function CompletionEditor({ completion, members, householdId, onClose }) {
  const [newUserId, setNewUserId] = useState(completion.userId);
  const [saving, setSaving] = useState(false);

  const newUserName = members.find((m) => m.uid === newUserId)?.name || newUserId;

  const handleSave = async () => {
    if (newUserId === completion.userId) { onClose(); return; }
    setSaving(true);
    await updateDoc(
      doc(db, 'households', householdId, 'completions', completion.id),
      { userId: newUserId, userName: newUserName }
    );
    setSaving(false);
    onClose();
  };

  const handleRemove = async () => {
    setSaving(true);
    await deleteDoc(doc(db, 'households', householdId, 'completions', completion.id));
    setSaving(false);
    onClose();
  };

  return (
    <div className="completion-editor">
      <div className="completion-editor-header">
        <span>Edit Completion</span>
        <button className="btn-icon" onClick={onClose}>x</button>
      </div>
      <label className="chip-label">Completed by</label>
      <select value={newUserId} onChange={(e) => setNewUserId(e.target.value)}>
        {members.map((m) => (
          <option key={m.uid} value={m.uid}>{m.name}</option>
        ))}
      </select>
      <div className="form-actions">
        <button className="btn-secondary" onClick={handleRemove} disabled={saving}>
          Remove
        </button>
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}

function ChoreDetail({ chore, completionsForChore, date, members, householdId, userId, userName, onClose }) {
  const [editingCompletion, setEditingCompletion] = useState(null);
  const [adding, setAdding] = useState(false);
  const [addUserId, setAddUserId] = useState(userId);

  const freq = chore.frequency || 'daily';

  const handleAddCompletion = async () => {
    setAdding(true);
    const addUserName = members.find((m) => m.uid === addUserId)?.name || addUserId;
    const completionDate = new Date(date);
    if (freq === 'daily') {
      completionDate.setHours(0, 0, 0, 0);
    } else if (freq === 'weekly') {
      completionDate.setDate(date.getDate() - date.getDay());
      completionDate.setHours(0, 0, 0, 0);
    } else {
      completionDate.setDate(1);
      completionDate.setHours(0, 0, 0, 0);
    }
    await addDoc(collection(db, 'households', householdId, 'completions'), {
      choreId: chore.id,
      userId: addUserId,
      userName: addUserName,
      date: completionDate,
      completedAt: serverTimestamp(),
    });
    setAdding(false);
  };

  return (
    <div className="chore-detail-panel">
      <div className="chore-detail-header">
        <div>
          <span className="chore-detail-name">{chore.name}</span>
          <span className={`freq-badge freq-${freq}`}>{freq}</span>
        </div>
        <button className="btn-icon" onClick={onClose}>x</button>
      </div>

      <div className="chore-detail-section">
        <label className="chip-label">Completions</label>
        {completionsForChore.length === 0 ? (
          <p className="chore-detail-empty">No one has completed this yet.</p>
        ) : (
          <div className="completion-list">
            {completionsForChore.map((c) => {
              const compTime = c.completedAt?.toDate ? c.completedAt.toDate() : null;
              return (
                <div key={c.id} className="completion-entry">
                  {editingCompletion === c.id ? (
                    <CompletionEditor
                      completion={c}
                      members={members}
                      householdId={householdId}
                      onClose={() => setEditingCompletion(null)}
                    />
                  ) : (
                    <>
                      <div className="completion-entry-icon">{'\u2713'}</div>
                      <div className="completion-entry-info">
                        <span className="completion-entry-user">{c.userName}</span>
                        {compTime && (
                          <span className="completion-entry-time">
                            {compTime.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <button
                        className="completion-edit-btn"
                        onClick={() => setEditingCompletion(c.id)}
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="chore-detail-section">
        <label className="chip-label">Add completion</label>
        <div className="add-completion-row">
          <select value={addUserId} onChange={(e) => setAddUserId(e.target.value)}>
            {members.map((m) => (
              <option key={m.uid} value={m.uid}>{m.name}</option>
            ))}
          </select>
          <button onClick={handleAddCompletion} disabled={adding}>
            {adding ? '...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CalendarView({ chores, completions, userId, userName, members, householdId, onToggle, onDelete }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [detailChore, setDetailChore] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const monthLabel = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const getChoresForDate = (date) => {
    return chores.filter((c) => {
      const freq = c.frequency || 'daily';
      return freq === 'daily' || freq === 'weekly' || freq === 'monthly';
    });
  };

  const getCompletionsForDate = (date) => {
    return completions.filter((c) => {
      if (!c.date) return false;
      const compDate = c.date.toDate ? c.date.toDate() : new Date(c.date);
      const chore = chores.find((ch) => ch.id === c.choreId);
      const freq = chore?.frequency || 'daily';

      if (freq === 'daily') return compDate.toDateString() === date.toDateString();
      if (freq === 'weekly') {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        return compDate >= startOfWeek && compDate < endOfWeek;
      }
      if (freq === 'monthly') {
        return compDate.getMonth() === date.getMonth() && compDate.getFullYear() === date.getFullYear();
      }
      return false;
    });
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const isSelected = (date) => date && date.toDateString() === selectedDate.toDateString();
  const isToday = (date) => date && date.toDateString() === today.toDateString();

  const selectedChores = getChoresForDate(selectedDate);
  const selectedCompletions = getCompletionsForDate(selectedDate);

  const isCompleted = (choreId) =>
    selectedCompletions.some((c) => c.choreId === choreId && c.userId === userId);

  const completedBy = (choreId) =>
    selectedCompletions.filter((c) => c.choreId === choreId).map((c) => c.userName);

  const sortedChores = [...selectedChores].sort((a, b) => {
    const aDone = isCompleted(a.id);
    const bDone = isCompleted(b.id);
    if (aDone !== bDone) return aDone ? 1 : -1;
    return (a.name || '').localeCompare(b.name || '');
  });

  return (
    <div className="calendar-view">
      <div className="calendar-nav">
        <button className="btn-icon" onClick={prevMonth}>{'\u2039'}</button>
        <span className="calendar-month-label">{monthLabel}</span>
        <button className="btn-icon" onClick={nextMonth}>{'\u203A'}</button>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="calendar-day-header">{d}</div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} className="calendar-day empty" />;

          const dayChores = getChoresForDate(date);
          const dayCompletions = getCompletionsForDate(date);
          const doneCount = dayChores.filter((c) =>
            dayCompletions.some((comp) => comp.choreId === c.id)
          ).length;
          const total = dayChores.length;

          return (
            <button
              key={date.toISOString()}
              className={`calendar-day ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
              onClick={() => { setSelectedDate(date); setDetailChore(null); }}
            >
              <span className="calendar-day-number">{date.getDate()}</span>
              {total > 0 && (
                <span className={`calendar-day-indicator ${doneCount === total ? 'all-done' : doneCount > 0 ? 'partial' : ''}`}>
                  {doneCount}/{total}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="calendar-selected-date">
        <h3>
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </h3>
      </div>

      {detailChore ? (
        <ChoreDetail
          chore={detailChore}
          completionsForChore={selectedCompletions.filter((c) => c.choreId === detailChore.id)}
          date={selectedDate}
          members={members}
          householdId={householdId}
          userId={userId}
          userName={userName}
          onClose={() => setDetailChore(null)}
        />
      ) : sortedChores.length === 0 ? (
        <div className="empty-state">
          <p>No chores for this day.</p>
        </div>
      ) : (
        <div className="chore-list">
          {sortedChores.map((chore) => {
            const done = isCompleted(chore.id);
            const freq = chore.frequency || 'daily';
            const names = completedBy(chore.id);
            return (
              <div
                key={chore.id}
                className={`chore-item ${done ? 'completed' : ''} chore-item-clickable`}
                onClick={() => setDetailChore(chore)}
              >
                <button
                  className={`chore-check ${done ? 'checked' : ''}`}
                  onClick={(e) => { e.stopPropagation(); onToggle(chore.id); }}
                >
                  {done ? '\u2713' : ''}
                </button>
                <div className="chore-info">
                  <span className="chore-name">
                    {chore.name}
                    <span className={`freq-badge freq-${freq}`}>{freq}</span>
                  </span>
                  {names.length > 0 && (
                    <span className="chore-completed-by">
                      Done by {names.join(', ')}
                    </span>
                  )}
                </div>
                <span className="chore-detail-arrow">{'\u203A'}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

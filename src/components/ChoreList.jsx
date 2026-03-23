import { useState, useRef } from 'react';

const SECTIONS = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'irregular', label: 'Irregular' },
];

const TIME_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'morning', label: 'Morning' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'evening', label: 'Evening' },
];

function AssignMenu({ members, userId, onAssign, onClose }) {
  const otherMembers = members.filter((m) => m.uid !== userId);
  return (
    <div className="assign-menu">
      <div className="assign-menu-title">Assign to:</div>
      {otherMembers.map((m) => (
        <button key={m.uid} className="assign-menu-item" onClick={() => { onAssign(m.uid); onClose(); }}>
          {m.name}
        </button>
      ))}
      <button className="assign-menu-item" onClick={() => { onAssign('both'); onClose(); }}>
        Both of us
      </button>
      <button className="assign-menu-item" onClick={() => { onAssign('anyone'); onClose(); }}>
        Anyone
      </button>
      <button className="assign-menu-item assign-menu-cancel" onClick={onClose}>
        Cancel
      </button>
    </div>
  );
}

function DraggableChoreItem({ chore, status, names, onToggle, onUncomplete, onDelete, onEditChore, onAssign, orderedByName, members, userId, index, onDragStart, onDragOver, onDrop }) {
  const done = status === 'completed';
  const accepted = status === 'accepted';
  const [showAssign, setShowAssign] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(chore.name);
  const [editFrequency, setEditFrequency] = useState(chore.frequency || 'daily');
  const [editTimeOfDay, setEditTimeOfDay] = useState(chore.timeOfDay || 'morning');

  const handleEditSubmit = () => {
    const trimmed = editName.trim();
    if (!trimmed) { setEditing(false); return; }
    const changes = {};
    if (trimmed !== chore.name) changes.name = trimmed;
    if (editFrequency !== (chore.frequency || 'daily')) changes.frequency = editFrequency;
    if (editFrequency === 'daily' && editTimeOfDay !== (chore.timeOfDay || 'morning')) {
      changes.timeOfDay = editTimeOfDay;
    }
    if (Object.keys(changes).length > 0) {
      onEditChore(chore.id, changes);
    }
    setEditing(false);
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') handleEditSubmit();
    if (e.key === 'Escape') {
      setEditName(chore.name);
      setEditFrequency(chore.frequency || 'daily');
      setEditTimeOfDay(chore.timeOfDay || 'morning');
      setEditing(false);
    }
  };

  const startEditing = () => {
    setEditName(chore.name);
    setEditFrequency(chore.frequency || 'daily');
    setEditTimeOfDay(chore.timeOfDay || 'morning');
    setEditing(true);
  };

  // Determine assignment display
  const getAssignmentLabel = () => {
    if (!chore.assignedTo || chore.assignedTo === 'both' || chore.assignedTo === 'anyone') return null;
    const member = members.find((m) => m.uid === chore.assignedTo);
    const assigneeName = member?.name || 'someone';
    const isAssignedToMe = chore.assignedTo === userId;
    const requestedBy = chore.assignedByName;
    if (isAssignedToMe && requestedBy) {
      return `Requested by ${requestedBy}`;
    }
    return `Assigned to ${assigneeName}`;
  };

  const assignmentLabel = getAssignmentLabel();
  const isRequestForMe = chore.assignedTo === userId && chore.assignedByUid && chore.assignedByUid !== userId;

  return (
    <div
      className={`chore-item ${done ? 'completed' : ''} ${accepted ? 'accepted' : ''} ${orderedByName ? 'ordered-by' : ''} ${isRequestForMe ? 'requested-for-me' : ''}`}
      draggable={!editing}
      onDragStart={(e) => !editing && onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      style={orderedByName ? { borderLeftColor: orderedByName === 'user1' ? 'var(--primary)' : '#e65100' } : undefined}
    >
      <div className="drag-handle" title="Drag to reorder">{'\u2261'}</div>
      <button
        className={`chore-check ${done ? 'checked' : ''} ${accepted ? 'accepted' : ''}`}
        onClick={() => onToggle(chore.id)}
        onDoubleClick={(e) => { e.stopPropagation(); if (done) onUncomplete(chore.id); }}
        title={done ? 'Completed — double-click to undo' : accepted ? 'Accepted — click to complete' : 'Click to accept'}
      >
        {done ? '\u2713' : accepted ? '\u2022' : ''}
      </button>
      <div className="chore-info">
        {editing ? (
          <div className="chore-edit-form">
            <input
              className="chore-rename-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleEditKeyDown}
              autoFocus
            />
            <div className="chore-edit-row">
              <select
                className="chore-edit-select"
                value={editFrequency}
                onChange={(e) => setEditFrequency(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="irregular">Irregular</option>
              </select>
              {editFrequency === 'daily' && (
                <select
                  className="chore-edit-select"
                  value={editTimeOfDay}
                  onChange={(e) => setEditTimeOfDay(e.target.value)}
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              )}
            </div>
            <div className="chore-edit-actions">
              <button className="btn-secondary chore-edit-btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
              <button className="chore-edit-btn-save" onClick={handleEditSubmit}>Save</button>
            </div>
          </div>
        ) : (
          <span
            className="chore-name"
            onDoubleClick={startEditing}
            title="Double-click to edit"
          >
            {chore.name}
          </span>
        )}
        {assignmentLabel && (
          <span className={`chore-assigned ${isRequestForMe ? 'request-highlight' : ''}`}>
            {assignmentLabel}
          </span>
        )}
        {names.length > 0 && (
          <span className="chore-completed-by">Done by {names.join(', ')}</span>
        )}
        {orderedByName && (
          <span className="chore-ordered-by">Order set by {orderedByName}</span>
        )}
      </div>
      <button
        className="chore-assign-btn"
        onClick={() => setShowAssign(!showAssign)}
        title="Assign to someone"
      >
        {'\u279C'}
      </button>
      <button className="chore-delete" onClick={() => onDelete(chore.id)}>
        x
      </button>
      {showAssign && (
        <AssignMenu
          members={members}
          userId={userId}
          onAssign={(uid) => onAssign(chore.id, uid)}
          onClose={() => setShowAssign(false)}
        />
      )}
    </div>
  );
}

function DraggableList({ chores, freq, getStatus, completedBy, onToggle, onUncomplete, onDelete, onEditChore, onReorder, onAssign, members, userId }) {
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    dragOverItem.current = index;
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;

    const reordered = [...chores];
    const [dragged] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverItem.current, 0, dragged);

    onReorder(reordered.map((c) => c.id));
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="chore-list">
      {chores.map((chore, index) => (
        <DraggableChoreItem
          key={chore.id}
          chore={chore}
          status={getStatus(chore.id, freq)}
          names={completedBy(chore.id, freq)}
          onToggle={onToggle}
          onUncomplete={onUncomplete}
          onDelete={onDelete}
          onEditChore={onEditChore}
          onAssign={onAssign}
          orderedByName={chore.orderedByName || null}
          members={members}
          userId={userId}
          index={index}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}

export default function ChoreList({ chores, completions, userId, userName, members, onToggle, onUncomplete, onDelete, onEditChore, onReorder, onAssign, showIrregular }) {
  const [timeFilter, setTimeFilter] = useState('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(true);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const isInWindow = (compDate, freq) => {
    if (freq === 'daily') return compDate.toDateString() === today.toDateString();
    if (freq === 'weekly') return compDate >= startOfWeek;
    return compDate.getMonth() === today.getMonth() && compDate.getFullYear() === today.getFullYear();
  };

  // Returns 'completed', 'accepted', or null for current user
  const getStatus = (choreId, freq) => {
    const match = completions.find((c) => {
      if (c.choreId !== choreId || c.userId !== userId) return false;
      const compDate = c.date?.toDate ? c.date.toDate() : new Date(c.date);
      return isInWindow(compDate, freq);
    });
    return match?.status || (match ? 'completed' : null); // legacy completions without status treated as completed
  };

  const isCompletedInWindow = (choreId, freq) => getStatus(choreId, freq) === 'completed';

  const isCompletedByAnyone = (choreId, freq) => {
    return completions.some((c) => {
      if (c.choreId !== choreId) return false;
      const compDate = c.date?.toDate ? c.date.toDate() : new Date(c.date);
      return isInWindow(compDate, freq) && (c.status === 'completed' || !c.status);
    });
  };

  const completedByFn = (choreId, freq) => {
    return completions
      .filter((c) => {
        if (c.choreId !== choreId) return false;
        const compDate = c.date?.toDate ? c.date.toDate() : new Date(c.date);
        if (!isInWindow(compDate, freq)) return false;
        return true;
      })
      .map((c) => {
        const statusLabel = c.status === 'accepted' ? ' (accepted)' : '';
        return c.userName + statusLabel;
      });
  };

  // Group chores by frequency
  const grouped = {};
  for (const section of SECTIONS) {
    grouped[section.id] = [];
  }
  for (const chore of chores) {
    const freq = chore.frequency || 'daily';
    if (grouped[freq]) {
      grouped[freq].push(chore);
    } else {
      grouped.irregular.push(chore);
    }
  }

  // Sort helper
  const sortChores = (list, freq) =>
    [...list].sort((a, b) => {
      if (a.sortOrder != null && b.sortOrder != null) {
        return a.sortOrder - b.sortOrder;
      }
      const aDone = isCompletedInWindow(a.id, freq);
      const bDone = isCompletedInWindow(b.id, freq);
      if (aDone !== bDone) return aDone ? 1 : -1;
      return (a.name || '').localeCompare(b.name || '');
    });

  // Calculate overall progress (accepted + completed)
  const visibleChores = chores.filter((c) => {
    const freq = c.frequency || 'daily';
    return freq !== 'irregular' || showIrregular;
  });
  const doneCount = visibleChores.filter((c) => {
    const freq = c.frequency || 'daily';
    return isCompletedInWindow(c.id, freq);
  }).length;
  const acceptedCount = visibleChores.filter((c) => {
    const freq = c.frequency || 'daily';
    return getStatus(c.id, freq) === 'accepted';
  }).length;
  const claimedCount = doneCount + acceptedCount; // total claimed (accepted or completed)
  const totalCount = visibleChores.length;

  if (totalCount === 0) {
    return (
      <div className="empty-state">
        <p>No chores yet!</p>
        <p>Tap the + button to add your first chore.</p>
      </div>
    );
  }

  // Filter out completed chores if hideCompleted is on
  const filterVisible = (list, freq) => {
    if (!hideCompleted) return list;
    return list.filter((c) => getStatus(c.id, freq) !== 'completed');
  };

  const getFilteredDailyChores = () => {
    const daily = grouped.daily;
    if (timeFilter === 'all') return daily;
    return daily.filter((c) => (c.timeOfDay || 'morning') === timeFilter);
  };

  const sectionsToShow = SECTIONS.filter((s) => {
    if (s.id === 'irregular' && !showIrregular) return false;
    return grouped[s.id].length > 0;
  });

  const handleReorder = (choreIds) => {
    onReorder(choreIds, userName);
  };

  const handleAssign = (choreId, assignToUid) => {
    onAssign(choreId, assignToUid, userName);
  };

  // Completed view
  if (showCompleted) {
    const completedChores = chores
      .filter((c) => {
        const freq = c.frequency || 'daily';
        if (freq === 'irregular' && !showIrregular) return false;
        return isCompletedByAnyone(c.id, freq);
      })
      .map((c) => {
        const freq = c.frequency || 'daily';
        return { ...c, _names: completedByFn(c.id, freq), _freq: freq };
      });

    return (
      <div className="chore-sections">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${totalCount ? (doneCount / totalCount) * 100 : 0}%` }} />
          <span className="progress-text">{doneCount}/{totalCount} done</span>
        </div>

        <button className="completed-toggle active" onClick={() => setShowCompleted(false)}>
          Completed ({completedChores.length}) — tap to go back
        </button>

        {completedChores.length === 0 ? (
          <div className="empty-state"><p>No completed chores yet today.</p></div>
        ) : (
          <div className="chore-list">
            {completedChores.map((chore) => (
              <div key={chore.id} className="chore-item completed">
                <button className="chore-check checked" onClick={() => onToggle(chore.id)}>
                  {'\u2713'}
                </button>
                <div className="chore-info">
                  <span className="chore-name">
                    {chore.name}
                    <span className={`freq-badge freq-${chore._freq}`}>{chore._freq}</span>
                  </span>
                  <span className="chore-completed-by">Done by {chore._names.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="chore-sections">
      <div className="progress-bar">
        <div className="progress-fill-accepted" style={{ width: `${totalCount ? (claimedCount / totalCount) * 100 : 0}%` }} />
        <div className="progress-fill-completed" style={{ width: `${totalCount ? (doneCount / totalCount) * 100 : 0}%` }} />
        <span className="progress-text">
          {doneCount}/{totalCount} done{acceptedCount > 0 ? ` (${acceptedCount} accepted)` : ''}
        </span>
      </div>

      {doneCount > 0 && (
        <div className="completed-controls">
          <button
            className={`completed-toggle ${!hideCompleted ? 'active' : ''}`}
            onClick={() => setHideCompleted(!hideCompleted)}
          >
            {hideCompleted ? `Show Completed (${doneCount})` : `Hide Completed (${doneCount})`}
          </button>
          <button className="completed-toggle" onClick={() => setShowCompleted(true)}>
            Details
          </button>
        </div>
      )}

      {sectionsToShow.map((section) => {
        const sectionChores = section.id === 'daily' ? getFilteredDailyChores() : grouped[section.id];
        const allSectionChores = grouped[section.id];
        const sectionDone = allSectionChores.filter((c) => isCompletedInWindow(c.id, section.id)).length;
        const sectionAccepted = allSectionChores.filter((c) => getStatus(c.id, section.id) === 'accepted').length;

        return (
          <div key={section.id} className="chore-section">
            <div className="section-header">
              <h2 className={`section-title freq-color-${section.id}`}>{section.label}</h2>
              <span className="section-count">
                {sectionDone}/{allSectionChores.length}
                {sectionAccepted > 0 ? ` +${sectionAccepted}` : ''}
              </span>
            </div>

            {section.id === 'daily' && grouped.daily.length > 0 && (
              <div className="time-filter-row">
                {TIME_FILTERS.map((tf) => (
                  <button
                    key={tf.id}
                    className={`time-filter-btn ${timeFilter === tf.id ? 'active' : ''}`}
                    onClick={() => setTimeFilter(tf.id)}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            )}

            {section.id === 'daily' ? (
              timeFilter === 'all' ? (
                ['morning', 'afternoon', 'evening'].map((time) => {
                  const timeChores = sortChores(
                    filterVisible(grouped.daily.filter((c) => (c.timeOfDay || 'morning') === time), 'daily'),
                    'daily'
                  );
                  if (timeChores.length === 0) return null;
                  return (
                    <div key={time} className="time-group">
                      <div className="time-header">{time.charAt(0).toUpperCase() + time.slice(1)}</div>
                      <DraggableList
                        chores={timeChores}
                        freq="daily"
                        getStatus={getStatus}
                        completedBy={completedByFn}
                        onToggle={onToggle}
                        onUncomplete={onUncomplete}
                        onDelete={onDelete}
                        onEditChore={onEditChore}
                        onReorder={handleReorder}
                        onAssign={handleAssign}
                        members={members}
                        userId={userId}
                      />
                    </div>
                  );
                })
              ) : (
                <DraggableList
                  chores={sortChores(filterVisible(sectionChores, 'daily'), 'daily')}
                  freq="daily"
                  getStatus={getStatus}
                  completedBy={completedByFn}
                  onToggle={onToggle}
                  onUncomplete={onUncomplete}
                  onDelete={onDelete}
                  onEditChore={onEditChore}
                  onReorder={handleReorder}
                  onAssign={handleAssign}
                  members={members}
                  userId={userId}
                />
              )
            ) : (
              <DraggableList
                chores={sortChores(filterVisible(sectionChores, section.id), section.id)}
                freq={section.id}
                getStatus={getStatus}
                completedBy={completedByFn}
                onToggle={onToggle}
                onUncomplete={onUncomplete}
                onDelete={onDelete}
                onEditChore={onEditChore}
                onReorder={handleReorder}
                onAssign={handleAssign}
                members={members}
                userId={userId}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

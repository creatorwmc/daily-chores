import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, orderBy, limit, onSnapshot, startAfter } from 'firebase/firestore';

export default function History({ householdId, chores, onClose }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!householdId) return;
    const q = query(
      collection(db, 'households', householdId, 'completions'),
      orderBy('completedAt', 'desc'),
      limit(100)
    );
    const unsub = onSnapshot(q, (snap) => {
      setEntries(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [householdId]);

  const getChoreInfo = (choreId) => {
    const chore = chores.find((c) => c.id === choreId);
    return chore || { name: 'Deleted chore', frequency: 'unknown' };
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Group entries by date
  const grouped = {};
  for (const entry of entries) {
    const d = entry.completedAt?.toDate ? entry.completedAt.toDate() : (entry.completedAt ? new Date(entry.completedAt) : new Date());
    const key = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(entry);
  }

  return (
    <div className="history-overlay">
      <div className="history-panel">
        <div className="history-header">
          <h2>History</h2>
          <button className="btn-icon" onClick={onClose}>x</button>
        </div>

        {loading ? (
          <div className="loading-screen" style={{ minHeight: 200 }}>
            <div className="loading-spinner" />
          </div>
        ) : entries.length === 0 ? (
          <div className="empty-state">
            <p>No history yet.</p>
          </div>
        ) : (
          <div className="history-list">
            {Object.entries(grouped).map(([dateLabel, items]) => (
              <div key={dateLabel} className="history-day">
                <div className="history-date-label">{dateLabel}</div>
                {items.map((entry) => {
                  const chore = getChoreInfo(entry.choreId);
                  return (
                    <div key={entry.id} className="history-entry">
                      <div className="history-entry-icon">
                        {'\u2713'}
                      </div>
                      <div className="history-entry-info">
                        <span className="history-chore-name">{chore.name}</span>
                        <span className="history-meta">
                          {entry.userName} &middot; {formatDate(entry.completedAt)}
                        </span>
                      </div>
                      <span className={`freq-badge freq-${chore.frequency || 'daily'}`}>
                        {chore.frequency || 'daily'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

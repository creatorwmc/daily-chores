import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function Family({ householdId, userId, onClose }) {
  const [household, setHousehold] = useState(null);

  useEffect(() => {
    if (!householdId) return;
    const unsub = onSnapshot(doc(db, 'households', householdId), (snap) => {
      if (snap.exists()) {
        setHousehold({ id: snap.id, ...snap.data() });
      }
    });
    return unsub;
  }, [householdId]);

  if (!household) {
    return (
      <div className="history-overlay">
        <div className="history-panel">
          <div className="history-header">
            <h2>Family</h2>
            <button className="btn-icon" onClick={onClose}>x</button>
          </div>
          <div className="loading-screen" style={{ minHeight: 200 }}>
            <div className="loading-spinner" />
          </div>
        </div>
      </div>
    );
  }

  const members = (household.members || []).map((uid) => ({
    uid,
    name: household.memberNames?.[uid] || uid,
    isYou: uid === userId,
  }));

  return (
    <div className="history-overlay">
      <div className="history-panel">
        <div className="history-header">
          <h2>Family</h2>
          <button className="btn-icon" onClick={onClose}>x</button>
        </div>

        <div className="family-content">
          <div className="family-household-name">
            <span className="family-label">Household</span>
            <span className="family-value">{household.name || 'Our Home'}</span>
          </div>

          <div className="family-section">
            <span className="family-label">Members</span>
            <div className="family-member-list">
              {members.map((m) => (
                <div key={m.uid} className="family-member">
                  <div className="family-member-avatar">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="family-member-info">
                    <span className="family-member-name">
                      {m.name}
                      {m.isYou && <span className="family-you-badge">You</span>}
                    </span>
                  </div>
                  <span className="family-member-status">Connected</span>
                </div>
              ))}
            </div>
          </div>

          <div className="family-section">
            <span className="family-label">Join Code</span>
            <div className="family-join-code">{household.joinCode}</div>
            <p className="family-join-hint">Share this code to invite someone to your household.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

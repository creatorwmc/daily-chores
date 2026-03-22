import { useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, arrayUnion, doc } from 'firebase/firestore';

export default function HouseholdSetup({ userId, userName }) {
  const [mode, setMode] = useState(null); // 'create' | 'join'
  const [householdName, setHouseholdName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const createHousehold = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      await addDoc(collection(db, 'households'), {
        name: householdName || 'Our Home',
        members: [userId],
        memberNames: { [userId]: userName },
        joinCode: code,
        createdAt: new Date(),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const joinHousehold = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const q = query(
        collection(db, 'households'),
        where('joinCode', '==', joinCode.toUpperCase().trim())
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        setError('No household found with that code.');
        return;
      }
      const householdDoc = snap.docs[0];
      await updateDoc(doc(db, 'households', householdDoc.id), {
        members: arrayUnion(userId),
        [`memberNames.${userId}`]: userName,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-container">
      <div className="setup-card">
        <h1>Welcome to Daily Chores</h1>
        <p>Get started by creating or joining a household.</p>

        {!mode && (
          <div className="setup-buttons">
            <button onClick={() => setMode('create')}>Create Household</button>
            <button className="btn-secondary" onClick={() => setMode('join')}>
              Join Household
            </button>
          </div>
        )}

        {mode === 'create' && (
          <form onSubmit={createHousehold}>
            <input
              type="text"
              placeholder="Household name (optional)"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setMode(null)}>
                Back
              </button>
              <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        )}

        {mode === 'join' && (
          <form onSubmit={joinHousehold}>
            <input
              type="text"
              placeholder="Enter join code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              required
            />
            {error && <p className="error">{error}</p>}
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setMode(null)}>
                Back
              </button>
              <button type="submit" disabled={loading || !joinCode.trim()}>
                {loading ? 'Joining...' : 'Join'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../config/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import ChoreList from './ChoreList';
import AddChore from './AddChore';
import HouseholdSetup from './HouseholdSetup';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [householdId, setHouseholdId] = useState(null);
  const [chores, setChores] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  // Find user's household
  useEffect(() => {
    const q = query(
      collection(db, 'households'),
      where('members', 'array-contains', user.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      if (snap.docs.length > 0) {
        setHouseholdId(snap.docs[0].id);
      }
      setLoading(false);
    });
    return unsub;
  }, [user.uid]);

  // Listen to chores
  useEffect(() => {
    if (!householdId) return;
    const unsub = onSnapshot(
      collection(db, 'households', householdId, 'chores'),
      (snap) => setChores(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return unsub;
  }, [householdId]);

  // Listen to today's completions
  useEffect(() => {
    if (!householdId) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const q = query(
      collection(db, 'households', householdId, 'completions'),
      where('date', '>=', today)
    );
    const unsub = onSnapshot(q, (snap) =>
      setCompletions(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return unsub;
  }, [householdId]);

  const toggleChore = async (choreId) => {
    const existing = completions.find(
      (c) => c.choreId === choreId && c.userId === user.uid
    );
    if (existing) {
      await deleteDoc(doc(db, 'households', householdId, 'completions', existing.id));
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      await addDoc(collection(db, 'households', householdId, 'completions'), {
        choreId,
        userId: user.uid,
        userName: user.displayName || user.email,
        date: today,
        completedAt: serverTimestamp(),
      });
    }
  };

  const addChore = async (name, assignedTo) => {
    await addDoc(collection(db, 'households', householdId, 'chores'), {
      name,
      assignedTo, // 'both', userId, or 'anyone'
      createdAt: serverTimestamp(),
    });
    setShowAdd(false);
  };

  const deleteChore = async (choreId) => {
    await deleteDoc(doc(db, 'households', householdId, 'chores', choreId));
    // Also delete related completions
    const q = query(
      collection(db, 'households', householdId, 'completions'),
      where('choreId', '==', choreId)
    );
    const snap = await getDocs(q);
    snap.docs.forEach((d) => deleteDoc(d.ref));
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!householdId) {
    return <HouseholdSetup userId={user.uid} userName={user.displayName || user.email} />;
  }

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Daily Chores</h1>
          <p className="date">{todayStr}</p>
        </div>
        <div className="header-actions">
          <span className="user-name">{user.displayName || user.email}</span>
          <button className="btn-icon" onClick={logout} title="Log out">
            ⏻
          </button>
        </div>
      </header>

      <ChoreList
        chores={chores}
        completions={completions}
        userId={user.uid}
        onToggle={toggleChore}
        onDelete={deleteChore}
      />

      {showAdd ? (
        <AddChore
          householdId={householdId}
          onAdd={addChore}
          onCancel={() => setShowAdd(false)}
        />
      ) : (
        <button className="fab" onClick={() => setShowAdd(true)}>
          +
        </button>
      )}
    </div>
  );
}

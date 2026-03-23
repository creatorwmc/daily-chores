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
import Header from './Header';
import ChoreList from './ChoreList';
import CalendarView from './CalendarView';
import AddChore from './AddChore';
import History from './History';
import Badges from './Badges';
import BadgeUnlock from './BadgeUnlock';
import Family from './Family';
import HouseholdSetup from './HouseholdSetup';
import { getBadgeCategory, computeBadgeProgress } from '../data/badges';

export default function Dashboard() {
  const { user } = useAuth();
  const [householdId, setHouseholdId] = useState(null);
  const [householdMembers, setHouseholdMembers] = useState([]); // [{uid, name}]
  const [chores, setChores] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showIrregular, setShowIrregular] = useState(false);
  const [view, setView] = useState('list'); // 'list' | 'calendar'
  const [showHistory, setShowHistory] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showFamily, setShowFamily] = useState(false);
  const [badgeUnlock, setBadgeUnlock] = useState(null);
  const [prevCompletedCount, setPrevCompletedCount] = useState(null);

  // Find user's household
  useEffect(() => {
    const q = query(
      collection(db, 'households'),
      where('members', 'array-contains', user.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      if (snap.docs.length > 0) {
        const hDoc = snap.docs[0];
        setHouseholdId(hDoc.id);
        const data = hDoc.data();
        const members = (data.members || []).map((uid) => ({
          uid,
          name: data.memberNames?.[uid] || uid,
        }));
        setHouseholdMembers(members);
      }
      setLoading(false);
    }, (err) => {
      console.error('Household query failed:', err);
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

  // Listen to completions (fetch full month for calendar support)
  useEffect(() => {
    if (!householdId) return;
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, 'households', householdId, 'completions'),
      where('date', '>=', startOfMonth)
    );
    const unsub = onSnapshot(q, (snap) =>
      setCompletions(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return unsub;
  }, [householdId]);

  // Detect badge unlocks when completions change
  useEffect(() => {
    if (!user || completions.length === 0) return;

    const myCompleted = completions.filter(
      (c) => c.userId === user.uid && (c.status === 'completed' || !c.status)
    );
    const currentCount = myCompleted.length;

    // Skip on first load (prevCompletedCount is null)
    if (prevCompletedCount === null) {
      setPrevCompletedCount(currentCount);
      return;
    }

    // Only check if count increased
    if (currentCount > prevCompletedCount) {
      const isFirstEver = prevCompletedCount === 0 && currentCount >= 1;

      // Check per-chore badges
      for (const chore of chores) {
        const category = chore.badgeCategory || getBadgeCategory(chore.name);
        const count = myCompleted.filter((c) => c.choreId === chore.id).length;
        const prevCount = count - (currentCount - prevCompletedCount); // approximate
        const progress = computeBadgeProgress(count, category, 'individual');
        const prevProgress = computeBadgeProgress(Math.max(0, prevCount), category, 'individual');

        if (progress.currentTier > prevProgress.currentTier) {
          const newBadge = progress.earned[progress.earned.length - 1];
          setBadgeUnlock({ badge: newBadge, category, scope: 'individual', isFirst: isFirstEver });
          setPrevCompletedCount(currentCount);
          return;
        }
      }

      // Check overall badge
      const overallProgress = computeBadgeProgress(currentCount, 'overall', 'individual');
      const prevOverall = computeBadgeProgress(prevCompletedCount, 'overall', 'individual');
      if (overallProgress.currentTier > prevOverall.currentTier) {
        const newBadge = overallProgress.earned[overallProgress.earned.length - 1];
        setBadgeUnlock({ badge: newBadge, category: 'overall', scope: 'individual', isFirst: isFirstEver });
        setPrevCompletedCount(currentCount);
        return;
      }

      // No badge crossed, but if it's the very first completion, still celebrate
      if (isFirstEver) {
        setBadgeUnlock({
          badge: { emoji: '\uD83C\uDF1F', name: 'First Step', description: 'You completed your first chore!', tier: 0, threshold: 1 },
          category: 'overall',
          scope: 'individual',
          isFirst: true,
        });
      }
    }

    setPrevCompletedCount(currentCount);
  }, [completions, chores, user]);

  const toggleChore = async (choreId) => {
    const chore = chores.find((c) => c.id === choreId);
    const freq = chore?.frequency || 'daily';

    const now = new Date();
    const completionDate = new Date();
    if (freq === 'daily') {
      completionDate.setHours(0, 0, 0, 0);
    } else if (freq === 'weekly') {
      completionDate.setDate(now.getDate() - now.getDay());
      completionDate.setHours(0, 0, 0, 0);
    } else {
      // monthly and irregular
      completionDate.setDate(1);
      completionDate.setHours(0, 0, 0, 0);
    }

    const existing = completions.find((c) => {
      if (c.choreId !== choreId || c.userId !== user.uid) return false;
      const compDate = c.date?.toDate ? c.date.toDate() : new Date(c.date);
      if (freq === 'daily') {
        return compDate.toDateString() === completionDate.toDateString();
      }
      if (freq === 'weekly') {
        return compDate >= completionDate;
      }
      // monthly and irregular
      return compDate.getMonth() === completionDate.getMonth() &&
             compDate.getFullYear() === completionDate.getFullYear();
    });

    if (existing) {
      if (existing.status === 'accepted') {
        // Second click: mark as completed
        await updateDoc(doc(db, 'households', householdId, 'completions', existing.id), {
          status: 'completed',
          completedAt: serverTimestamp(),
        });
      } else {
        // Third click: undo/remove
        await deleteDoc(doc(db, 'households', householdId, 'completions', existing.id));
      }
    } else {
      // First click: accept the chore
      await addDoc(collection(db, 'households', householdId, 'completions'), {
        choreId,
        userId: user.uid,
        userName: user.displayName || user.email,
        date: completionDate,
        status: 'accepted',
        acceptedAt: serverTimestamp(),
        completedAt: null,
      });
    }
  };

  const uncompleteChore = async (choreId) => {
    const chore = chores.find((c) => c.id === choreId);
    const freq = chore?.frequency || 'daily';

    const now = new Date();
    const completionDate = new Date();
    if (freq === 'daily') {
      completionDate.setHours(0, 0, 0, 0);
    } else if (freq === 'weekly') {
      completionDate.setDate(now.getDate() - now.getDay());
      completionDate.setHours(0, 0, 0, 0);
    } else {
      completionDate.setDate(1);
      completionDate.setHours(0, 0, 0, 0);
    }

    const existing = completions.find((c) => {
      if (c.choreId !== choreId || c.userId !== user.uid) return false;
      const compDate = c.date?.toDate ? c.date.toDate() : new Date(c.date);
      if (freq === 'daily') return compDate.toDateString() === completionDate.toDateString();
      if (freq === 'weekly') return compDate >= completionDate;
      return compDate.getMonth() === completionDate.getMonth() &&
             compDate.getFullYear() === completionDate.getFullYear();
    });

    if (existing) {
      await deleteDoc(doc(db, 'households', householdId, 'completions', existing.id));
    }
  };

  const addChore = async (name, assignedTo, entries) => {
    const badgeCategory = getBadgeCategory(name);
    const batch = entries.map((entry) => {
      const choreData = {
        name,
        assignedTo,
        frequency: entry.frequency,
        badgeCategory,
        createdAt: serverTimestamp(),
      };
      if (entry.timeOfDay) choreData.timeOfDay = entry.timeOfDay;
      return addDoc(collection(db, 'households', householdId, 'chores'), choreData);
    });
    await Promise.all(batch);
    setShowAdd(false);
  };

  const editChore = async (choreId, changes) => {
    await updateDoc(doc(db, 'households', householdId, 'chores', choreId), changes);
  };

  const assignChore = async (choreId, assignedToUid, requestedByName) => {
    await updateDoc(doc(db, 'households', householdId, 'chores', choreId), {
      assignedTo: assignedToUid,
      assignedByUid: user.uid,
      assignedByName: requestedByName,
    });
  };

  const reorderChores = async (choreIds, byUserName) => {
    const updates = choreIds.map((id, index) =>
      updateDoc(doc(db, 'households', householdId, 'chores', id), {
        sortOrder: index,
        orderedByName: byUserName,
      })
    );
    await Promise.all(updates);
  };

  const deleteChore = async (choreId) => {
    await deleteDoc(doc(db, 'households', householdId, 'chores', choreId));
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

  return (
    <div className="dashboard">
      <Header
        showIrregular={showIrregular}
        onToggleIrregular={() => setShowIrregular(!showIrregular)}
        view={view}
        onToggleView={() => setView(view === 'list' ? 'calendar' : 'list')}
        onOpenHistory={() => setShowHistory(true)}
        onOpenBadges={() => setShowBadges(true)}
        onOpenFamily={() => setShowFamily(true)}
        hasBadges={completions.some((c) => c.userId === user.uid && (c.status === 'completed' || !c.status))}
      />

      {view === 'calendar' ? (
        <CalendarView
          chores={chores}
          completions={completions}
          userId={user.uid}
          userName={user.displayName || user.email}
          members={householdMembers}
          householdId={householdId}
          onToggle={toggleChore}
          onDelete={deleteChore}
        />
      ) : (
        <ChoreList
          chores={chores}
          completions={completions}
          userId={user.uid}
          userName={user.displayName || user.email}
          members={householdMembers}
          onToggle={toggleChore}
          onUncomplete={uncompleteChore}
          onDelete={deleteChore}
          onEditChore={editChore}
          onReorder={reorderChores}
          onAssign={assignChore}
          showIrregular={showIrregular}
        />
      )}

      {badgeUnlock && (
        <BadgeUnlock
          badge={badgeUnlock.badge}
          category={badgeUnlock.category}
          scope={badgeUnlock.scope}
          isFirst={badgeUnlock.isFirst}
          onClose={() => setBadgeUnlock(null)}
        />
      )}

      {showFamily && (
        <Family
          householdId={householdId}
          userId={user.uid}
          onClose={() => setShowFamily(false)}
        />
      )}

      {showBadges && (
        <Badges
          householdId={householdId}
          chores={chores}
          userId={user.uid}
          onClose={() => setShowBadges(false)}
        />
      )}

      {showHistory && (
        <History
          householdId={householdId}
          chores={chores}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showAdd ? (
        <AddChore
          onAdd={addChore}
          onCancel={() => setShowAdd(false)}
          members={householdMembers}
        />
      ) : (
        <button className="fab" onClick={() => setShowAdd(true)}>
          +
        </button>
      )}
    </div>
  );
}

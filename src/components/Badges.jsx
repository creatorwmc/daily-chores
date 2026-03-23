import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { getBadgeCategory, computeBadgeProgress, getBadgeLadder, getThresholds } from '../data/badges';
import { getMilestone } from '../data/milestones';

function BadgePopup({ badge, category, scope, onClose }) {
  const milestone = getMilestone(category, scope, badge.tier);
  return (
    <div className="badge-popup-overlay" onClick={onClose}>
      <div className="badge-popup" onClick={(e) => e.stopPropagation()}>
        <div className="badge-popup-header">
          <span className="badge-popup-emoji">{badge.emoji}</span>
          <button className="btn-icon" onClick={onClose}>x</button>
        </div>
        <h3 className="badge-popup-name">{badge.name}</h3>
        <p className="badge-popup-tier">Tier {badge.tier} &middot; {badge.threshold} completions</p>
        <p className="badge-popup-desc">{badge.description}</p>
        {milestone && (
          <div className="badge-popup-milestone">{milestone}</div>
        )}
      </div>
    </div>
  );
}

export default function Badges({ householdId, chores, userId, onClose }) {
  const [allCompletions, setAllCompletions] = useState([]);
  const [scope, setScope] = useState('individual');
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState(null);

  useEffect(() => {
    if (!householdId) return;
    const unsub = onSnapshot(
      collection(db, 'households', householdId, 'completions'),
      (snap) => {
        setAllCompletions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }
    );
    return unsub;
  }, [householdId]);

  const getCount = (choreId) => {
    if (scope === 'individual') {
      return allCompletions.filter((c) => c.choreId === choreId && c.userId === userId).length;
    }
    return allCompletions.filter((c) => c.choreId === choreId).length;
  };

  const getTotalCount = () => {
    if (scope === 'individual') {
      return allCompletions.filter((c) => c.userId === userId).length;
    }
    return allCompletions.length;
  };

  const choreProgress = chores.map((chore) => {
    const category = chore.badgeCategory || getBadgeCategory(chore.name);
    const count = getCount(chore.id);
    const progress = computeBadgeProgress(count, category, scope);
    return { chore, category, ...progress };
  });

  const overallCount = getTotalCount();
  const overallProgress = computeBadgeProgress(overallCount, 'overall', scope);

  const sortedProgress = [...choreProgress].sort((a, b) => b.currentTier - a.currentTier || b.currentCount - a.currentCount);

  const totalBadgesEarned = choreProgress.reduce((sum, p) => sum + p.currentTier, 0) + overallProgress.currentTier;

  // Get the badge AFTER the next badge (to show just its name)
  const getUpcomingBadgeName = (category, currentTier) => {
    const ladder = getBadgeLadder(category, scope);
    const futureTier = currentTier + 1; // badge after next
    if (futureTier < ladder.length) {
      return ladder[futureTier].name;
    }
    return null;
  };

  const renderBadgeSection = (earned, nextBadge, currentCount, percentToNext, category, currentTier) => (
    <>
      {earned.length > 0 && (
        <div className="badge-earned-list">
          {earned.map((b) => (
            <div key={b.tier} className={`badge-card tier-${b.tier} badge-card-clickable`} onClick={() => setSelectedBadge({ ...b, category })}>
              <span className="badge-emoji">{b.emoji}</span>
              <div className="badge-card-info">
                <span className="badge-card-name">{b.name}</span>
                <span className="badge-card-desc">{b.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {nextBadge && (
        <div className="badge-next">
          <div className="badge-next-header">
            <span className="badge-next-label">Next: {nextBadge.name}</span>
            <span className="badge-next-count">{currentCount}/{nextBadge.threshold}</span>
          </div>
          <div className="badge-progress-bar">
            <div className="badge-progress-fill" style={{ width: `${percentToNext}%` }} />
          </div>
          {(() => {
            const upcoming = getUpcomingBadgeName(category, currentTier + 1);
            return upcoming ? (
              <div className="badge-upcoming">Then: {upcoming}</div>
            ) : null;
          })()}
        </div>
      )}
      {earned.length === 0 && !nextBadge && (
        <div className="badge-none">No completions yet</div>
      )}
    </>
  );

  return (
    <div className="history-overlay">
      <div className="history-panel badges-panel">
        <div className="history-header">
          <h2>Badges Unlocked</h2>
          <button className="btn-icon" onClick={onClose}>x</button>
        </div>

        <div className="badge-scope-toggle">
          <button
            className={`time-filter-btn ${scope === 'individual' ? 'active' : ''}`}
            onClick={() => setScope('individual')}
          >
            My Badges
          </button>
          <button
            className={`time-filter-btn ${scope === 'collective' ? 'active' : ''}`}
            onClick={() => setScope('collective')}
          >
            Our Badges
          </button>
        </div>

        {loading ? (
          <div className="loading-screen" style={{ minHeight: 200 }}>
            <div className="loading-spinner" />
          </div>
        ) : (
          <div className="badges-content">
            <div className="badge-summary">
              <span className="badge-summary-count">{totalBadgesEarned}</span>
              <span className="badge-summary-label">badges earned</span>
            </div>

            {/* Overall progress */}
            <div className="badge-section">
              <div className="badge-section-header">
                <span className="badge-section-title">Overall</span>
                <span className="badge-section-count">{overallCount} total chores</span>
              </div>
              {renderBadgeSection(overallProgress.earned, overallProgress.nextBadge, overallCount, overallProgress.percentToNext, 'overall', overallProgress.currentTier)}
            </div>

            {/* Per-chore progress */}
            {sortedProgress.map(({ chore, category, currentCount, currentTier, earned, nextBadge, percentToNext }) => (
              <div key={chore.id} className="badge-section">
                <div className="badge-section-header">
                  <span className="badge-section-title">
                    {chore.name}
                    {category === 'default' && (
                      <span className="badge-coming-soon">Custom badges coming soon</span>
                    )}
                  </span>
                  <span className="badge-section-count">
                    {currentCount} completions
                    {category === 'default' && currentCount > 0 && ' (tracking)'}
                  </span>
                </div>
                {category === 'default' ? (
                  <div className="badge-coming-soon-box">
                    <span className="badge-coming-soon-emoji">{'\uD83C\uDFC5'}</span>
                    <div className="badge-coming-soon-info">
                      <span className="badge-coming-soon-title">Badges coming soon!</span>
                      <span className="badge-coming-soon-desc">
                        Your completions are being tracked ({currentCount} so far). Custom badges will be awarded retroactively when ready.
                      </span>
                    </div>
                  </div>
                ) : (
                  renderBadgeSection(earned, nextBadge, currentCount, percentToNext, category, currentTier)
                )}
              </div>
            ))}
          </div>
        )}

        {selectedBadge && (
          <BadgePopup
            badge={selectedBadge}
            category={selectedBadge.category}
            scope={scope}
            onClose={() => setSelectedBadge(null)}
          />
        )}
      </div>
    </div>
  );
}

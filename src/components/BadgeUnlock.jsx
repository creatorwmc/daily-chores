import { getMilestone } from '../data/milestones';

export default function BadgeUnlock({ badge, category, scope, isFirst, onClose }) {
  const milestone = getMilestone(category, scope, badge.tier);

  return (
    <div className="badge-unlock-overlay" onClick={onClose}>
      <div className="badge-unlock" onClick={(e) => e.stopPropagation()}>
        {isFirst ? (
          <>
            <div className="badge-unlock-confetti">
              {'\uD83C\uDF89'}
            </div>
            <h2 className="badge-unlock-title">Badges Unlocked!</h2>
            <p className="badge-unlock-subtitle">
              You completed your first chore! You now have access to the badge system in the settings menu.
            </p>
          </>
        ) : (
          <div className="badge-unlock-confetti">
            {'\u2728'}
          </div>
        )}
        <div className="badge-unlock-card">
          <span className="badge-unlock-emoji">{badge.emoji}</span>
          <h3 className="badge-unlock-name">{badge.name}</h3>
          <p className="badge-unlock-tier">Tier {badge.tier}</p>
          <p className="badge-unlock-desc">{badge.description}</p>
        </div>
        {milestone && (
          <div className="badge-unlock-milestone">{milestone}</div>
        )}
        <button className="badge-unlock-btn" onClick={onClose}>
          {isFirst ? 'View Badges in Settings' : 'Nice!'}
        </button>
      </div>
    </div>
  );
}

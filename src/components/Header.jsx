import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Header({ showIrregular, onToggleIrregular, view, onToggleView, onOpenHistory, onOpenBadges, onOpenFamily, hasBadges }) {
  const { user, logout, resetPassword } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const handleResetPassword = async () => {
    try {
      await resetPassword(user.email);
      setMessage('Password reset email sent!');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Failed to send reset email.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="dashboard-header">
      <div>
        <h1>Daily Chores</h1>
        <p className="date">{todayStr}</p>
      </div>
      <div className="header-actions" ref={menuRef}>
        <button
          className={`btn-icon ${view === 'calendar' ? 'active-icon' : ''}`}
          onClick={onToggleView}
          title={view === 'list' ? 'Calendar view' : 'List view'}
        >
          {view === 'list' ? '\uD83D\uDCC5' : '\u2630'}
        </button>
        <button
          className="btn-icon"
          onClick={() => setMenuOpen(!menuOpen)}
          title="Settings"
        >
          {'\u2699'}
        </button>
        {menuOpen && (
          <div className="settings-menu">
            <div className="settings-user">
              {user.displayName || user.email}
            </div>
            <div className="settings-divider" />
            {message && <p className="settings-message">{message}</p>}
            <button className="settings-item settings-toggle" onClick={onToggleIrregular}>
              <span>Show Irregular Chores</span>
              <span className={`toggle-switch ${showIrregular ? 'on' : ''}`}>
                <span className="toggle-knob" />
              </span>
            </button>
            <div className="settings-divider" />
            {hasBadges && (
              <button className="settings-item" onClick={() => { onOpenBadges(); setMenuOpen(false); }}>
                Badges Unlocked
              </button>
            )}
            <button className="settings-item" onClick={() => { onOpenFamily(); setMenuOpen(false); }}>
              Family
            </button>
            <button className="settings-item" onClick={() => { onOpenHistory(); setMenuOpen(false); }}>
              History
            </button>
            <button className="settings-item" onClick={handleResetPassword}>
              Reset Password
            </button>
            <button className="settings-item settings-logout" onClick={logout}>
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

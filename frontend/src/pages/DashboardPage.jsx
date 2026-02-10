import { useAuth } from '../context/AuthContext';
import '../styles/index.css';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <h1 className="dashboard-title">Hotel Management</h1>
          <div className="dashboard-user">
            <span className="dashboard-user-email">{user?.email}</span>
            <button type="button" className="btn btn-outline" onClick={logout}>
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <h2>Welcome{user?.name ? `, ${user.name}` : ''}</h2>
          <p>You're signed in. This is your dashboard. More modules can be added here.</p>
        </div>
      </main>
    </div>
  );
}

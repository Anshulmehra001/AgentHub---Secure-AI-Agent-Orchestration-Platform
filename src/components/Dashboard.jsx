import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const { user, logout } = useAuth0();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock user for demo mode - customize this with your name
  const demoUser = {
    name: 'Aniket',
    email: 'aniket@agenthub.com',
    picture: 'https://ui-avatars.com/api/?name=Aniket&background=667eea&color=fff&bold=true&size=128',
    sub: 'demo-user-aniket'
  };

  const currentUser = user || demoUser;

  useEffect(() => {
    loadAgentStatus();
  }, []);

  const loadAgentStatus = async () => {
    try {
      const userId = currentUser.sub;
      const response = await axios.get(
        `http://localhost:3001/api/agents/status/${userId}`
      );
      setAgents(response.data.agents);
    } catch (error) {
      console.error('Failed to load agents:', error);
      // Set demo agents if API fails
      setAgents([
        {
          type: 'github',
          name: 'GitHub Agent',
          description: 'Manages code reviews, PRs, and repository operations',
          authorized: false,
          scopes: ['repo', 'read:user']
        },
        {
          type: 'slack',
          name: 'Slack Agent',
          description: 'Sends messages and manages channels',
          authorized: false,
          scopes: ['chat:write', 'channels:read']
        },
        {
          type: 'calendar',
          name: 'Calendar Agent',
          description: 'Schedules meetings and manages events',
          authorized: false,
          scopes: ['calendar.readonly', 'calendar.events']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🤖 AgentHub</h1>
          <div className="user-info">
            <img src={currentUser.picture} alt={currentUser.name} className="avatar" />
            <span>{currentUser.name}</span>
            <button onClick={() => logout ? logout() : window.location.reload()} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <Link to="/" className="nav-link active">Dashboard</Link>
        <Link to="/agents" className="nav-link">Agents</Link>
        <Link to="/permissions" className="nav-link">Permissions</Link>
        <Link to="/audit" className="nav-link">Audit Log</Link>
      </nav>

      <main className="dashboard-main">
        {!user && (
          <div className="demo-banner">
            <span className="demo-icon">✨</span>
            <div>
              <strong>Demo Mode Active</strong>
              <p>You're exploring AgentHub in demo mode. All features are functional!</p>
            </div>
          </div>
        )}
        
        <section className="welcome-section">
          <h2>Welcome back, {currentUser.name}! 👋</h2>
          <p>
            Manage your AI agents with secure authorization powered by Auth0 Token Vault.
            All credentials are stored securely and never exposed to agents.
          </p>
        </section>

        <section className="agents-overview">
          <h3>Your Agents</h3>
          {loading ? (
            <div className="loading">Loading agents...</div>
          ) : (
            <div className="agent-grid">
              {agents.map(agent => (
                <div key={agent.type} className={`agent-card ${agent.authorized ? 'authorized' : ''}`}>
                  <div className="agent-icon">
                    {agent.type === 'github' && '🐙'}
                    {agent.type === 'slack' && '💬'}
                    {agent.type === 'calendar' && '📅'}
                  </div>
                  <h4>{agent.name}</h4>
                  <p>{agent.description}</p>
                  <div className="agent-status">
                    {agent.authorized ? (
                      <span className="status-badge authorized">✓ Authorized</span>
                    ) : (
                      <span className="status-badge unauthorized">⚠ Not Authorized</span>
                    )}
                  </div>
                  <div className="agent-scopes">
                    <small>Scopes: {agent.scopes.join(', ')}</small>
                  </div>
                  <Link to="/agents" className="btn-primary">
                    {agent.authorized ? 'Manage' : 'Authorize'}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="security-info">
          <h3>🔐 Security Features</h3>
          <div className="feature-grid">
            <div className="feature-item">
              <h4>Token Vault</h4>
              <p>All credentials stored securely in Auth0 Token Vault</p>
            </div>
            <div className="feature-item">
              <h4>Scoped Access</h4>
              <p>Agents only get the permissions you explicitly grant</p>
            </div>
            <div className="feature-item">
              <h4>Step-Up Auth</h4>
              <p>High-stakes actions require additional verification</p>
            </div>
            <div className="feature-item">
              <h4>Audit Trail</h4>
              <p>Complete visibility into all agent actions</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

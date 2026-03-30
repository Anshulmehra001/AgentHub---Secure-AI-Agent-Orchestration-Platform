import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function PermissionsManager() {
  const { user } = useAuth0();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock user for demo mode
  const demoUser = {
    name: 'Aniket',
    email: 'aniket@agenthub.com',
    picture: 'https://ui-avatars.com/api/?name=Aniket&background=667eea&color=fff&bold=true&size=128',
    sub: 'demo-user-aniket'
  };

  const currentUser = user || demoUser;

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/token-vault/list/${currentUser.sub}`
      );
      setTokens(response.data.tokens || []);
    } catch (error) {
      console.error('Failed to load tokens:', error);
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  const revokeAccess = async (service) => {
    if (!confirm(`Revoke agent access to ${service}?`)) return;

    try {
      await axios.delete(
        `http://localhost:3001/api/token-vault/revoke/${currentUser.sub}/${service}`
      );
      await loadTokens();
    } catch (error) {
      console.error('Failed to revoke access:', error);
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
            <button onClick={() => window.location.href = '/'} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <Link to="/" className="nav-link">Dashboard</Link>
        <Link to="/agents" className="nav-link">Agents</Link>
        <Link to="/permissions" className="nav-link active">Permissions</Link>
        <Link to="/audit" className="nav-link">Audit Log</Link>
      </nav>

      <main className="dashboard-main">
        <section className="permissions-section">
          <h2>Manage Agent Permissions</h2>
          <p>Control which services your agents can access. Revoke access anytime.</p>

          {loading ? (
            <div className="loading">Loading permissions...</div>
          ) : tokens.length === 0 ? (
            <div className="empty-state">
              <p>No active permissions. Authorize agents from the Agents page.</p>
              <Link to="/agents" className="btn-primary">Go to Agents</Link>
            </div>
          ) : (
            <div className="permissions-list">
              {tokens.map((token, index) => (
                <div key={index} className="permission-card">
                  <div className="permission-header">
                    <div className="permission-icon">
                      {token.service === 'github' && '🐙'}
                      {token.service === 'slack' && '💬'}
                      {token.service === 'calendar' && '📅'}
                    </div>
                    <div className="permission-info">
                      <h3>{token.service.charAt(0).toUpperCase() + token.service.slice(1)}</h3>
                      <p className="permission-status">
                        <span className="status-dot active"></span>
                        Active
                      </p>
                    </div>
                  </div>

                  <div className="permission-details">
                    <div className="detail-row">
                      <span className="label">Scopes:</span>
                      <span className="value">{token.scopes?.join(', ') || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Granted:</span>
                      <span className="value">
                        {token.created_at ? new Date(token.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Expires:</span>
                      <span className="value">
                        {token.expires_at ? new Date(token.expires_at).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => revokeAccess(token.service)}
                    className="btn-danger"
                  >
                    Revoke Access
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="security-tips">
          <h3>🔐 Security Best Practices</h3>
          <ul>
            <li>Review agent permissions regularly</li>
            <li>Revoke access for unused agents</li>
            <li>Monitor the audit log for suspicious activity</li>
            <li>Use step-up authentication for sensitive operations</li>
            <li>Keep your Auth0 credentials secure</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default PermissionsManager;

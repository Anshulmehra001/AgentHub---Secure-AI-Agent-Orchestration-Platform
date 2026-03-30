import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

function AuditLog() {
  const { user } = useAuth0();
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: new Date().toISOString(),
      agent: 'GitHub Agent',
      action: 'Review pull request #42',
      status: 'success',
      details: 'Analyzed code changes and provided feedback'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      agent: 'Slack Agent',
      action: 'Send message to #general',
      status: 'success',
      details: 'Deployment notification sent'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      agent: 'Calendar Agent',
      action: 'Find meeting slots',
      status: 'success',
      details: 'Found 3 available slots for tomorrow'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.status === filter);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🤖 AgentHub</h1>
        </div>
      </header>

      <nav className="dashboard-nav">
        <Link to="/" className="nav-link">Dashboard</Link>
        <Link to="/agents" className="nav-link">Agents</Link>
        <Link to="/permissions" className="nav-link">Permissions</Link>
        <Link to="/audit" className="nav-link active">Audit Log</Link>
      </nav>

      <main className="dashboard-main">
        <section className="audit-section">
          <div className="audit-header">
            <h2>Audit Log</h2>
            <div className="filter-controls">
              <button 
                className={filter === 'all' ? 'active' : ''}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={filter === 'success' ? 'active' : ''}
                onClick={() => setFilter('success')}
              >
                Success
              </button>
              <button 
                className={filter === 'error' ? 'active' : ''}
                onClick={() => setFilter('error')}
              >
                Errors
              </button>
            </div>
          </div>

          <div className="audit-log">
            {filteredLogs.length === 0 ? (
              <div className="empty-state">
                <p>No audit logs found.</p>
              </div>
            ) : (
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Agent</th>
                    <th>Action</th>
                    <th>Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => (
                    <tr key={log.id}>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                      <td>{log.agent}</td>
                      <td>{log.action}</td>
                      <td>
                        <span className={`status-badge ${log.status}`}>
                          {log.status === 'success' ? '✓' : '✗'} {log.status}
                        </span>
                      </td>
                      <td>{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="audit-info">
          <h3>📊 Audit Log Information</h3>
          <p>
            All agent actions are logged for security and compliance. Logs include:
          </p>
          <ul>
            <li>Timestamp of each action</li>
            <li>Agent that performed the action</li>
            <li>Action description and parameters</li>
            <li>Success or failure status</li>
            <li>Detailed results and error messages</li>
          </ul>
          <p>
            Logs are retained for 90 days and can be exported for compliance purposes.
          </p>
        </section>
      </main>
    </div>
  );
}

export default AuditLog;

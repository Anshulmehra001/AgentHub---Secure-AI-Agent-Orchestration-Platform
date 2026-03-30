import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AgentPanel() {
  const { user } = useAuth0();
  const [selectedAgent, setSelectedAgent] = useState('github');
  const [task, setTask] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [requiresStepUp, setRequiresStepUp] = useState(false);

  // Mock user for demo mode
  const demoUser = {
    name: 'Aniket',
    email: 'aniket@agenthub.com',
    picture: 'https://ui-avatars.com/api/?name=Aniket&background=667eea&color=fff&bold=true&size=128',
    sub: 'demo-user-aniket'
  };

  const currentUser = user || demoUser;

  const executeTask = async () => {
    setLoading(true);
    setResult(null);
    setRequiresAuth(false);
    setRequiresStepUp(false);

    try {
      const response = await axios.post('http://localhost:3001/api/agents/execute', {
        agentType: selectedAgent,
        task,
        userId: currentUser.sub,
        requiresStepUp: false
      });

      setResult(response.data);
    } catch (error) {
      if (error.response?.data?.requiresAuth) {
        setRequiresAuth(true);
        setResult({ error: 'Authorization required', ...error.response.data });
      } else if (error.response?.data?.requiresStepUp) {
        setRequiresStepUp(true);
        setResult({ error: 'Step-up authentication required', ...error.response.data });
      } else {
        setResult({ error: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const authorizeAgent = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/agents/request-auth', {
        userId: currentUser.sub,
        service: selectedAgent,
        scopes: result.scopes,
        callbackUrl: window.location.origin + '/callback'
      });

      window.open(response.data.authUrl, '_blank');
    } catch (error) {
      console.error('Authorization failed:', error);
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
        <Link to="/agents" className="nav-link active">Agents</Link>
        <Link to="/permissions" className="nav-link">Permissions</Link>
        <Link to="/audit" className="nav-link">Audit Log</Link>
      </nav>

      <main className="dashboard-main">
        <section className="agent-panel">
          <h2>Execute Agent Task</h2>
          
          <div className="agent-selector">
            <label>Select Agent:</label>
            <select 
              value={selectedAgent} 
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="select-input"
            >
              <option value="github">🐙 GitHub Agent</option>
              <option value="slack">💬 Slack Agent</option>
              <option value="calendar">📅 Calendar Agent</option>
            </select>
          </div>

          <div className="task-input">
            <label>Task Description:</label>
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Describe what you want the agent to do..."
              rows={4}
              className="textarea-input"
            />
          </div>

          <button 
            onClick={executeTask}
            disabled={!task || loading}
            className="btn-primary"
          >
            {loading ? 'Executing...' : 'Execute Task'}
          </button>

          {result && (
            <div className={`result-panel ${result.error ? 'error' : 'success'}`}>
              <h3>Result:</h3>
              
              {requiresAuth && (
                <div className="auth-required">
                  <p>⚠️ This agent needs authorization to access {result.service}</p>
                  <p>Required scopes: {result.scopes?.join(', ')}</p>
                  <button onClick={authorizeAgent} className="btn-primary">
                    Authorize Now
                  </button>
                </div>
              )}

              {requiresStepUp && (
                <div className="stepup-required">
                  <p>🔐 This action requires step-up authentication</p>
                  <p>Action: {result.action}</p>
                  <button className="btn-primary">
                    Verify Identity
                  </button>
                </div>
              )}

              {result.success && (
                <div className="success-result">
                  <p><strong>Agent:</strong> {result.agent}</p>
                  <p><strong>Result:</strong></p>
                  <pre>{result.result}</pre>
                  <p><small>Executed at: {new Date(result.timestamp).toLocaleString()}</small></p>
                </div>
              )}

              {result.error && !requiresAuth && !requiresStepUp && (
                <div className="error-result">
                  <p>{result.error}</p>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="agent-examples">
          <h3>Example Tasks</h3>
          <div className="example-grid">
            <div className="example-card" onClick={() => setTask('Review the latest pull request in my repository')}>
              <h4>GitHub: Review PR</h4>
              <p>Review the latest pull request in my repository</p>
            </div>
            <div className="example-card" onClick={() => setTask('Send a message to #general channel about deployment')}>
              <h4>Slack: Send Message</h4>
              <p>Send a message to #general channel about deployment</p>
            </div>
            <div className="example-card" onClick={() => setTask('Find available meeting slots for tomorrow')}>
              <h4>Calendar: Find Slots</h4>
              <p>Find available meeting slots for tomorrow</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AgentPanel;

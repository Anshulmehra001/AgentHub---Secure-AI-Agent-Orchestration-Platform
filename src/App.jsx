import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './components/Dashboard';
import AgentPanel from './components/AgentPanel';
import PermissionsManager from './components/PermissionsManager';
import AuditLog from './components/AuditLog';
import LoginButton from './components/LoginButton';
import './App.css';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const [demoMode, setDemoMode] = useState(false);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading AgentHub...</p>
      </div>
    );
  }

  if (!isAuthenticated && !demoMode) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="logo-section">
            <div className="logo-icon">🤖</div>
            <h1>AgentHub</h1>
          </div>
          <p className="tagline">Secure AI Agent Orchestration Platform</p>
          <p className="subtitle">
            Powered by Auth0 Token Vault
          </p>
          
          <div className="demo-section">
            <div className="demo-badge">✨ Try Demo Mode</div>
            <p className="demo-description">
              Explore the full platform without any setup
            </p>
            <button 
              onClick={() => setDemoMode(true)}
              className="btn-primary btn-large"
              style={{ width: '100%', marginBottom: '15px' }}
            >
              Continue in Demo Mode
            </button>
            <div className="divider">
              <span>or</span>
            </div>
            <LoginButton />
            <p className="auth-note">
              Login with Auth0 for production features
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agents" element={<AgentPanel />} />
          <Route path="/permissions" element={<PermissionsManager />} />
          <Route path="/audit" element={<AuditLog />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

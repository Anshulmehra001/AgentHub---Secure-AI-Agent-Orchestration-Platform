import { useAuth0 } from '@auth0/auth0-react';

function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    // Check if Auth0 is properly configured
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    
    if (!domain || domain === 'demo-tenant.auth0.com') {
      alert('⚠️ Auth0 is not configured yet!\n\nTo enable real login:\n1. Create a free Auth0 account at auth0.com\n2. Update .env.local with your credentials\n3. Restart the server\n\nFor now, use "Continue in Demo Mode" button above.');
      return;
    }
    
    loginWithRedirect();
  };

  return (
    <button 
      onClick={handleLogin}
      className="btn-secondary btn-large"
      style={{ width: '100%' }}
    >
      Login with Auth0
    </button>
  );
}

export default LoginButton;

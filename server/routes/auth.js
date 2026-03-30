import express from 'express';
import { ManagementClient } from 'auth0';

const router = express.Router();

const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'read:users update:users'
});

// Verify user token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify token with Auth0
    const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!response.ok) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    const user = await response.json();
    res.json({ user });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

export default router;

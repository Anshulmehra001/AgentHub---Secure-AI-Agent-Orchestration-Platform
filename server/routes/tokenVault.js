import express from 'express';
import axios from 'axios';

const router = express.Router();

// Token Vault client for managing agent credentials
class TokenVaultClient {
  constructor() {
    this.baseUrl = process.env.TOKEN_VAULT_URL;
    this.clientId = process.env.TOKEN_VAULT_CLIENT_ID;
    this.clientSecret = process.env.TOKEN_VAULT_CLIENT_SECRET;
    this.accessToken = null;
  }

  async getAccessToken() {
    if (this.accessToken) return this.accessToken;
    
    const response = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
        grant_type: 'client_credentials'
      }
    );
    
    this.accessToken = response.data.access_token;
    return this.accessToken;
  }

  async storeToken(userId, service, token, scopes) {
    const accessToken = await this.getAccessToken();
    
    const response = await axios.post(
      `${this.baseUrl}/tokens`,
      {
        user_id: userId,
        service,
        token,
        scopes,
        expires_at: new Date(Date.now() + 3600000).toISOString()
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    return response.data;
  }

  async getToken(userId, service) {
    const accessToken = await this.getAccessToken();
    
    const response = await axios.get(
      `${this.baseUrl}/tokens/${userId}/${service}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    return response.data;
  }

  async revokeToken(userId, service) {
    const accessToken = await this.getAccessToken();
    
    await axios.delete(
      `${this.baseUrl}/tokens/${userId}/${service}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
  }

  async listTokens(userId) {
    const accessToken = await this.getAccessToken();
    
    const response = await axios.get(
      `${this.baseUrl}/tokens/${userId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    return response.data;
  }
}

const vaultClient = new TokenVaultClient();

// Store a service token for an agent
router.post('/store', async (req, res) => {
  try {
    const { userId, service, token, scopes } = req.body;
    
    const result = await vaultClient.storeToken(userId, service, token, scopes);
    
    res.json({
      success: true,
      message: `Token stored for ${service}`,
      tokenId: result.id
    });
  } catch (error) {
    console.error('Token storage error:', error);
    res.status(500).json({ error: 'Failed to store token' });
  }
});

// Retrieve a token for agent use
router.get('/retrieve/:userId/:service', async (req, res) => {
  try {
    const { userId, service } = req.params;
    
    const token = await vaultClient.getToken(userId, service);
    
    res.json({ token });
  } catch (error) {
    console.error('Token retrieval error:', error);
    res.status(404).json({ error: 'Token not found' });
  }
});

// Revoke agent access to a service
router.delete('/revoke/:userId/:service', async (req, res) => {
  try {
    const { userId, service } = req.params;
    
    await vaultClient.revokeToken(userId, service);
    
    res.json({
      success: true,
      message: `Access revoked for ${service}`
    });
  } catch (error) {
    console.error('Token revocation error:', error);
    res.status(500).json({ error: 'Failed to revoke token' });
  }
});

// List all tokens for a user
router.get('/list/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const tokens = await vaultClient.listTokens(userId);
    
    res.json({ tokens });
  } catch (error) {
    console.error('Token listing error:', error);
    res.status(500).json({ error: 'Failed to list tokens' });
  }
});

export default router;

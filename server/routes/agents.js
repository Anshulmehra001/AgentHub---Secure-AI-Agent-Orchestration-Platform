import express from 'express';
import OpenAI from 'openai';
import axios from 'axios';

const router = express.Router();

// Initialize AI client (supports OpenAI, Groq, or other OpenAI-compatible APIs)
let aiClient = null;
const apiKey = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;
const baseURL = process.env.GROQ_API_KEY 
  ? 'https://api.groq.com/openai/v1' 
  : undefined;

if (apiKey && apiKey !== 'sk-demo-key') {
  aiClient = new OpenAI({
    apiKey: apiKey,
    baseURL: baseURL
  });
}

// Agent definitions
const AGENTS = {
  github: {
    name: 'GitHub Agent',
    description: 'Manages code reviews, PRs, and repository operations',
    requiredScopes: ['repo', 'read:user'],
    stepUpActions: ['delete', 'merge']
  },
  slack: {
    name: 'Slack Agent',
    description: 'Sends messages and manages channels',
    requiredScopes: ['chat:write', 'channels:read'],
    stepUpActions: ['channels:manage']
  },
  calendar: {
    name: 'Calendar Agent',
    description: 'Schedules meetings and manages events',
    requiredScopes: ['calendar.readonly', 'calendar.events'],
    stepUpActions: ['calendar.events.delete']
  }
};

// Execute agent task with Token Vault integration
router.post('/execute', async (req, res) => {
  try {
    const { agentType, task, userId, requiresStepUp } = req.body;
    
    const agent = AGENTS[agentType];
    if (!agent) {
      return res.status(400).json({ error: 'Invalid agent type' });
    }

    // Check if step-up authentication is required
    if (requiresStepUp && agent.stepUpActions.some(action => task.includes(action))) {
      return res.status(403).json({
        error: 'Step-up authentication required',
        requiresStepUp: true,
        action: task
      });
    }

    // Get token from Token Vault
    const tokenResponse = await axios.get(
      `http://localhost:${process.env.PORT}/api/token-vault/retrieve/${userId}/${agentType}`
    );
    
    if (!tokenResponse.data.token) {
      return res.status(401).json({
        error: 'No authorization found',
        requiresAuth: true,
        service: agentType,
        scopes: agent.requiredScopes
      });
    }

    // Execute agent task with AI
    let result;
    
    if (aiClient) {
      // Use real AI (OpenAI, Groq, or compatible API)
      const model = process.env.GROQ_API_KEY 
        ? 'llama-3.3-70b-versatile'  // Groq's fast free model
        : 'gpt-4';  // OpenAI model
        
      const completion = await aiClient.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'system',
            content: `You are a ${agent.name}. ${agent.description}. You have access to ${agentType} API with the following scopes: ${agent.requiredScopes.join(', ')}. Execute tasks securely and provide detailed responses.`
          },
          {
            role: 'user',
            content: task
          }
        ]
      });
      result = completion.choices[0].message.content;
    } else {
      // Demo mode without AI API
      result = `[DEMO MODE] Task received: "${task}"\n\nThis is a simulated response. In production, the ${agent.name} would:\n1. Authenticate using Token Vault\n2. Execute the requested action: ${task}\n3. Return real results from ${agentType} API\n\n✨ To enable real AI responses:\n• Groq (FREE): Get API key from https://console.groq.com\n• OpenAI: Get API key from https://platform.openai.com\n• Add to .env: GROQ_API_KEY=your-key or OPENAI_API_KEY=your-key`;
    }

    // Log action for audit trail
    await logAgentAction(userId, agentType, task, result);

    res.json({
      success: true,
      agent: agent.name,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agent execution error:', error);
    res.status(500).json({ error: 'Agent execution failed' });
  }
});

// Request async authorization
router.post('/request-auth', async (req, res) => {
  try {
    const { userId, service, scopes, callbackUrl } = req.body;
    
    // Generate authorization request
    const authRequest = {
      id: `auth_${Date.now()}`,
      userId,
      service,
      scopes,
      status: 'pending',
      callbackUrl,
      expiresAt: new Date(Date.now() + 3600000).toISOString()
    };

    // In production, this would trigger an async flow
    // For demo, we return the auth URL
    const authUrl = `https://${process.env.AUTH0_DOMAIN}/authorize?` +
      `client_id=${process.env.AUTH0_CLIENT_ID}&` +
      `response_type=code&` +
      `scope=${scopes.join(' ')}&` +
      `redirect_uri=${callbackUrl}&` +
      `state=${authRequest.id}`;

    res.json({
      authRequest,
      authUrl,
      message: 'Authorization request created. User will be notified.'
    });

  } catch (error) {
    console.error('Auth request error:', error);
    res.status(500).json({ error: 'Failed to create auth request' });
  }
});

// Get agent status and permissions
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all tokens from vault
    const tokensResponse = await axios.get(
      `http://localhost:${process.env.PORT}/api/token-vault/list/${userId}`
    );

    const agentStatus = Object.entries(AGENTS).map(([type, agent]) => {
      const hasToken = tokensResponse.data.tokens?.some(t => t.service === type);
      return {
        type,
        name: agent.name,
        description: agent.description,
        authorized: hasToken,
        scopes: agent.requiredScopes
      };
    });

    res.json({ agents: agentStatus });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to get agent status' });
  }
});

// Audit log helper
async function logAgentAction(userId, agentType, task, result) {
  // In production, store in database
  console.log('AUDIT LOG:', {
    timestamp: new Date().toISOString(),
    userId,
    agent: agentType,
    task,
    result: result.substring(0, 100)
  });
}

export default router;

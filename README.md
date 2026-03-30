# AgentHub - Secure AI Agent Orchestration Platform

> Built for the Auth0 "Authorized to Act" Hackathon - A production-ready platform demonstrating secure multi-agent systems using Token Vault

## 🚀 What is This Project?

AgentHub is a platform where AI agents can securely access your services (GitHub, Slack, Calendar) without ever seeing your passwords. Think of it like giving your assistant keys to your office - but you can take the keys back anytime and see what they did.

**Simple Example:**
- You tell GitHub Agent: "Review my latest pull request"
- Agent asks Auth0 Token Vault: "Can I access GitHub?"
- Token Vault gives agent a temporary key (not your password!)
- Agent reviews the PR and reports back
- You can revoke access anytime

## 🎯 Key Features

- **Secure Token Management**: Auth0 Token Vault stores all credentials safely
- **Multi-Agent System**: GitHub, Slack, and Calendar agents work together
- **Full Control**: You decide what each agent can access
- **Step-Up Authentication**: Sensitive actions need extra verification
- **Audit Trail**: See everything agents do
- **Demo Mode**: Works without any API keys for testing

## 🛠️ Tech Stack

- **Frontend**: React + Vite (UI)
- **Backend**: Node.js + Express (API server)
- **Auth**: Auth0 for AI Agents + Token Vault (Security)
- **AI**: Optional - Groq (FREE) or OpenAI
- **Integrations**: GitHub, Slack, Google Calendar

## ⚡ Quick Start - 3 Steps

### Step 1: Install
```bash
npm install
```

### Step 2: Run in Demo Mode (No Setup Needed!)
```bash
npm run dev
```

### Step 3: Open Browser
```
http://localhost:5173
```

Click "Continue in Demo Mode" to explore the full UI without any configuration!

## 🎮 Demo Mode vs Full Mode

### Demo Mode (Current - No Setup Required)
✅ Full UI works  
✅ See all features  
✅ Perfect for hackathon demo  
✅ No API keys needed  
✅ Simulated agent responses  

### Full Mode (Optional - Requires Setup)
✅ Everything above PLUS  
✅ Real Auth0 login  
✅ Real AI responses  
✅ Actual service integrations

## 🔧 Optional: Add Real Features

### Option 1: Add Free AI (Groq - Recommended)

**What it does:** Makes agents give smart, real responses instead of simulated ones.

**How to add:**
1. Go to https://console.groq.com (free signup, no credit card)
2. Create an API key
3. Add to `.env` file:
   ```env
   GROQ_API_KEY=gsk_your_key_here
   ```
4. Restart: `npm run dev`

**Cost:** FREE (14,400 requests/day)

### Option 2: Add Auth0 (For Real Login)

**What it does:** Real user authentication and Token Vault integration.

**How to add:**

1. **Create Auth0 Account**
   - Go to https://auth0.com (free tier available)
   - Sign up and create a tenant

2. **Create Application**
   - Dashboard → Applications → Create Application
   - Name: "AgentHub"
   - Type: Single Page Application
   - Click Create

3. **Configure Settings**
   - Allowed Callback URLs: `http://localhost:5173`
   - Allowed Logout URLs: `http://localhost:5173`
   - Allowed Web Origins: `http://localhost:5173`
   - Save Changes

4. **Enable Token Vault**
   - Go to Extensions
   - Install "Auth0 for AI Agents"
   - Enable Token Vault feature

5. **Update .env File**
   ```env
   AUTH0_DOMAIN=your-tenant.auth0.com
   AUTH0_CLIENT_ID=your_client_id
   AUTH0_CLIENT_SECRET=your_client_secret
   AUTH0_AUDIENCE=https://agenthub.api
   
   TOKEN_VAULT_URL=https://your-tenant.auth0.com/api/v2/token-vault
   TOKEN_VAULT_CLIENT_ID=your_vault_client_id
   TOKEN_VAULT_CLIENT_SECRET=your_vault_client_secret
   ```

6. **Update .env.local File**
   ```env
   VITE_AUTH0_DOMAIN=your-tenant.auth0.com
   VITE_AUTH0_CLIENT_ID=your_client_id
   VITE_AUTH0_AUDIENCE=https://agenthub.api
   ```

7. **Restart**
   ```bash
   npm run dev
   ```

### Option 3: Add Service Integrations

**GitHub Integration:**
1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Create new OAuth App
3. Add credentials to Auth0 Connections → Social → GitHub

**Slack Integration:**
1. Go to https://api.slack.com/apps
2. Create new app
3. Add OAuth scopes: `chat:write`, `channels:read`
4. Add to Auth0 as custom social connection

**Google Calendar:**
1. Go to Google Cloud Console
2. Enable Calendar API
3. Create OAuth credentials
4. Add to Auth0 Connections → Social → Google

## 📖 How to Use

### In Demo Mode:
1. Open http://localhost:5173
2. Click "Continue in Demo Mode"
3. Explore Dashboard, Agents, Permissions, Audit Log
4. Try executing agent tasks (simulated responses)

### With Full Setup:
1. Login with Auth0
2. Authorize agents (GitHub, Slack, Calendar)
3. Execute real tasks:
   - "Review my latest pull request"
   - "Send message to #general about deployment"
   - "Find meeting slots for tomorrow"
4. Monitor audit logs
5. Manage permissions

## � Architecture

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
┌──────▼──────────────────────────────────────┐
│           AgentHub UI (React)               │
└──────┬──────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────┐
│      Auth0 Token Vault (Credential Mgmt)    │
└──────┬──────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────┐
│      AI Agent Orchestrator (Node.js)        │
└──┬───────────┬───────────┬──────────────────┘
   │           │           │
┌──▼────┐  ┌───▼───┐  ┌────▼───┐
│GitHub │  │ Slack │  │Calendar│
│ Agent │  │ Agent │  │ Agent  │
└───────┘  └───────┘  └────────┘
```

## 🔐 Security Features

- **Zero Credential Exposure**: Tokens never appear in agent code or logs
- **Automatic Token Refresh**: Token Vault handles rotation
- **Instant Revocation**: Users can revoke access immediately
- **Scope Validation**: Enforces permission boundaries
- **Audit Logging**: Complete trail of all agent actions
- **Step-Up Auth**: Additional verification for sensitive operations

## 🏆 Hackathon Submission

### Security Model
- All credentials stored in Auth0 Token Vault (never in application code)
- Scoped access tokens per service and agent
- Step-up auth for sensitive operations
- Token rotation and automatic expiry handling

### User Control
- Visual permission dashboard showing all agent access
- Granular consent per service and scope
- One-click revocation of agent permissions
- Clear audit logs of all agent actions

### Technical Excellence
- Production-ready architecture with error handling
- Async auth flows for seamless UX
- Token refresh automation
- Comprehensive API integration patterns

### Design
- Clean, intuitive UI for managing agent permissions
- Real-time feedback on agent actions
- Responsive design for all devices
- Accessibility-compliant components

### Potential Impact
- Reusable patterns for multi-agent systems
- Demonstrates secure agent authorization at scale
- Production-ready reference implementation
- Educational value for AI agent developers

## 🎥 Demo Video

[Link to 3-minute demo video will be added]

## 📄 License

MIT


## 📊 Architecture

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
┌──────▼──────────────────────────────────────┐
│           AgentHub UI (React)                │
│  - Dashboard  - Agents  - Permissions        │
└──────┬──────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────┐
│      Auth0 Token Vault (Credential Mgmt)     │
│  - Stores all passwords securely             │
│  - Gives agents temporary keys               │
│  - User can revoke anytime                   │
└──────┬──────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────┐
│      AI Agent Orchestrator (Node.js)         │
│  - Coordinates multiple agents               │
│  - Executes tasks securely                   │
└──┬───────────┬───────────┬──────────────────┘
   │           │           │
┌──▼────┐  ┌──▼────┐  ┌──▼────┐
│GitHub │  │ Slack │  │Calendar│
│ Agent │  │ Agent │  │ Agent  │
└───────┘  └───────┘  └────────┘
```

## 🔐 Security Features

- **Zero Credential Exposure**: Agents never see your actual passwords
- **Automatic Token Refresh**: Token Vault handles token rotation
- **Instant Revocation**: Revoke agent access with one click
- **Scope Validation**: Agents only get permissions you explicitly grant
- **Audit Logging**: Complete trail of all agent actions
- **Step-Up Auth**: Sensitive operations require additional verification

## ❓ FAQ

**Q: Do I need to pay for anything?**  
A: No! Everything can run free:
- Auth0: Free tier available
- Groq AI: Completely free (14,400 requests/day)
- Demo mode: Works without any APIs

**Q: Is this production-ready?**  
A: Yes! The code includes error handling, security best practices, token refresh logic, audit logging, and CORS configuration.

**Q: What's Auth0 Token Vault?**  
A: It's like a secure password locker for AI agents. Agents get temporary keys instead of your real passwords.

**Q: Can I use this for my own project?**  
A: Yes! MIT licensed. Fork it and customize for your needs.

**Q: Do I need all three agents?**  
A: No! You can use just one or add your own agents.

## 🏆 Hackathon Submission Checklist

- ✅ Uses Auth0 Token Vault (required)
- ✅ Secure credential management
- ✅ User control over permissions
- ✅ Production-ready code
- ✅ Clean UI/UX
- ✅ Audit logging
- ✅ Step-up authentication
- ✅ Complete documentation

## 🎥 Demo Video

[Link to 3-minute demo video will be added]

## 📝 What Makes This Special

1. **Security First**: Never exposes credentials to agents
2. **User Control**: Users see and control all permissions
3. **Production Ready**: Real error handling and best practices
4. **Extensible**: Easy to add more agents and services
5. **Educational**: Shows proper Token Vault integration patterns

## 📄 License

MIT - Feel free to use for your own projects!

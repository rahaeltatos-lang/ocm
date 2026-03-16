# OpenClawMatrix Agent Teams Platform (OCM)

> **Deploy AI agent teams in minutes, not months**

OpenClawMatrix Agent Teams (OCM) is a SaaS platform for purchasing and deploying pre-configured AI agent teams. Choose from Social Media Manager, Lead Generation Bot, or Customer Support Agent — each designed for enterprise-grade automation.

## 🚀 Features

- **Pre-built AI Teams** - Social Media Manager, Lead Generation Bot, Customer Support Agent
- **Simple Pricing** - $99/mo, $149/mo, $199/mo (no setup fees)
- **Instant Deployment** - Start using agents within minutes of signup
- **Real-time Dashboard** - Monitor agent activity, logs, and usage stats
- **API Integration** - Simple API keys for custom integrations
- **Admin Panel** - Manage customers, teams, and revenue tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (TypeScript, Tailwind CSS)
- **Backend**: Node.js / Express (TypeScript)
- **Database**: PostgreSQL
- **Auth**: JWT-based
- **Payments**: DodoPayments (integrated, no charges in MVP)

## 📁 Project Structure

```
ocm/
├── web/                    # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── public/            # Static assets
│   └── package.json
├── api/                    # Express backend
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth, validation
│   │   ├── services/      # Business logic
│   │   └── db/           # Database connections
│   └── package.json
├── shared/                 # TypeScript types & utils
│   ├── types.ts           # Shared interfaces
│   ├── constants.ts       # Shared constants
│   └── package.json
├── docker/                 # Docker compose setup
│   ├── Dockerfile
│   └── docker-compose.yml
└── README.md
```

## 🏃 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/rahaeltatos-lang/ocm.git
   cd ocm
   ```

2. **Install dependencies**
   ```bash
   cd api && npm install
   cd ../web && npm install
   cd ../shared && npm install
   ```

3. **Environment setup**
   ```bash
   cp api/.env.example api/.env
   cp web/.env.example web/.env.local
   ```
   Update with your database credentials and JWT secret.

4. **Database setup**
   ```bash
   cd api
   npm run db:migrate
   npm run db:seed
   ```

5. **Run in development**
   ```bash
   # Terminal 1: API
   cd api && npm run dev

   # Terminal 2: Web
   cd web && npm run dev
   ```

   - API: http://localhost:4001
   - Web: http://localhost:3001

## 📊 Core Tables

```sql
-- Customers
CREATE TABLE ocm_customers (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  password_hash VARCHAR NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE ocm_subscriptions (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES ocm_customers(id),
  team_type VARCHAR NOT NULL, -- 'social_media', 'lead_gen', 'support'
  tier VARCHAR NOT NULL, -- 'starter', 'pro', 'enterprise'
  status VARCHAR DEFAULT 'active', -- 'active', 'paused', 'cancelled'
  price_monthly INT NOT NULL,
  api_key VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Agent Instances
CREATE TABLE ocm_team_instances (
  id UUID PRIMARY KEY,
  subscription_id UUID REFERENCES ocm_subscriptions(id),
  agent_id VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'deployed', -- 'deployed', 'running', 'error', 'paused'
  logs_json JSONB,
  last_activity TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Authentication

JWT-based authentication. Sign up → Email verification → Login → Get access token.

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "customer": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## 💳 Pricing Model

| Team | Monthly | Features |
|------|---------|----------|
| **Social Media Manager** | $99 | Content posting, engagement, analytics |
| **Lead Generation Bot** | $149 | Prospect research, outreach, tracking |
| **Customer Support Agent** | $199 | Ticket handling, 24/7 support, responses |

## 📝 API Endpoints (MVP)

### Auth
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Sign in
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/reset-password` - Reset password

### Subscriptions
- `GET /api/subscriptions` - List user subscriptions
- `POST /api/subscriptions` - Create new subscription
- `GET /api/subscriptions/:id` - Get subscription details
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Cancel subscription

### Admin
- `GET /api/admin/customers` - List all customers
- `GET /api/admin/revenue` - Revenue & MRR tracking
- `POST /api/admin/teams` - Assign agent to customer

## 🚀 Deployment

### Docker Compose (Local)
```bash
docker-compose -f docker/docker-compose.yml up
```

### Production
1. Push to GitHub
2. Set up environment variables
3. Deploy using Vercel (frontend) + Railway/Render (backend)
4. Configure custom domain

## 📚 Documentation

- [Setup Guide](docs/setup.md)
- [API Reference](docs/api.md)
- [Database Schema](docs/schema.md)
- [Deployment Guide](docs/deployment.md)

## 🐛 Development

### Run Tests
```bash
cd api && npm run test
cd web && npm run test
```

### Lint & Format
```bash
npm run lint
npm run format
```

## 📧 Support

For issues, questions, or feature requests: support@openclawmatrix.com

## 📄 License

MIT

---

**Built by the OpenClaw team** | [Website](https://openclaw.io) | [Docs](https://docs.openclaw.io)

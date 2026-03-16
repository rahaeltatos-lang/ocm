# OpenClawMatrix OCM - Quick Start Guide

## 🚀 5-Minute Setup

### Option 1: Docker Compose (Recommended)

```bash
cd /Users/raphael/.openclaw/workspace/ocm
docker-compose -f docker/docker-compose.yml up
```

This starts:
- **API** → http://localhost:4001 (with hot reload)
- **Web** → http://localhost:3001
- **PostgreSQL** → localhost:5432

### Option 2: Manual Setup

#### 1. Setup Database
```bash
# Make sure PostgreSQL is running (localhost:5432)
# Then initialize schema
cd api
npm install
PGPASSWORD=password psql -h localhost -U openclawmatrix -d openclawmatrix -f src/db/schema.sql
```

#### 2. Configure Environment
```bash
# API
cp api/.env.example api/.env
# Edit api/.env with your database credentials

# Web
cp web/.env.example web/.env.local
# No changes needed for local dev
```

#### 3. Install & Run
```bash
# Terminal 1: API
cd api
npm install
npm run dev
# Should say: 🚀 API running on http://localhost:4001

# Terminal 2: Web
cd web
npm install
npm run dev
# Should say: ▲ Next.js 14.0.4 ready in ...
```

## 📝 What's Included

### Frontend (Next.js)
- **Landing Page** - Hero, features, pricing, FAQ
- **Authentication Pages** - Signup, login (stubs)
- **Dashboard Pages** - (coming next)
- Tailwind CSS styling
- Responsive design

### Backend (Express + PostgreSQL)
- **Auth Routes**
  - `POST /api/auth/signup` - Register new user
  - `POST /api/auth/login` - Sign in
  - `POST /api/auth/verify-email` - Email verification
  - `POST /api/auth/reset-password` - Password reset

- **Subscription Routes** (protected)
  - `GET /api/subscriptions` - List user's subscriptions
  - `POST /api/subscriptions` - Create subscription
  - `GET /api/subscriptions/:id` - Get subscription details
  - `PUT /api/subscriptions/:id` - Update subscription
  - `DELETE /api/subscriptions/:id` - Cancel subscription

- **Admin Routes** (protected)
  - `GET /api/admin/customers` - List all customers
  - `GET /api/admin/revenue` - Revenue & MRR stats
  - `GET /api/admin/dashboard` - Dashboard overview
  - `GET /api/admin/subscriptions/:id` - Subscription details
  - `PATCH /api/admin/team-instances/:id` - Update team status

### Database
- `ocm_customers` - User accounts
- `ocm_subscriptions` - Active subscriptions
- `ocm_team_instances` - Deployed AI agents

## 🧪 Test the API

### Signup
```bash
curl -X POST http://localhost:4001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:4001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

This returns a JWT token. Use it in subsequent requests:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4001/api/subscriptions
```

### Create Subscription
```bash
curl -X POST http://localhost:4001/api/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "teamType": "social_media"
  }'
```

## 📊 Database Schema

```
ocm_customers
├── id (UUID)
├── email (unique)
├── name
├── password_hash
├── email_verified
└── created_at

ocm_subscriptions
├── id (UUID)
├── customer_id (FK)
├── team_type (social_media, lead_gen, support)
├── tier (starter, pro, enterprise)
├── status (active, paused, cancelled)
├── price_monthly
├── api_key (unique)
└── created_at

ocm_team_instances
├── id (UUID)
├── subscription_id (FK)
├── status (deployed, running, error, paused)
├── logs_json (JSONB)
├── usage_stats (JSONB)
└── created_at
```

## 🎯 Next Steps

1. **Auth Pages** - Build signup/login UI with form validation
2. **Dashboard** - Create customer dashboard to view subscriptions & agent status
3. **Payment Integration** - Integrate DodoPayments for payment processing
4. **Admin Panel** - Build admin dashboard with customer/revenue management
5. **Email Notifications** - Setup email verification and password reset flows
6. **Deploy** - Push to production (Vercel for frontend, Railway/Render for API)

## 🔧 Development Tips

- **Hot reload enabled** - Code changes auto-reload in dev mode
- **TypeScript** - Full type safety across API and frontend
- **ESLint + Prettier** - Run `npm run lint` & `npm run format`
- **Database migrations** - Edit schema, restart containers
- **JWT Secret** - Change `JWT_SECRET` in .env for production

## 📚 Project Structure

```
ocm/
├── api/              # Express backend
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── db/       # Database logic
│   │   └── middleware/ # Auth, errors
│   ├── package.json
│   └── .env
├── web/              # Next.js frontend
│   ├── app/          # App router pages
│   ├── components/   # React components
│   ├── package.json
│   └── .env.local
├── shared/           # TypeScript types
├── docker/           # Docker setup
└── README.md
```

## ⚠️ Production Notes

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production` in API .env
- [ ] Configure SMTP for emails (or use SendGrid)
- [ ] Setup DodoPayments keys
- [ ] Enable CORS for your domain
- [ ] Use strong database passwords
- [ ] Setup SSL/TLS certificates
- [ ] Configure backups

## 🆘 Troubleshooting

**Port already in use?**
```bash
lsof -i :4001   # API
lsof -i :3001   # Web
lsof -i :5432   # DB
```

**Database won't connect?**
```bash
# Check PostgreSQL is running
psql -h localhost -U openclawmatrix -d openclawmatrix -c "SELECT 1;"

# If not installed, use Docker instead
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:15-alpine
```

**Dependencies missing?**
```bash
npm ci  # Install from package-lock.json
```

---

**Questions?** Check README.md or contact support@openclawmatrix.com

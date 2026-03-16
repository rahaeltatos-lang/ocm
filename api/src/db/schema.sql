-- OCM Customers Table
CREATE TABLE IF NOT EXISTS ocm_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255),
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- OCM Subscriptions Table
CREATE TABLE IF NOT EXISTS ocm_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES ocm_customers(id) ON DELETE CASCADE,
  team_type VARCHAR(50) NOT NULL, -- 'social_media', 'lead_gen', 'support'
  tier VARCHAR(50) NOT NULL, -- 'starter', 'pro', 'enterprise'
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'cancelled'
  price_monthly INT NOT NULL,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(customer_id, team_type)
);

-- OCM Team Instances Table
CREATE TABLE IF NOT EXISTS ocm_team_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES ocm_subscriptions(id) ON DELETE CASCADE,
  agent_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'deployed', -- 'deployed', 'running', 'error', 'paused'
  logs_json JSONB,
  usage_stats JSONB,
  last_activity TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ocm_customers_email ON ocm_customers(email);
CREATE INDEX IF NOT EXISTS idx_ocm_subscriptions_customer_id ON ocm_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_ocm_subscriptions_api_key ON ocm_subscriptions(api_key);
CREATE INDEX IF NOT EXISTS idx_ocm_team_instances_subscription_id ON ocm_team_instances(subscription_id);

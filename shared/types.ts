// Customer
export interface Customer {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: string;
}

// Subscription
export type TeamType = 'social_media' | 'lead_gen' | 'support';
export type SubscriptionTier = 'starter' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

export interface Subscription {
  id: string;
  customerId: string;
  teamType: TeamType;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  priceMonthly: number;
  apiKey: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

// Team Instance
export type TeamInstanceStatus = 'deployed' | 'running' | 'error' | 'paused';

export interface TeamInstance {
  id: string;
  subscriptionId: string;
  agentId?: string;
  status: TeamInstanceStatus;
  logsJson?: Record<string, any>;
  usageStats?: Record<string, any>;
  lastActivity?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth
export interface AuthResponse {
  token: string;
  customer: Customer;
}

export interface SignupRequest {
  email: string;
  name: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// API Response
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

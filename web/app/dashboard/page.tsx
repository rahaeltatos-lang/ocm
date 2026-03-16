'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

interface Subscription {
  id: string;
  teamType: string;
  tier: string;
  status: string;
  priceMonthly: number;
  apiKey: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('ocm_user');
    if (!storedUser) {
      window.location.href = '/auth/login';
      return;
    }

    setUser(JSON.parse(storedUser));

    // Fetch subscriptions
    const token = localStorage.getItem('ocm_token');
    if (token) {
      axios
        .get(`${API_URL}/api/subscriptions`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
          setSubscriptions(res.data);
        })
        .catch(err => {
          setError(err.response?.data?.error || 'Failed to load subscriptions');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ocm_token');
    localStorage.removeItem('ocm_user');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">OCM</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Active Subscriptions</p>
            <p className="text-3xl font-bold text-gray-900">
              {subscriptions.filter(s => s.status === 'active').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Monthly Spend</p>
            <p className="text-3xl font-bold text-gray-900">
              ${subscriptions
                .filter(s => s.status === 'active')
                .reduce((sum, s) => sum + s.priceMonthly, 0)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Account Status</p>
            <p className="text-3xl font-bold text-green-600">Active</p>
          </div>
        </div>

        {/* Subscriptions */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Your Teams</h2>
            <Link href="/subscribe" className="btn-primary">
              Add Team
            </Link>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-b border-red-200 text-red-700">
              {error}
            </div>
          )}

          {subscriptions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 mb-4">No active teams yet</p>
              <Link href="/subscribe" className="btn-primary">
                Get Started
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {subscriptions.map(sub => (
                <div key={sub.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {sub.teamType.replace('_', ' ').toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          sub.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {sub.status}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        API Key: <code className="bg-gray-100 px-2 py-1 rounded">{sub.apiKey.substring(0, 20)}...</code>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">${sub.priceMonthly}/mo</p>
                      <p className="text-sm text-gray-600">Tier: {sub.tier}</p>
                      <button className="mt-2 text-blue-600 hover:underline text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

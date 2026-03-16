'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

const TEAMS = [
  {
    id: 'social_media',
    name: 'Social Media Manager',
    price: 99,
    description: 'Automate content posting, engagement tracking, and analytics',
    icon: '📱'
  },
  {
    id: 'lead_gen',
    name: 'Lead Generation Bot',
    price: 149,
    description: 'Find qualified prospects, conduct outreach, and track conversions',
    icon: '🎯'
  },
  {
    id: 'support',
    name: 'Customer Support Agent',
    price: 199,
    description: '24/7 automated support with human handoff',
    icon: '💬'
  }
];

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('ocm_token');
    if (!token) {
      window.location.href = '/auth/login';
    }
  }, []);

  const handleSubscribe = async (teamType: string) => {
    const token = localStorage.getItem('ocm_token');
    if (!token) {
      window.location.href = '/auth/login';
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    setSelectedTeam(teamType);

    try {
      const response = await axios.post(
        `${API_URL}/api/subscriptions`,
        { teamType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(`${response.data.subscription.teamType} subscribed successfully! Redirecting to dashboard...`);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Subscription failed. Please try again.');
      setSelectedTeam(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your AI Team
          </h1>
          <p className="text-xl text-gray-600">
            Start with a 14-day free trial. No credit card required.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {TEAMS.map(team => (
            <div
              key={team.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-8">
                <div className="text-5xl mb-4">{team.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {team.name}
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  {team.description}
                </p>

                <div className="mb-6 pb-6 border-b">
                  <p className="text-4xl font-bold text-gray-900">
                    ${team.price}
                    <span className="text-lg font-normal text-gray-600">/mo</span>
                  </p>
                </div>

                <button
                  onClick={() => handleSubscribe(team.id)}
                  disabled={loading && selectedTeam === team.id}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    loading && selectedTeam === team.id
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {loading && selectedTeam === team.id
                    ? 'Creating Subscription...'
                    : 'Subscribe Now'}
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  14 days free • Cancel anytime
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

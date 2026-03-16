'use client';

import Link from 'next/link';

export default function Pricing() {
  const plans = [
    {
      name: 'Social Media Manager',
      price: 99,
      team: 'social_media',
      description: 'Perfect for managing your social presence',
      features: [
        'Multi-platform posting',
        'Engagement analytics',
        'Content calendar',
        'Post scheduling',
        'Email support',
        'API access'
      ],
      cta: 'Start Free Trial'
    },
    {
      name: 'Lead Generation Bot',
      price: 149,
      team: 'lead_gen',
      description: 'Best for B2B sales teams',
      features: [
        'Automated prospect research',
        'Email outreach campaigns',
        'Lead scoring',
        'CRM integration',
        'Priority support',
        'Advanced API'
      ],
      cta: 'Start Free Trial',
      highlight: true
    },
    {
      name: 'Customer Support Agent',
      price: 199,
      team: 'support',
      description: 'Enterprise-grade support automation',
      features: [
        '24/7 ticket handling',
        'Multi-channel support',
        'Knowledge base',
        'Sentiment analysis',
        'Human handoff',
        'Custom training'
      ],
      cta: 'Start Free Trial'
    }
  ];

  return (
    <section id="pricing" className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Choose the team that fits your business. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-8 transition-all ${
                plan.highlight
                  ? 'bg-white border-2 border-blue-600 shadow-xl transform md:scale-105'
                  : 'bg-white border border-gray-200 hover:shadow-lg'
              }`}
            >
              {plan.highlight && (
                <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {plan.description}
              </p>

              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-gray-600">/month</span>
              </div>

              <Link
                href={`/auth/signup?team=${plan.team}`}
                className={`block text-center py-3 rounded-lg font-semibold mb-8 transition-colors ${
                  plan.highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-white rounded-lg border border-gray-200 text-center">
          <p className="text-gray-600 mb-2">
            <strong>💳 First 14 days free</strong> — No credit card required
          </p>
          <p className="text-gray-500 text-sm">
            Cancel anytime. No questions asked.
          </p>
        </div>
      </div>
    </section>
  );
}

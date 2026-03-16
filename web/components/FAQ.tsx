'use client';

import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How long does setup take?',
      a: 'Less than 5 minutes. Sign up, choose your agent team, and start using it immediately. No complex configurations needed.'
    },
    {
      q: 'Can I try it before paying?',
      a: 'Yes! Get 14 days free with full access. No credit card required to start.'
    },
    {
      q: 'What integrations do you support?',
      a: 'We support integration with popular platforms via API. Check our documentation for the latest list of supported integrations.'
    },
    {
      q: 'Can I upgrade or downgrade anytime?',
      a: 'Absolutely. Change your plan, add another team, or cancel anytime. Changes take effect immediately.'
    },
    {
      q: 'Is there a limit to what the agents can do?',
      a: 'Nope! Each agent is fully customizable. Contact us to discuss advanced configurations and custom workflows.'
    },
    {
      q: 'What about data security?',
      a: 'We take security seriously. All data is encrypted, backed up daily, and compliant with SOC 2 standards.'
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about OpenClawMatrix
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 text-left">
                  {faq.q}
                </h3>
                <span className={`text-2xl text-blue-600 transition-transform ${
                  openIndex === idx ? 'rotate-45' : ''
                }`}>
                  +
                </span>
              </button>

              {openIndex === idx && (
                <div className="px-6 pb-6 border-t border-gray-200 bg-gray-50">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-blue-50 rounded-lg border border-blue-200 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-4">
            Our team is ready to help. Reach out anytime.
          </p>
          <a href="mailto:support@openclawmatrix.com" className="btn-primary">
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}

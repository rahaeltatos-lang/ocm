'use client';

export default function Features() {
  const features = [
    {
      icon: '📱',
      title: 'Social Media Manager',
      description: 'Automate content posting, engagement tracking, and analytics across all platforms',
      specs: ['Multi-platform posting', 'Engagement analytics', 'Content scheduling']
    },
    {
      icon: '🎯',
      title: 'Lead Generation Bot',
      description: 'Find qualified prospects, conduct outreach, and track conversions automatically',
      specs: ['Prospect research', 'Email campaigns', 'Lead scoring']
    },
    {
      icon: '💬',
      title: 'Customer Support Agent',
      description: '24/7 automated support with human handoff, ticket management, and knowledge base',
      specs: ['Ticket handling', '24/7 availability', 'Smart routing']
    },
  ];

  return (
    <section id="features" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your AI Team
          </h2>
          <p className="text-xl text-gray-600">
            Pick the agent team that fits your business needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-8 rounded-lg border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.specs.map((spec, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <span className="text-blue-600 mr-2">✓</span>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

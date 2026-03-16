'use client';

import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-6 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Deploy Your AI Team?
        </h2>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Join hundreds of teams already automating their workflows with OpenClawMatrix
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/signup"
            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Free Trial
          </Link>
          <a
            href="mailto:support@openclawmatrix.com"
            className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
          >
            Schedule Demo
          </a>
        </div>

        <p className="mt-8 opacity-75 text-sm">
          ✨ 14-day free trial • No credit card required • Cancel anytime
        </p>
      </div>
    </section>
  );
}

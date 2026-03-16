'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 md:py-32">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
          Deploy AI Agent <span className="gradient-text">Teams</span> in Minutes
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Pre-configured teams of AI agents designed for enterprise automation. Stop building from scratch.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/auth/signup" className="btn-primary">
            Start Free Trial
          </Link>
          <Link href="#pricing" className="btn-outline">
            View Pricing
          </Link>
        </div>

        <p className="text-gray-500 text-sm mb-12">
          💰 No credit card required • 🚀 Deploy in minutes • 📊 Full analytics included
        </p>

        {/* Dashboard preview placeholder */}
        <div className="relative">
          <div className="max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="aspect-video bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-6xl mb-2">📊</div>
                <p className="text-xl font-semibold">Dashboard Preview</p>
                <p className="text-blue-100 mt-2">Coming soon in your account</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-blue-200 rounded-lg opacity-20 blur-2xl"></div>
        </div>
      </div>
    </section>
  );
}

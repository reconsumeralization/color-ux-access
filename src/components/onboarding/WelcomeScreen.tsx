'use client'

import { useRouter } from 'next/navigation';
import { FeatureCard } from '../common/FeatureCard';

export const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-16">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-6">
          Welcome to ColorME
        </h1>
        
        <div className="text-center mb-12">
          <p className="text-xl text-gray-600 mb-8">
            Test your website for colorblind accessibility in minutes
          </p>
          <button
            onClick={() => router.push('/get-started')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg
                     hover:bg-blue-700 transition-colors"
          >
            Get Started - It's Free
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            icon="🎯"
            title="Quick Testing"
            description="Test your website in minutes with our automated tools"
          />
          <FeatureCard
            icon="📊"
            title="Detailed Reports"
            description="Get comprehensive accessibility insights"
          />
          <FeatureCard
            icon="🔄"
            title="Real-time Simulation"
            description="See how colorblind users experience your site"
          />
        </div>
      </div>
    </main>
  );
}; 
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <header className="fixed w-full top-0 z-50 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              href="/welcome"
              className="flex items-center px-2 py-2 text-gray-900 hover:text-blue-600"
            >
              <span className="text-xl font-bold">ColorME</span>
            </Link>
          </div>
          
          <div className="flex space-x-8">
            <Link
              href="/get-started"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                pathname === '/get-started' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Get Started
            </Link>
            <Link
              href="/results"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                pathname === '/results' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Results
            </Link>
            <Link
              href="/docs"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                pathname === '/docs' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Documentation
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}; 
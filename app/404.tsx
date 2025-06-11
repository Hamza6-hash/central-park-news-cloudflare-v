import Link from 'next/link';
import Image from 'next/image';
import DummyImg from '@/assets/Rectangle-2.png';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
        <h2 className="text-3xl font-century-gothic mb-6">Newsletter Not Found</h2>
        <p className="text-gray-600 mb-8">
          The newsletter you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="mb-8">
          <Image
            src={DummyImg}
            alt="404 Illustration"
            className="w-full max-w-md mx-auto"
            priority
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Back to Home
          </Link>
          <Link 
            href="/news"
            className="px-6 py-3 border border-primary-500 text-primary-500 rounded-md hover:bg-primary-50 transition-colors"
          >
            Browse Newsletter
          </Link>
        </div>
      </div>
    </div>
  );
} 
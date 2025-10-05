import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const popularPages = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Profile', path: '/profilePage', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-yellow-200 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-20 w-72 h-72 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-10 right-20 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>
      </div>

      {/* Main content */}
      <div className={`relative z-10 max-w-4xl mx-auto text-center transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="space-y-6">
          {/* 404 Text with parallax effect */}
          <div 
            className="relative"
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
              transition: 'transform 0.2s ease-out'
            }}
          >
            <h1 className="text-[150px] sm:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 text-[150px] sm:text-[200px] font-black text-gray-200 dark:text-gray-700 leading-none -z-10 blur-md">
              404
            </div>
          </div>

          {/* Glitch effect text */}
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 glitch-text" data-text="Page Not Found">
              Page Not Found
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Oops! The page you're looking for seems to have vanished into the digital void. 
              It might have been moved, deleted, or perhaps it never existed at all.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <button
              onClick={handleGoBack}
              className="group relative px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Go Back
              </span>
            </button>

            <button
              onClick={handleGoHome}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Return Home
              </span>
              <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
          </div>

          {/* Quick links */}
          <div className="pt-12">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Or try one of these popular pages:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {popularPages.map((page) => (
                <button
                  key={page.path}
                  onClick={() => navigate(page.path)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <span className="text-lg">{page.icon}</span>
                  <span className="text-sm font-medium">{page.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fun easter egg */}
          <div className="pt-8">
            <details className="inline-block text-left">
              <summary className="cursor-pointer text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors select-none">
                🔍 Lost? Click for a hint...
              </summary>
              <div className="mt-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg max-w-sm">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Pro tip:</strong> Check the URL for typos, or use the navigation menu to find what you're looking for. 
                  If you followed a link here, it might be outdated.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-10 dark:opacity-5 select-none animate-float">
        🌟
      </div>
      <div className="absolute top-20 right-20 text-5xl opacity-10 dark:opacity-5 select-none animate-float animation-delay-2000">
        💫
      </div>
      <div className="absolute bottom-20 left-20 text-7xl opacity-10 dark:opacity-5 select-none animate-float animation-delay-4000">
        🚀
      </div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-10 dark:opacity-5 select-none animate-float animation-delay-6000">
        🌙
      </div>

      {/* Add required styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-6000 {
          animation-delay: 6s;
        }

        .glitch-text {
          position: relative;
        }

        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
        }

        .glitch-text::before {
          animation: glitch-1 0.5s infinite;
          color: #ff00ff;
          z-index: -1;
          opacity: 0.7;
        }

        .glitch-text::after {
          animation: glitch-2 0.5s infinite;
          color: #00ffff;
          z-index: -2;
          opacity: 0.7;
        }

        @keyframes glitch-1 {
          0%, 100% {
            clip-path: inset(0 0 0 0);
            transform: translate(0);
          }
          20% {
            clip-path: inset(33% 0 25% 0);
            transform: translate(-2px, 2px);
          }
          40% {
            clip-path: inset(10% 0 65% 0);
            transform: translate(2px, -2px);
          }
          60% {
            clip-path: inset(80% 0 5% 0);
            transform: translate(-2px, 2px);
          }
          80% {
            clip-path: inset(45% 0 40% 0);
            transform: translate(2px, -2px);
          }
        }

        @keyframes glitch-2 {
          0%, 100% {
            clip-path: inset(0 0 0 0);
            transform: translate(0);
          }
          20% {
            clip-path: inset(65% 0 10% 0);
            transform: translate(2px, -2px);
          }
          40% {
            clip-path: inset(25% 0 45% 0);
            transform: translate(-2px, 2px);
          }
          60% {
            clip-path: inset(5% 0 80% 0);
            transform: translate(2px, 2px);
          }
          80% {
            clip-path: inset(40% 0 33% 0);
            transform: translate(-2px, -2px);
          }
        }
      `}</style>
    </div>
  );
}
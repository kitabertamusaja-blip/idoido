
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 glass-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            V
          </div>
          <span className="text-xl font-bold tracking-tight">ViralScope</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Analyzer</a>
          <a href="#" className="hover:text-white transition-colors">Trends</a>
        </div>
        {/* Upgrade Pro button removed */}
        <div className="md:hidden">
          {/* Mobile menu placeholder if needed */}
        </div>
      </nav>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="py-12 px-6 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; 2026 ViralScope Analytics Engine. Built for Creators.</p>
      </footer>
    </div>
  );
};

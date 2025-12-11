import React from 'react';
import { Calendar, Terminal, Coffee } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="w-full mb-8 relative group">
      {/* Decorative Banner Image */}
      <div className="w-full h-48 md:h-64 overflow-hidden rounded-b-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] to-transparent z-10" />
        <img 
          src="https://picsum.photos/1200/400?grayscale&blur=2" 
          alt="Banner" 
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 z-0 bg-emerald-900/10 mix-blend-overlay" />
      </div>

      {/* Header Content */}
      <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-20 flex items-end gap-4">
        <div className="hidden md:flex h-20 w-20 glass-card items-center justify-center rounded-xl shadow-2xl">
          <span className="text-4xl">🌱</span>
        </div>
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-1 text-xs md:text-sm font-mono tracking-wider uppercase">
             <Terminal size={14} /> 
             <span>Student Dashboard v2.0</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
            Zenith Tracker
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> Academic Year 2025</span>
            <span className="flex items-center gap-1.5"><Coffee size={14} /> Focus Mode</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
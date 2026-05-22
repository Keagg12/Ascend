import React from 'react';
import { FaHome, FaBullseye, FaChartBar, FaUserShield } from 'react-icons/fa';

const NavBar = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'dashboard', icon: FaHome, label: 'Core' },
    { id: 'focus', icon: FaBullseye, label: 'Focus' },
    { id: 'stats', icon: FaChartBar, label: 'Data' },
    { id: 'profile', icon: FaUserShield, label: 'Vault' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl px-2 py-2 flex gap-1 shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all ${
                isActive 
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]' 
                : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="text-xl mb-1" />
              <span className="text-[9px] font-bold uppercase tracking-tighter">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default NavBar;

import React from 'react';
import { useGame } from '../../store/GameContext';
import PsychBar from '../shared/PsychBar';
import { FaUserAstronaut } from 'react-icons/fa';

const Header = () => {
  const { state } = useGame();
  const { user } = state;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <FaUserAstronaut className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white leading-none uppercase italic tracking-tighter">
              {user.name} <span className="text-cyan-400 ml-1">LVL {user.level}</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Rank: {user.rank}
            </p>
          </div>
        </div>
        
        <div className="hidden md:block w-64">
          <PsychBar value={user.psych} />
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Ascension Progress</div>
          <div className="h-1.5 w-32 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
              style={{ width: `${(user.xp / user.maxXp) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

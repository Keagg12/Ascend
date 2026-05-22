import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/shared/SectionHeader';
import FloatLayer from '../components/shared/FloatLayer';
import { BOSS_CHALLENGES } from '../constants/bossChallenges';
import { motion } from 'framer-motion';

const FocusPage = () => {
  const [timeLeft, setTimeLeft] = useState(1500); // 25 mins
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <SectionHeader title="Focus Chamber" subtitle="Deep work protocols activate here" />
      
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-slate-800"
            />
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray="754"
              animate={{ strokeDashoffset: 754 - (754 * (timeLeft / 1500)) }}
              className="text-cyan-500"
            />
          </svg>
          <div className="absolute text-5xl font-black text-white font-mono tracking-tighter">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest transition-all ${
              isActive ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-cyan-500 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
            }`}
          >
            {isActive ? 'Abort' : 'Engage'}
          </button>
          <button 
            onClick={() => {setIsActive(false); setTimeLeft(1500);}}
            className="px-8 py-3 rounded-full font-bold uppercase tracking-widest bg-slate-800 text-slate-400 border border-slate-700"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <SectionHeader title="Current Boss" subtitle="Defeat your demons" />
        <div className="md:col-start-1">
          <FloatLayer className="border-amber-500/30">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-amber-500">{BOSS_CHALLENGES[0].name}</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Level 10 Encounter</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400">BOSS HP</span>
                <div className="text-xl font-black text-white">{BOSS_CHALLENGES[0].hp}/500</div>
              </div>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-amber-900/30">
              <div className="h-full bg-gradient-to-r from-amber-600 to-orange-500 w-full animate-pulse"></div>
            </div>
            <button className="w-full mt-6 py-3 bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 border border-amber-500/30 rounded-xl font-bold transition-all uppercase tracking-widest text-sm">
              Challenge Boss (Coming Soon)
            </button>
          </FloatLayer>
        </div>
      </div>
    </div>
  );
};

export default FocusPage;

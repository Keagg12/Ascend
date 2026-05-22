import React from 'react';
import { motion } from 'framer-motion';

const PsychBar = ({ value, max = 100 }) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-tighter">Psych Core</span>
        <span className="text-xs font-mono text-indigo-300">{value}/{max}</span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-indigo-900/50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
        />
      </div>
    </div>
  );
};

export default PsychBar;

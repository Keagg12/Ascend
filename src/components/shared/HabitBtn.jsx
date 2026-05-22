import React from 'react';
import { motion } from 'framer-motion';

const HabitBtn = ({ name, xp, icon: Icon, onClick, color = "cyan" }) => {
  const colorMap = {
    cyan: "from-cyan-600 to-cyan-800 hover:from-cyan-500 hover:to-cyan-700 shadow-cyan-900/20",
    purple: "from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 shadow-purple-900/20",
    emerald: "from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 shadow-emerald-900/20",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full relative group overflow-hidden rounded-xl p-4 bg-gradient-to-br ${colorMap[color]} text-left border border-white/10 shadow-lg transition-all`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {Icon && <div className="text-xl opacity-80 group-hover:scale-110 transition-transform"><Icon /></div>}
          <span className="font-bold text-white tracking-tight">{name}</span>
        </div>
        <span className="text-[10px] font-black bg-black/30 px-2 py-1 rounded text-white/90">+{xp} XP</span>
      </div>
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 -rotate-45 translate-x-8 -translate-y-8 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform"></div>
    </motion.button>
  );
};

export default HabitBtn;

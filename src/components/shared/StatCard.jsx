import React from 'react';

const StatCard = ({ label, value, icon: Icon, color = "cyan" }) => {
  const colorMap = {
    cyan: "text-cyan-400 border-cyan-500/30",
    purple: "text-purple-400 border-purple-500/30",
    emerald: "text-emerald-400 border-emerald-500/30",
    amber: "text-amber-400 border-amber-500/30",
  };

  return (
    <div className={`bg-slate-800/40 border ${colorMap[color]} rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:scale-105`}>
      {Icon && <Icon className="text-2xl mb-2 opacity-80" />}
      <span className="text-xs uppercase tracking-widest text-slate-400 mb-1">{label}</span>
      <span className="text-2xl font-black">{value}</span>
    </div>
  );
};

export default StatCard;

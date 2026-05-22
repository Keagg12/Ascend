import React from 'react';

const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-black text-white uppercase italic tracking-wider leading-none flex items-center">
        <span className="w-2 h-6 bg-cyan-500 mr-3 skew-x-[-20deg]"></span>
        {title}
      </h2>
      {subtitle && <p className="text-slate-500 text-sm mt-1 ml-5">{subtitle}</p>}
    </div>
  );
};

export default SectionHeader;

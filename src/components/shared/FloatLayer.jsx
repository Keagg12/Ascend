import React from 'react';
import { motion } from 'framer-motion';

const FloatLayer = ({ children, className = "" }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 shadow-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default FloatLayer;

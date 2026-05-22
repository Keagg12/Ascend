import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BossWinModal = ({ bossName, isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/90">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-slate-900 border-2 border-amber-500 p-10 rounded-3xl text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-amber-500/10 animate-pulse"></div>
            <h2 className="text-5xl font-black text-amber-500 mb-4 relative z-10">CONQUERED!</h2>
            <p className="text-2xl text-slate-300 mb-8 relative z-10">{bossName} has been defeated.</p>
            <button 
              onClick={onClose}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-10 rounded-xl relative z-10"
            >
              Claim Rewards
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BossWinModal;

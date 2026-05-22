import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LevelUpModal = ({ level, isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-slate-900 border-2 border-cyan-500 p-8 rounded-2xl text-center shadow-[0_0_50px_rgba(6,182,212,0.5)]"
          >
            <h2 className="text-4xl font-black text-cyan-400 mb-2 italic uppercase">Level Up!</h2>
            <p className="text-xl text-slate-300 mb-6">You have reached level <span className="text-cyan-400 font-bold">{level}</span></p>
            <button 
              onClick={onClose}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-8 rounded-full transition-all"
            >
              Continue Ascension
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpModal;

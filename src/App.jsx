import React, { useState } from 'react';
import { GameProvider } from './store/GameContext';
import AmbientBackground from './components/AmbientBackground';
import Header from './components/layout/Header';
import NavBar from './components/layout/NavBar';
import Dashboard from './pages/Dashboard';
import FocusPage from './pages/FocusPage';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'focus':
        return <FocusPage />;
      case 'stats':
        return (
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 italic uppercase tracking-widest font-bold">
            Data Vault Restricted: Higher Level Required
          </div>
        );
      case 'profile':
        return (
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 italic uppercase tracking-widest font-bold">
            User Identity Locked: Protocol Pending
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <GameProvider>
      <div className="min-h-screen relative text-slate-200">
        <AmbientBackground />
        <Header />
        
        <main className="max-w-7xl mx-auto px-6 pt-32 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </GameProvider>
  );
}

export default App;

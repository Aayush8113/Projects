import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Library, Sparkles, ScanFace, Database } from 'lucide-react';

const loadingStatuses = [
  "AUTHENTICATING...",
  "ALIGNING TUMBLERS...",
  "SYNCING NEURAL VAULT...",
  "POLISHING SPINES...",
  "DECRYPTING ARCHIVES..."
];

const PageLoader = () => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // 1. Text Cycler
    const textTimer = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % loadingStatuses.length);
    }, 450);

    // 2. The Progress Logic (Timed to finish in ~2.1 seconds)
    const progressTimer = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(progressTimer);
          clearInterval(textTimer);
          setIsUnlocked(true); // 🔓 Trigger Success State
          return 100;
        }
        
        // Random jumps to simulate real data loading
        const jump = Math.floor(Math.random() * 4) + 1; 
        return Math.min(old + jump, 100);
      });
    }, 35); // Speed tuned for 2.5s App.jsx timeout

    return () => {
      clearInterval(progressTimer);
      clearInterval(textTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020617] overflow-hidden cursor-wait w-screen h-screen font-sans">
      
      {/* 🌌 ATMOSPHERE: The "Dark Room" Feel */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Spotlight following center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-indigo-500/10 blur-[100px] rounded-full animate-pulse-fast" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* 🔐 THE MECHANISM (Centerpiece) */}
      <div className="relative z-20 flex flex-col items-center">
        
        <div className="relative mb-12 group">
          {/* Ring 1: Decades (Slow Reverse) */}
          <motion.div 
            animate={{ rotate: isUnlocked ? 0 : -360, scale: isUnlocked ? 1.1 : 1 }}
            transition={{ duration: isUnlocked ? 0.5 : 15, ease: isUnlocked ? "backOut" : "linear", repeat: isUnlocked ? 0 : Infinity }}
            className={`absolute inset-0 -m-8 border border-dashed rounded-full w-48 h-48 md:w-64 md:h-64 transition-colors duration-500 ${isUnlocked ? 'border-emerald-500/50 opacity-100' : 'border-slate-300 dark:border-slate-700 opacity-20'}`}
          />
          
          {/* Ring 2: Seconds (Fast Forward) */}
          <motion.div 
            animate={{ rotate: isUnlocked ? 0 : 360 }}
            transition={{ duration: isUnlocked ? 0.5 : 3, ease: isUnlocked ? "backOut" : "linear", repeat: isUnlocked ? 0 : Infinity }}
            className={`absolute inset-0 -m-4 border-2 border-dotted rounded-full w-40 h-40 md:w-56 md:h-56 transition-colors duration-500 ${isUnlocked ? 'border-emerald-400 opacity-80' : 'border-indigo-400/30 opacity-40'}`}
          />

          {/* 💎 THE CORE (Glassmorphism) */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`relative flex items-center justify-center w-32 h-32 md:w-48 md:h-48 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-full shadow-2xl ring-1 transition-all duration-500 ${isUnlocked ? 'ring-emerald-500 shadow-emerald-500/20' : 'ring-white/20 shadow-indigo-500/20'}`}
          >
            <AnimatePresence mode="wait">
              {isUnlocked ? (
                <motion.div
                  key="unlocked"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="flex flex-col items-center"
                >
                  <Unlock size={48} className="text-emerald-500 drop-shadow-md" />
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: "100%" }} 
                    className="h-1 mt-2 rounded-full bg-emerald-500" 
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="locked"
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  {/* Icon Swaps based on progress to show "Activity" */}
                  {progress < 30 ? <ScanFace size={40} className="text-slate-400 animate-pulse" /> : 
                   progress < 70 ? <Database size={40} className="text-indigo-400 animate-bounce" /> :
                   <Lock size={40} className="text-indigo-600 dark:text-indigo-300" />}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* 📝 STATUS REPORT */}
        <div className="flex flex-col items-center h-20 space-y-3 text-center">
          <motion.h1 
            className={`text-4xl md:text-5xl font-black tracking-tighter uppercase transition-colors duration-500 ${isUnlocked ? 'text-slate-800 dark:text-white' : 'text-transparent bg-clip-text bg-gradient-to-b from-slate-400 to-slate-200 dark:from-slate-600 dark:to-slate-800'}`}
          >
            {isUnlocked ? "Access Granted" : "Vault Locked"}
          </motion.h1>

          <div className="h-6 overflow-hidden">
            <AnimatePresence mode='wait'>
              {!isUnlocked && (
                <motion.p 
                  key={statusIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="text-xs font-mono font-bold tracking-[0.3em] text-indigo-500 uppercase"
                >
                  {loadingStatuses[statusIndex]}
                </motion.p>
              )}
              {isUnlocked && (
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-xs font-mono font-bold tracking-[0.3em] text-emerald-500 uppercase"
                >
                  WELCOME LIBRARIAN
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 📏 PROGRESS BEAM */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-200 dark:bg-slate-900 overflow-hidden">
        <motion.div 
          style={{ width: `${progress}%` }}
          className={`h-full transition-colors duration-300 relative ${isUnlocked ? 'bg-emerald-500 shadow-[0_0_20px_#10b981]' : 'bg-indigo-600 dark:bg-indigo-500'}`}
        >
          {/* Light Glint moving across the bar */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
};

export default PageLoader;
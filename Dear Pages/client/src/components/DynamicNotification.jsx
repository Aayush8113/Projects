import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

const DynamicNotification = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 7000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed top-4 left-0 right-0 z-[9999] flex justify-center pointer-events-none px-4">
          <motion.div
            initial={{ scale: 0.8, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: -20, opacity: 0 }}
            className="pointer-events-auto flex items-center gap-4 bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-2 pr-6 rounded-[28px] shadow-2xl max-w-md"
          >
            <div className="bg-indigo-500 p-3 rounded-[22px] text-white shadow-lg shadow-indigo-500/30">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            
            <div className="flex-1 py-1">
              <p className="text-white text-[13px] font-bold leading-snug">
                {message}
              </p>
            </div>

            <button onClick={onClose} className="transition-colors text-slate-500 hover:text-white">
              <X size={16} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DynamicNotification;
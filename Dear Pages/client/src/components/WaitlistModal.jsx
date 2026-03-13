import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Ticket } from 'lucide-react';

const WaitlistModal = ({ isOpen, book, onClose, onConfirm }) => {
  const [reserverName, setReserverName] = useState('');

  useEffect(() => {
    if (isOpen) setReserverName('');
  }, [isOpen]);

  if (!isOpen || !book) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reserverName.trim()) {
      onConfirm(book._id, reserverName);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
        
        <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="relative w-full max-w-md overflow-hidden bg-white dark:bg-slate-900 shadow-2xl rounded-[32px] border border-slate-100 dark:border-slate-800 flex flex-col">
          
          <div className="relative p-6 border-b border-slate-100 dark:border-slate-800 bg-amber-50/50 dark:bg-amber-900/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400"><Ticket size={24} /></div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">Join Waitlist</h3>
                <p className="text-[10px] uppercase tracking-widest text-amber-600/70 dark:text-amber-400/70 font-bold">Reserve your spot</p>
              </div>
            </div>
            <button onClick={onClose} className="absolute p-2 transition-colors rounded-full top-6 right-6 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"><X size={20} /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-white">"{book.title}"</span> is currently with {book.borrowerName}. 
                Who should we notify when it's returned?
              </p>
            </div>

            <div className="relative group">
              <Users className="absolute transition-colors -translate-y-1/2 left-5 top-1/2 text-slate-400 group-focus-within:text-amber-500" size={20} />
              <input 
                type="text" 
                placeholder="Your Name..." 
                value={reserverName} 
                onChange={(e) => setReserverName(e.target.value)}
                className="w-full py-5 pr-6 font-bold transition-all border-2 border-transparent outline-none pl-14 rounded-3xl bg-slate-50 dark:bg-slate-950 dark:text-white focus:border-amber-500 text-slate-800"
                autoFocus
              />
            </div>

            <button type="submit" disabled={!reserverName.trim()} className="flex items-center justify-center w-full gap-2 py-4 mt-2 text-sm font-black tracking-widest text-white uppercase transition-all shadow-xl bg-slate-900 dark:bg-amber-600 rounded-[24px] hover:scale-[1.02] active:scale-95 disabled:opacity-50">
              Reserve Book
            </button>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WaitlistModal;
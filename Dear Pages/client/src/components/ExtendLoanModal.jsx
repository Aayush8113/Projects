import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarPlus, Clock } from 'lucide-react';

const ExtendLoanModal = ({ isOpen, book, onClose, onConfirm }) => {
  const [days, setDays] = useState(7);

  useEffect(() => {
    if (isOpen) setDays(7);
  }, [isOpen]);

  if (!isOpen || !book) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(book._id, days);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
        
        <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="relative w-full max-w-md overflow-hidden bg-white dark:bg-slate-900 shadow-2xl rounded-[32px] border border-slate-100 dark:border-slate-800 flex flex-col">
          
          <div className="relative p-6 border-b border-slate-100 dark:border-slate-800 bg-indigo-50/50 dark:bg-indigo-900/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400"><CalendarPlus size={24} /></div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">Extend Time</h3>
                <p className="text-[10px] uppercase tracking-widest text-indigo-600/70 dark:text-indigo-400/70 font-bold">Adjust due date</p>
              </div>
            </div>
            <button onClick={onClose} className="absolute p-2 transition-colors rounded-full top-6 right-6 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"><X size={20} /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Give <span className="font-bold text-slate-800 dark:text-white">{book.borrowerName}</span> a little extra time to finish reading <span className="italic">"{book.title}"</span>.
              </p>
            </div>

            <div className="p-6 border bg-slate-50 dark:bg-slate-950 rounded-3xl border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <p className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-slate-400"><Clock size={14}/> Extra Days</p>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">+{days}</span>
              </div>
              <input 
                type="range" min="1" max="30" value={days} onChange={(e) => setDays(e.target.value)} 
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-indigo-600" 
              />
            </div>

            <button type="submit" className="flex items-center justify-center w-full gap-2 py-4 mt-2 text-sm font-black tracking-widest text-white uppercase transition-all shadow-xl bg-slate-900 dark:bg-indigo-600 rounded-[24px] hover:scale-[1.02] active:scale-95">
              Confirm Extension
            </button>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ExtendLoanModal;
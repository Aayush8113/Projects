import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookHeart, Sparkles } from 'lucide-react';

const ReturnBookModal = ({ isOpen, book, onClose, onConfirm }) => {
  const [memoryNote, setMemoryNote] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !book) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onConfirm(book._id, memoryNote);
    setLoading(false);
    setMemoryNote('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
        <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="relative w-full max-w-lg overflow-hidden bg-white dark:bg-slate-900 shadow-2xl rounded-[32px] border border-slate-100 dark:border-slate-800 flex flex-col">
          
          <div className="relative p-6 border-b border-slate-100 dark:border-slate-800 bg-amber-50/50 dark:bg-amber-900/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400"><BookHeart size={24} /></div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">Return & Record</h3>
                <p className="text-[10px] uppercase tracking-widest text-amber-600/70 dark:text-amber-400/70 font-bold">DearPages Memory Log</p>
              </div>
            </div>
            <button onClick={onClose} className="absolute p-2 transition-colors rounded-full top-6 right-6 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"><X size={20} /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                You are returning <span className="font-bold text-slate-800 dark:text-white">"{book.title}"</span>. 
                What memory or feeling did this book leave behind?
              </p>
            </div>

            <div className="space-y-1.5 group">
              <textarea 
                className="w-full px-4 py-4 text-sm font-medium transition-all border-2 outline-none resize-none border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-2xl text-slate-800 dark:text-white focus:border-amber-500 h-32 placeholder:text-slate-400 leading-relaxed custom-scrollbar" 
                placeholder="e.g., Read this during the rainy trip to Manali. It completely changed how I view friendships..." 
                value={memoryNote} 
                onChange={(e) => setMemoryNote(e.target.value)} 
              />
            </div>

            <button type="submit" disabled={loading} className="flex items-center justify-center w-full gap-2 py-4 mt-2 text-sm font-black tracking-widest text-white uppercase transition-all shadow-xl bg-slate-900 dark:bg-amber-600 rounded-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-50">
              <Sparkles size={16} /> {loading ? "Locking Memory..." : "Save Memory & Return"}
            </button>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReturnBookModal;
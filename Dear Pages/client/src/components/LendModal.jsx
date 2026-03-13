import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ShieldCheck, Clock, Phone } from 'lucide-react';

const relationships = [
  { id: 'Dad', label: 'Dad', icon: '👨‍💼', color: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'Mom', label: 'Mom', icon: '👩‍🍳', color: 'bg-pink-50 dark:bg-pink-900/20' },
  { id: 'Sister', label: 'Sister', icon: '💅', color: 'bg-purple-50 dark:bg-purple-900/20' },
  { id: 'Brother', label: 'Brother', icon: '🎮', color: 'bg-orange-50 dark:bg-orange-900/20' },
  { id: 'Uncle', label: 'Uncle', icon: '🕶️', color: 'bg-slate-100 dark:bg-slate-800' },
  { id: 'Aunt', label: 'Aunt', icon: '☕', color: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { id: 'Friend', label: 'Friend', icon: '🤝', color: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { id: 'Cousin', label: 'Cousin', icon: '🤜', color: 'bg-cyan-50 dark:bg-cyan-900/20' },
];

const LendModal = ({ isOpen, book, onClose, onLend }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRel, setSelectedRel] = useState('');
  const [duration, setDuration] = useState(14); 

  useEffect(() => {
    if (isOpen) { setName(''); setPhone(''); setSelectedRel(''); setDuration(14); }
  }, [isOpen]);

  if (!isOpen || !book) return null;

  const handleConfirm = (e) => {
    e.preventDefault();
    if (name.trim() && selectedRel) {
      onLend(name, selectedRel, duration, phone); 
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800">
          <div className="p-8">
            <header className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">Lend Book</h2>
                <p className="font-medium text-slate-500 dark:text-slate-400">
                  Lending: <span className="italic font-bold text-indigo-600 dark:text-indigo-400">"{book?.title || 'this book'}"</span>
                </p>
              </div>
              <button onClick={onClose} className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-full text-slate-400"><X size={20} /></button>
            </header>

            <div className="space-y-6">
              <div className="relative group">
                <User className="absolute transition-colors -translate-y-1/2 left-5 top-1/2 text-slate-400 group-focus-within:text-indigo-500" size={20} />
                <input type="text" placeholder="Who is taking it?" value={name} onChange={(e) => setName(e.target.value)} className="w-full py-5 pr-6 font-bold transition-all border-2 border-transparent outline-none pl-14 rounded-3xl bg-slate-50 dark:bg-slate-950 dark:text-white focus:border-indigo-500" />
              </div>

              <div className="relative group">
                <Phone className="absolute transition-colors -translate-y-1/2 left-5 top-1/2 text-slate-400 group-focus-within:text-emerald-500" size={20} />
                <input type="tel" placeholder="WhatsApp Number (e.g. +919876543210)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full py-5 pr-6 font-bold transition-all border-2 border-transparent outline-none pl-14 rounded-3xl bg-slate-50 dark:bg-slate-950 dark:text-white focus:border-emerald-500" />
              </div>

              <div className="p-5 border bg-slate-50 dark:bg-slate-950 rounded-3xl border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <p className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-slate-400"><Clock size={14}/> Borrow Duration</p>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{duration} Days</span>
                </div>
                <input type="range" min="1" max="60" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-indigo-600" />
              </div>

              <div>
                <p className="px-2 mb-4 text-[10px] font-black tracking-widest uppercase text-slate-400">Select Relation</p>
                <div className="grid grid-cols-4 gap-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                  {relationships.map((rel) => (
                    <button key={rel.id} type="button" onClick={() => setSelectedRel(rel.id)} className={`group p-3 rounded-[24px] flex flex-col items-center gap-1 transition-all duration-300 ${selectedRel === rel.id ? 'ring-2 ring-indigo-600 bg-indigo-600 shadow-lg text-white' : `${rel.color} hover:scale-105 text-slate-600 dark:text-slate-300`}`}>
                      <span className="text-xl group-hover:animate-bounce">{rel.icon}</span>
                      <span className="text-[9px] font-black uppercase tracking-tighter">{rel.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="button" onClick={handleConfirm} disabled={!name.trim() || !selectedRel} className="w-full bg-slate-950 dark:bg-white dark:text-slate-950 text-white py-5 rounded-[24px] font-black text-lg shadow-xl hover:bg-indigo-600 disabled:opacity-30 flex items-center justify-center gap-3">
                Let's Lend It <ShieldCheck size={22} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default LendModal;
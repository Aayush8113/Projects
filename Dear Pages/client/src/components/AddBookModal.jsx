import React, { useState, useContext } from 'react';
import { X, Tag, Lightbulb, Sparkles, Loader2, PenTool, Library } from 'lucide-react';
import client from '../api/client';
import { LibraryContext } from '../context/LibraryContext';
import { useUI } from '../context/UIContext'; 

const AddBookModal = ({ isOpen, onClose }) => {
  const { refreshBooks } = useContext(LibraryContext);
  const { showToast } = useUI();
  
  const [formData, setFormData] = useState({
    title: '', author: '', category: '', coreConcept: '', status: 'Next Up'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleAiAnalyze = async () => {
    if (!formData.title) return showToast("⚠️ Please write a Book Title first!");

    setIsAnalyzing(true);
    try {
      const { data } = await client.post('/books/ai/analyze', {
        title: formData.title, author: formData.author
      });

      if (data.success) {
        const wasCorrected = data.data.title !== formData.title;
        setFormData(prev => ({
          ...prev,
          title: data.data.title || prev.title,   
          author: data.data.author || prev.author, 
          category: data.data.category,
          coreConcept: data.data.coreConcept
        }));

        wasCorrected ? showToast("✨ AI fixed your typos & added details!") : showToast("✨ AI successfully analyzed!");
      }
    } catch (err) {
      showToast(`❌ ${err.response?.data?.message || "AI is busy. Type manually."}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/books', formData);
      refreshBooks();
      onClose();
      setFormData({ title: '', author: '', category: '', coreConcept: '', status: 'Next Up' });
      showToast("📚 Volume added to your Vault!");
    } catch (err) {
      showToast("❌ Error adding book.");
    }
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md transition-all duration-300">
      <div className="w-full max-w-lg overflow-hidden bg-white dark:bg-slate-950 shadow-2xl rounded-[32px] border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        <div className="relative p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400"><Library size={24} /></div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">Add Volume</h3>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">New Entry</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute p-2 transition-colors rounded-full top-6 right-6 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-indigo-500 transition-colors">Title</label>
                <input required className="w-full px-4 py-3.5 text-sm font-bold border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-slate-800 dark:text-white focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:font-normal placeholder:text-slate-400" placeholder="e.g. Atomic Habits" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-indigo-500 transition-colors">Author</label>
                <input className="w-full px-4 py-3.5 text-sm font-bold border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-slate-800 dark:text-white focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:font-normal placeholder:text-slate-400" placeholder="e.g. James Clear" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} />
              </div>
            </div>

            <div className="flex items-center justify-between p-1 pl-4 border border-indigo-100 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700">
              <p className="text-[10px] font-medium text-indigo-600 dark:text-indigo-300"><Sparkles size={10} className="inline mr-1" /> Let AI fix typos & fill details</p>
              <button type="button" onClick={handleAiAnalyze} disabled={isAnalyzing || !formData.title} className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-white uppercase tracking-wider transition-all bg-indigo-600 dark:bg-indigo-500 rounded-xl shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95">
                {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                {isAnalyzing ? "Analyzing..." : "Auto-Fill"}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5 group">
              <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-pink-500 transition-colors"><Tag size={12} /> Shelf Category</label>
              <input required className="w-full px-4 py-3.5 text-sm font-medium border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-slate-800 dark:text-white focus:border-pink-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-400" placeholder="e.g. Productivity & Psychology" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
            </div>

            <div className="space-y-1.5 group">
              <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-amber-500 transition-colors"><Lightbulb size={12} /> Core Concept</label>
              <textarea className="w-full px-4 py-3.5 text-sm font-medium border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-slate-800 dark:text-white focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 outline-none resize-none h-24 transition-all placeholder:text-slate-400 leading-relaxed" placeholder="The key insight..." value={formData.coreConcept} onChange={(e) => setFormData({...formData, coreConcept: e.target.value})} />
            </div>
          </div>

          <div className="pt-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 mb-2 block">Initial Status</label>
             <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
               {['Next Up', 'All Books', 'Dream Books'].map((status) => (
                 <button key={status} type="button" onClick={() => setFormData({...formData, status})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${formData.status === status ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>{status}</button>
               ))}
             </div>
          </div>

          <button type="submit" className="w-full py-4 mt-2 text-sm font-black text-white uppercase tracking-[0.2em] transition-all bg-slate-900 dark:bg-white dark:text-slate-900 shadow-xl rounded-2xl hover:scale-[1.02] active:scale-95 hover:bg-indigo-600 dark:hover:bg-indigo-50 flex items-center justify-center gap-2">
            <PenTool size={16} /> Add to Shelf
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;
import React, { useState, useEffect, useContext } from 'react';
import { Sparkles, ArrowRight, RefreshCw, Plus, Loader2, BookTemplate, Globe } from 'lucide-react';
import client from '../api/client';
import { LibraryContext } from '../context/LibraryContext';
import { useUI } from '../context/UIContext';

const AISpotlight = () => {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  
  const { refreshBooks } = useContext(LibraryContext);
  const { showToast } = useUI();

  const fetchSuggestion = async () => {
    setLoading(true);
    try {
      const { data } = await client.get(`/books/ai/suggest?t=${Date.now()}`);
      if (data.success) setSuggestion(data.recommendation);
    } catch (err) {
      console.error("AI Trend Error", err);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  const handleAddSuggested = async () => {
    if (!suggestion) return;
    setAdding(true);
    try {
      const analyzeResponse = await client.post('/books/ai/analyze', { 
        title: suggestion.title, 
        author: suggestion.author 
      });

      const details = analyzeResponse.data.data;

      await client.post('/books', {
        title: suggestion.title,
        author: suggestion.author,
        category: details.category || "Trending",
        coreConcept: details.coreConcept || "A current global sensation.",
        status: 'Next Up'
      });

      refreshBooks();
      showToast(`✨ Added "${suggestion.title}" to your Vault!`);
      fetchSuggestion(); 

    } catch (err) {
      showToast("❌ Failed to add book. Try manual entry.");
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => { fetchSuggestion(); }, []);

  if (!suggestion && !loading) return null;

  const todayDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="relative p-1 mb-12 overflow-hidden rounded-[42px] group">
      <div className="absolute inset-0 transition-opacity duration-1000 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-40 group-hover:opacity-100 blur-xl animate-pulse"></div>
      
      <div className="relative p-8 md:p-10 bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
        
        <div className="absolute top-0 right-0 w-64 h-64 -mt-20 -mr-20 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 -mb-20 -ml-20 rounded-full bg-pink-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 px-4 py-2 border rounded-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 backdrop-blur-md">
            <Globe className="w-4 h-4 text-indigo-500 animate-spin-slow" />
            <span className="text-[10px] font-black tracking-[0.15em] uppercase text-slate-600 dark:text-slate-300">
              Global Trend • {todayDate}
            </span>
          </div>
          
          <button 
            onClick={fetchSuggestion} 
            disabled={loading}
            className={`p-3 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-90 group/refresh ${loading ? 'cursor-not-allowed' : ''}`}
            title="Get new suggestion"
          >
            <RefreshCw size={18} className={`text-slate-500 dark:text-slate-400 group-hover/refresh:text-indigo-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:items-start">
          
          <div className="relative shrink-0">
            <div className={`w-32 h-48 md:w-40 md:h-60 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-xl flex items-center justify-center border border-white/50 dark:border-slate-700 transition-all duration-500 ${loading ? 'scale-95 blur-sm opacity-70' : 'scale-100 opacity-100'}`}>
              {loading ? (
                <Loader2 className="text-slate-400 animate-spin" size={32} />
              ) : (
                <div className="p-4 text-center">
                  <BookTemplate className="w-12 h-12 mx-auto mb-2 text-indigo-300 dark:text-slate-600" strokeWidth={1} />
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 line-clamp-2">
                    {suggestion?.title}
                  </p>
                </div>
              )}
            </div>
            <div className="absolute h-4 rounded-full inset-x-4 -bottom-4 bg-black/20 blur-xl"></div>
          </div>
          
          <div className="flex flex-col justify-center flex-1 h-full py-2 text-center md:text-left">
            {loading ? (
              <div className="w-full space-y-4 animate-pulse">
                <div className="w-3/4 h-12 mx-auto bg-slate-200 dark:bg-slate-800 rounded-2xl md:mx-0" />
                <div className="w-1/2 h-6 mx-auto bg-slate-100 dark:bg-slate-800/50 rounded-xl md:mx-0" />
                <div className="w-1/3 h-10 mx-auto mt-6 bg-slate-200 dark:bg-slate-800 rounded-2xl md:mx-0" />
              </div>
            ) : (
              <div className="duration-500 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-3xl md:text-5xl font-black leading-[0.95] tracking-tighter text-slate-900 dark:text-white mb-3">
                  {suggestion?.title}
                </h2>
                <p className="flex items-center justify-center gap-3 mb-8 text-lg font-bold text-slate-400 dark:text-slate-500 md:justify-start">
                  <span className="w-8 h-[2px] bg-indigo-500"></span>
                  {suggestion?.author}
                </p>
                
                <button 
                  onClick={handleAddSuggested}
                  disabled={adding}
                  className="flex items-center gap-3 px-8 py-4 mx-auto font-black text-white transition-all shadow-xl bg-slate-900 dark:bg-indigo-600 md:mx-0 rounded-2xl hover:scale-105 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                >
                  {adding ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} className="transition-transform group-hover/btn:rotate-90" />}
                  {adding ? 'Adding to Vault...' : 'Add This Trend'} 
                  {!adding && <ArrowRight size={20} className="ml-1 transition-transform group-hover/btn:translate-x-1" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISpotlight;
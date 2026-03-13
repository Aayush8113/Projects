import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import ReturnBookModal from '../components/ReturnBookModal';
import client from '../api/client';
import { Clock, User as UserIcon, Calendar, ArrowLeft, BookOpen, MessageCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LibraryContext } from '../context/LibraryContext';

const LentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshBooks } = useContext(LibraryContext);

  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [bookToReturn, setBookToReturn] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data } = await client.get('/books/history/lent');
      setHistory(data.data);
    } catch (err) {
      console.error("History fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const triggerReturn = (book) => {
    setBookToReturn(book);
    setReturnModalOpen(true);
  };

  const handleConfirmReturn = async (bookId, memoryNote) => {
    try {
      await client.patch(`/books/${bookId}/return`, { memoryNote });
      setHistory(prev => prev.filter(item => item._id !== bookId));
      refreshBooks();
      setReturnModalOpen(false);
      setBookToReturn(null);
    } catch (err) {
      console.error("Return failed", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300 lg:flex-row bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      
      <main className="flex-1 w-full p-4 pt-24 overflow-y-auto lg:p-8 lg:pt-8">
        <header className="mb-10">
          <Link to="/" className="flex items-center gap-2 mb-4 text-sm font-bold text-indigo-600 transition-transform dark:text-indigo-400 hover:-translate-x-1 w-fit">
            <ArrowLeft size={16} /> Back to Vault
          </Link>
          <h1 className="text-3xl font-black leading-none tracking-tight uppercase lg:text-4xl text-slate-900 dark:text-white">
            Lending Timeline
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400 lg:text-base">
            Manage books currently traveling through the family.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 mb-4 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin dark:border-indigo-500"></div>
            <p className="text-xs font-black tracking-widest uppercase text-slate-400">Syncing Vault...</p>
          </div>
        ) : (
          <div className="max-w-4xl space-y-4">
            <AnimatePresence>
              {history.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="p-10 lg:p-20 text-center bg-white border-2 border-dashed rounded-[40px] dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600">
                    <Clock size={40} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold tracking-tighter uppercase text-slate-800 dark:text-white">Vault is Empty!</h3>
                  <p className="max-w-xs mx-auto font-medium text-slate-400 dark:text-slate-500">All books are safely returned and resting on the shelf.</p>
                </motion.div>
              ) : (
                history.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                    key={item._id} 
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 transition-all bg-white border shadow-sm group rounded-[32px] dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:shadow-xl dark:hover:shadow-black/40 gap-4"
                  >
                    <div className="flex items-center w-full gap-4 lg:gap-6 sm:w-auto">
                      <div className="relative flex flex-col items-center justify-center flex-shrink-0 w-12 h-16 overflow-hidden border border-indigo-100 shadow-inner lg:h-20 lg:w-14 bg-indigo-50 dark:bg-slate-800 dark:border-slate-700 rounded-xl">
                        <BookOpen className="text-indigo-600 dark:text-indigo-400" size={20} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="mb-2 text-lg font-black leading-tight truncate transition-colors text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {item.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                            <UserIcon size={12} className="text-slate-500 dark:text-slate-400" />
                            <span className="text-[10px] lg:text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[100px]">
                              {item.borrowerName} <span className="font-medium text-slate-400">({item.borrowerRelationship})</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
                            <Calendar size={12} className="text-indigo-500 dark:text-indigo-400" />
                            <span className="text-[10px] lg:text-xs font-bold text-indigo-700 dark:text-indigo-300">
                              {new Date(item.dateLent).toLocaleDateString()}
                            </span>
                          </div>
                          {item.dueDate && (
                             <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-900/30">
                               <Clock size={12} className="text-rose-500 dark:text-rose-400" />
                               <span className="text-[10px] lg:text-xs font-bold text-rose-700 dark:text-rose-300">
                                 Due: {new Date(item.dueDate).toLocaleDateString()}
                               </span>
                             </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center w-full gap-3 mt-2 sm:w-auto sm:mt-0">
                      <a 
                        href={item.borrowerPhone ? `https://wa.me/${item.borrowerPhone.replace(/\D/g, '')}?text=Hey! Just checking in on my book "${item.title}"` : `https://wa.me/?text=Hey! Just checking in on my book "${item.title}"`}
                        target="_blank" rel="noreferrer"
                        className="p-3 transition-all transform bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white active:scale-90 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-indigo-500 dark:hover:text-white"
                        title="Remind on WhatsApp"
                      >
                        <MessageCircle size={20} />
                      </a>
                      
                      <button 
                        onClick={() => triggerReturn(item)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 text-[10px] font-black tracking-widest text-white uppercase transition-all shadow-lg bg-slate-900 rounded-2xl hover:bg-emerald-600 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-emerald-500 dark:hover:text-white whitespace-nowrap"
                      >
                        <CheckCircle size={14} /> Mark Returned
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      <ReturnBookModal 
        isOpen={returnModalOpen}
        book={bookToReturn}
        onClose={() => { setReturnModalOpen(false); setBookToReturn(null); }}
        onConfirm={handleConfirmReturn}
      />
    </div>
  );
};

export default LentHistory;
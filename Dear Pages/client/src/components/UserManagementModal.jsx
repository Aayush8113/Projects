  import React, { useState, useEffect } from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import { X, RefreshCw, Trash2 } from 'lucide-react';
  import client from '../api/client';

  const UserManagementModal = ({ isOpen, user, onClose, onRefresh }) => {
    const [userBooks, setUserBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (isOpen && user) {
        const fetchUserData = async () => {
          setLoading(true);
          try {
            const { data } = await client.get(`/admin/users/${user._id}/books`);
            setUserBooks(data.data);
          } catch (err) { console.error(err); } 
          finally { setLoading(false); }
        };
        fetchUserData();
      }
    }, [isOpen, user]);

    const handleReturn = async (bookId) => {
      try {
        await client.patch(`/admin/books/${bookId}/return`);
        onRefresh(); 
        onClose();   
      } catch (err) { alert("Failed to return book"); }
    };

    if (!isOpen) return null;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
          
          <motion.div 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Managing {user?.name}</h2>
                  <p className="font-medium text-slate-500 dark:text-slate-400">System ID: {user?._id}</p>
                </div>
                <button onClick={onClose} className="p-2 transition-colors rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                  <p className="py-10 italic font-bold text-center text-slate-400">Scanning user vault...</p>
                ) : (
                  userBooks.map(book => (
                    <div key={book._id} className="flex items-center justify-between p-5 border bg-slate-50 dark:bg-slate-950 rounded-3xl border-slate-100 dark:border-slate-800">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">{book.title}</h4>
                        <p className="text-xs font-bold uppercase text-slate-400">{book.status}</p>
                      </div>
                      <div className="flex gap-2">
                        {book.status === 'With Friends' && (
                          <button onClick={() => handleReturn(book._id)} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white transition-all bg-indigo-600 rounded-xl hover:bg-indigo-700">
                            <RefreshCw size={14} /> Force Return
                          </button>
                        )}
                        <button className="p-2 transition-all bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  };

  export default UserManagementModal;
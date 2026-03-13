import React, { useState, useContext, useMemo, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import AISpotlight from '../components/AISpotlight';
import LendModal from '../components/LendModal';
import AddBookModal from '../components/AddBookModal';
import VirtualShelf from '../components/VirtualShelf';
import WaitlistModal from '../components/WaitlistModal';
import ExtendLoanModal from '../components/ExtendLoanModal';
import { LibraryContext } from '../context/LibraryContext';
import { AuthContext } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Plus, BookOpen, Search, LayoutGrid, ArrowRightLeft, MessageCircle, CalendarPlus, AlertCircle, Users, Clock, Bookmark } from 'lucide-react';
import client from '../api/client';

const pseudoRandom = (seed) => {
  let value = 0;
  for (let i = 0; i < seed.length; i++) value += seed.charCodeAt(i);
  return value;
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const DashboardContent = ({ filter }) => {
  const { books, refreshBooks } = useContext(LibraryContext);
  const { user } = useContext(AuthContext);
  const { showToast } = useUI();
  
  // Modal States
  const [isLendModalOpen, setIsLendModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  
  const [selectedBook, setSelectedBook] = useState(null);
  const [actionBook, setActionBook] = useState(null); // For Waitlist & Extend modals
  const [isTransferring, setIsTransferring] = useState(false);
  
  const [viewMode, setViewMode] = useState('grid'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(filter || 'All Books');
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredBooks = useMemo(() => {
    if (!books) return [];
    return books.filter(book => {
      const matchesTab = activeTab === 'All Books' ? true : book.status === activeTab;
      const lowerQuery = debouncedSearch.toLowerCase();
      const matchesSearch = book.title?.toLowerCase().includes(lowerQuery) || book.author?.toLowerCase().includes(lowerQuery);
      return matchesTab && matchesSearch;
    });
  }, [books, activeTab, debouncedSearch]);

  const groupedGridBooks = useMemo(() => {
    const groups = {};
    filteredBooks.forEach(book => {
      const key = activeTab === 'All Books' ? book.status : (book.category || 'Uncategorized');
      if (!groups[key]) groups[key] = [];
      groups[key].push(book);
    });

    if (activeTab === 'All Books') {
      const order = ['Reading Now', 'Next Up', 'With Friends', 'All Books', 'Dream Books'];
      const sortedGroups = {};
      order.forEach(status => {
        if (groups[status]) sortedGroups[status] = groups[status];
      });
      return sortedGroups;
    }
    
    return groups;
  }, [filteredBooks, activeTab]);

  const stats = useMemo(() => ({
    reading: books?.filter(b => b.status === 'Reading Now' || b.status === 'Next Up').length || 0,
    lent: books?.filter(b => b.status === 'With Friends').length || 0,
    total: books?.length || 0
  }), [books]);

  const dueSoonAlerts = useMemo(() => {
    if (!books) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);

    return books.filter(b => {
      if (b.status !== 'With Friends' || !b.dueDate) return false;
      const due = new Date(b.dueDate);
      due.setHours(0, 0, 0, 0);
      return due <= threeDaysFromNow; 
    });
  }, [books]);

  // --- TRIGGERS FOR MODALS ---
  const openLend = (book, transfer = false) => {
    if (!book) return;
    setSelectedBook(book);
    setIsTransferring(transfer);
    setIsLendModalOpen(true);
  };

  const triggerReserveBook = (book) => {
    setActionBook(book);
    setIsWaitlistModalOpen(true);
  };

  const triggerExtendLoan = (book) => {
    setActionBook(book);
    setIsExtendModalOpen(true);
  };

  // --- API CONFIRMATION HANDLERS ---
  const handleLendSubmit = async (name, rel, duration, phone) => {
    if (!selectedBook?._id) return;
    try {
      const endpoint = isTransferring ? `/books/${selectedBook._id}/transfer` : `/books/${selectedBook._id}/lend`;
      const payload = isTransferring 
        ? { newBorrowerName: name, newBorrowerRelationship: rel, durationDays: duration } 
        : { borrowerName: name, borrowerRelationship: rel, durationDays: duration, borrowerPhone: phone }; 

      const { data } = await client.patch(endpoint, payload);
      showToast(isTransferring ? `🔄 Transferred to ${name}` : data.notification);
      setIsLendModalOpen(false);
      setSelectedBook(null);
      setIsTransferring(false);
      refreshBooks();
    } catch (err) {
      showToast(`❌ ${err.response?.data?.message || "Action failed."}`);
    }
  };

  const handleConfirmReserve = async (bookId, reserverName) => {
    try {
      const { data } = await client.post(`/books/${bookId}/reserve`, { reserverName });
      showToast(`🎟️ ${data.message}`);
      setIsWaitlistModalOpen(false);
      setActionBook(null);
      refreshBooks();
    } catch (err) {
      showToast(`❌ ${err.response?.data?.message || "Waitlist full."}`);
    }
  };

  const handleConfirmExtend = async (bookId, days) => {
    try {
      const { data } = await client.patch(`/books/${bookId}/extend`, { additionalDays: days });
      showToast(`⏳ ${data.message}`);
      setIsExtendModalOpen(false);
      setActionBook(null);
      refreshBooks();
    } catch (err) {
      showToast(`❌ Failed to extend loan.`);
    }
  };

  const tabs = ['All Books', 'Next Up', 'Reading Now', 'Dream Books'];

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300 lg:flex-row bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      
      <main className="flex-1 w-full p-4 pt-24 overflow-y-auto lg:p-8 lg:pt-8">
        <div className="responsive-container">
          
          <header className="flex flex-col gap-6 mb-8 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-3xl font-black leading-tight tracking-tighter lg:text-4xl text-slate-900 dark:text-white">
                {user?.name?.split(' ')[0]}'s Vault
              </h2>
              <p className="font-bold text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-widest mt-1">
                Master Librarian Console
              </p>
            </div>
            
            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1 group sm:flex-none">
                <Search className="absolute transition-colors -translate-y-1/2 left-4 top-1/2 text-slate-400 group-focus-within:text-indigo-600" size={18} />
                <input placeholder="Search vault..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full py-3 pl-12 pr-4 transition-all bg-white border-none shadow-sm outline-none sm:w-64 dark:bg-slate-900 dark:shadow-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 placeholder-slate-400" />
              </div>
              <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center gap-2 px-6 py-3 font-black text-white transition-all shadow-xl bg-slate-900 dark:bg-indigo-600 rounded-2xl hover:bg-indigo-600 dark:hover:bg-indigo-500 active:scale-95 shadow-indigo-500/20">
                <Plus size={20} /> Add Book
              </button>
            </div>
          </header>

          {/* DYNAMIC ALERTS */}
          {dueSoonAlerts.length > 0 && !filter && (
            <div className="mb-10 space-y-3">
              {dueSoonAlerts.map(book => {
                const today = new Date();
                today.setHours(0,0,0,0);
                const due = new Date(book.dueDate);
                due.setHours(0,0,0,0);
                
                const diffTime = due - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                let timingText = "";
                if (diffDays < 0) timingText = `Overdue by ${Math.abs(diffDays)} Days`;
                else if (diffDays === 0) timingText = "Due Today!";
                else if (diffDays === 1) timingText = "Due Tomorrow";
                else timingText = `${diffDays} Days Left`;

                const isOverdue = diffDays < 0;
                const hasWaitlist = book.waitlist?.length > 0;
                
                let waText = `Hey ${book.borrowerName}! Hope you're enjoying "${book.title}". Just a heads up, it's ${isOverdue ? 'overdue' : 'due back soon'}.`;
                if (hasWaitlist) waText += ` Also, there are ${book.waitlist.length} people on the waitlist for it! Let me know when you can pass it along. 📚`;
                else waText += ` Let me know if you need more time! 📚`;
                
                const waMessage = encodeURIComponent(waText);

                return (
                  <div key={book._id} className={`p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 border shadow-sm ${isOverdue ? 'bg-rose-50 border-rose-200 dark:bg-rose-900/10 dark:border-rose-800/30' : 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/30'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-2xl ${isOverdue ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                        <AlertCircle size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`text-sm font-black tracking-tight uppercase ${isOverdue ? 'text-rose-700 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'}`}>
                            {timingText}
                          </h4>
                          {hasWaitlist && (
                            <span className="px-2 py-0.5 text-[9px] font-black text-white bg-orange-500 rounded-md uppercase tracking-wider animate-pulse">
                              {book.waitlist.length} Waiting
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          <span className="font-bold">"{book.title}"</span> is with {book.borrowerName}.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <button onClick={() => triggerExtendLoan(book)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 text-xs font-black text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95">
                        <CalendarPlus size={16} /> Extend Loan
                      </button>
                      <a href={book.borrowerPhone ? `https://wa.me/${book.borrowerPhone.replace(/\D/g, '')}?text=${waMessage}` : `https://wa.me/?text=${waMessage}`} target="_blank" rel="noreferrer" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 text-xs font-black text-white bg-[#25D366] rounded-xl hover:bg-[#20bd5a] transition-all shadow-lg shadow-[#25D366]/20 active:scale-95">
                        <MessageCircle size={16} /> WhatsApp
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {!filter && <AISpotlight />}

          <div className="grid grid-cols-1 gap-4 mb-12 sm:grid-cols-3 lg:gap-6">
             <StatCard label="Shelf Stack" value={stats.reading} color="text-indigo-600 dark:text-indigo-400" />
             <StatCard label="Borrowed" value={stats.lent} color="text-amber-600 dark:text-amber-400" />
             <StatCard label="Total Items" value={stats.total} color="text-slate-900 dark:text-white" />
          </div>

          <section className="pb-20">
            <div className="flex gap-2 p-1.5 mb-8 overflow-x-auto bg-slate-200/50 dark:bg-slate-900 rounded-2xl custom-scrollbar border border-slate-200 dark:border-slate-800 w-fit">
              {tabs.map((tab) => (
                <button 
                  key={tab} onClick={() => setActiveTab(tab)} 
                  className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-8">
              <h3 className="flex items-center gap-2 text-xl font-black tracking-tight lg:text-2xl text-slate-800 dark:text-white">
                <BookOpen className="text-indigo-600 dark:text-indigo-400" /> {activeTab} Collection
              </h3>
              <div className="flex p-1 bg-slate-200/50 dark:bg-slate-900 rounded-2xl">
                  <ViewToggle icon={LayoutGrid} active={viewMode === 'grid'} onClick={() => setViewMode('grid')} />
                  <ViewToggle icon={BookOpen} active={viewMode === 'shelf'} onClick={() => setViewMode('shelf')} />
              </div>
            </div>

            {filteredBooks.length === 0 ? (
              <div className="py-32 text-center bg-white dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                 <p className="text-xs font-bold tracking-widest uppercase text-slate-400">No stories found in '{activeTab}' yet</p>
              </div>
            ) : (
              viewMode === 'shelf' ? (
                <VirtualShelf books={filteredBooks} onBookClick={(book) => openLend(book, false)} groupBy={activeTab === 'All Books' ? 'status' : 'category'} />
              ) : (
                <div className="space-y-12">
                  {Object.entries(groupedGridBooks).map(([groupName, groupBooks]) => (
                    <div key={groupName} className="space-y-6">
                       
                       <h4 className="flex items-center gap-3 text-sm font-black tracking-widest uppercase text-slate-800 dark:text-slate-200">
                         <span className="w-8 h-[2px] bg-indigo-500 rounded-full"></span>
                         {groupName}
                       </h4>
                       
                       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5">
                         {groupBooks.map(book => (
                           <BookCard 
                             key={book._id} book={book} 
                             onLend={() => openLend(book, false)} 
                             onTransfer={() => openLend(book, true)}
                             onReserve={() => triggerReserveBook(book)}
                             onExtend={() => triggerExtendLoan(book)}
                           />
                         ))}
                       </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </section>
        </div>
      </main>

      {/* --- ALL MODALS ATTACHED HERE --- */}
      <AddBookModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <LendModal isOpen={isLendModalOpen} book={selectedBook} onClose={() => { setIsLendModalOpen(false); setSelectedBook(null); setIsTransferring(false); }} onLend={handleLendSubmit} />
      
      <WaitlistModal isOpen={isWaitlistModalOpen} book={actionBook} onClose={() => { setIsWaitlistModalOpen(false); setActionBook(null); }} onConfirm={handleConfirmReserve} />
      <ExtendLoanModal isOpen={isExtendModalOpen} book={actionBook} onClose={() => { setIsExtendModalOpen(false); setActionBook(null); }} onConfirm={handleConfirmExtend} />
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all text-center sm:text-left">
    <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1 tracking-widest">{label}</p>
    <h3 className={`text-3xl lg:text-4xl font-black ${color}`}>{value}</h3>
  </div>
);

const BookCard = ({ book, onLend, onTransfer, onReserve, onExtend }) => {
  const isBorrowed = book.status === 'With Friends';
  
  const seed = pseudoRandom(book.title || "book");
  const gradients = [
    'from-rose-500 to-rose-400', 'from-indigo-500 to-indigo-400', 
    'from-amber-500 to-amber-400', 'from-emerald-500 to-emerald-400', 
    'from-cyan-500 to-cyan-400', 'from-purple-500 to-purple-400'
  ];
  const accentColor = gradients[seed % gradients.length];
  const waitlistCount = book.waitlist?.length || 0;

  return (
    <div className="flex flex-col overflow-hidden transition-all bg-white border shadow-sm group dark:bg-slate-900 rounded-[28px] border-slate-100 dark:border-slate-800 hover:shadow-2xl dark:hover:shadow-indigo-500/10">
      <div className={`h-2 w-full bg-gradient-to-r ${accentColor}`}></div>
      
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2 rounded-xl ${isBorrowed ? 'bg-rose-50 text-rose-500 dark:bg-rose-900/30' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
            <Bookmark size={18} />
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${isBorrowed ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
              {isBorrowed ? `With ${book.borrowerName}` : book.status}
            </span>
            {waitlistCount > 0 && (
              <span className="text-[8px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded animate-pulse">
                {waitlistCount} Waiting
              </span>
            )}
          </div>
        </div>

        <h4 className="mb-1 text-xl font-bold leading-tight transition-colors font-serif text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2">
          {book.title}
        </h4>
        <p className="mb-6 text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-1">{book.author}</p>
        
        <div className="mt-auto space-y-2">
          {isBorrowed ? (
            <>
              {book.dueDate && (
                <div className="flex items-center justify-between mb-3 text-[10px] font-black tracking-widest uppercase text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1.5"><Clock size={12} /> Due: {new Date(book.dueDate).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={onTransfer} className="flex-1 py-3 text-[10px] font-black text-white transition-all bg-slate-900 dark:bg-slate-700 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 active:scale-95 flex items-center justify-center gap-1.5 uppercase tracking-wider">
                  <ArrowRightLeft size={14} /> Pass On
                </button>
                <button onClick={onExtend} className="flex-1 py-3 text-[10px] font-black text-slate-700 dark:text-slate-200 transition-all bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 flex items-center justify-center gap-1.5 uppercase tracking-wider">
                  <CalendarPlus size={14} /> Extend
                </button>
              </div>
              <button onClick={onReserve} className="w-full py-3 text-[10px] font-black text-amber-900 transition-all bg-amber-100 rounded-xl hover:bg-amber-200 active:scale-95 flex items-center justify-center gap-1.5 uppercase tracking-wider mt-2">
                <Users size={14} /> Join Waitlist
              </button>
            </>
          ) : (
            <button onClick={onLend} className="flex items-center justify-center w-full gap-2 py-3 text-xs font-black text-white transition-all bg-indigo-600 shadow-md rounded-xl hover:bg-indigo-700 hover:shadow-indigo-500/25 active:scale-95 uppercase tracking-wider">
              <ArrowRightLeft size={16} /> Lend Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ViewToggle = ({ icon: Icon, active, onClick }) => (
  <button onClick={onClick} className={`p-2.5 rounded-xl transition-all ${active ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300'}`}>
    <Icon size={20}/>
  </button>
);

export default DashboardContent;
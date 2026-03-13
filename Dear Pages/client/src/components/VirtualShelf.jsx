import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

const pseudoRandom = (seed) => {
  let value = 0;
  for (let i = 0; i < seed.length; i++) value += seed.charCodeAt(i);
  return value;
};

const VirtualShelf = ({ books, onBookClick, groupBy = 'category' }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => setActiveTooltip(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleInteraction = (e, book) => {
    e.stopPropagation(); 
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      if (activeTooltip?.book._id === book._id) {
        onBookClick(book);
        setActiveTooltip(null);
      } else {
        const rect = e.currentTarget.getBoundingClientRect();
        setActiveTooltip({
          book,
          x: rect.left + rect.width / 2,
          y: rect.top 
        });
      }
    } else {
      onBookClick(book);
    }
  };

  const handleMouseEnter = (e, book) => {
    if (window.innerWidth >= 768) { 
      const rect = e.currentTarget.getBoundingClientRect();
      setActiveTooltip({
        book,
        x: rect.left + rect.width / 2,
        y: rect.top
      });
    }
  };

  // DYNAMIC GROUPING: Groups by Category OR Status based on the active tab
  const shelves = useMemo(() => {
    const groups = {};
    if (!books) return groups;
    books.forEach(book => {
      const key = book[groupBy] || "Uncategorized";
      if (!groups[key]) groups[key] = [];
      groups[key].push(book);
    });

    // If grouping by status, force a logical order
    if (groupBy === 'status') {
      const order = ['Reading Now', 'Next Up', 'With Friends', 'All Books', 'Dream Books'];
      const sortedGroups = {};
      order.forEach(status => {
        if (groups[status]) sortedGroups[status] = groups[status];
      });
      return sortedGroups;
    }

    return groups;
  }, [books, groupBy]);

  return (
    <div className="pb-20 space-y-12 md:pb-32 md:space-y-20">
      {Object.entries(shelves).map(([groupName, shelfBooks]) => (
        <div key={groupName} className="space-y-1">
          <div className="flex items-center gap-3 pl-2 mb-2 md:gap-4 md:pl-4">
            <div className="px-3 py-1 bg-gradient-to-r from-amber-100 to-amber-50 dark:from-slate-800 dark:to-slate-700 border border-amber-200 dark:border-slate-600 rounded-lg shadow-sm md:px-4 md:py-1.5">
              <h3 className="flex items-center gap-2 font-serif text-xs font-black tracking-widest uppercase text-amber-900 dark:text-amber-100 md:text-sm">
                <span className="truncate max-w-[200px] md:max-w-none">{groupName}</span>
                <span className="w-4 h-4 flex items-center justify-center bg-amber-900/10 dark:bg-white/10 rounded-full text-[9px] md:w-5 md:h-5 md:text-[10px]">
                  {shelfBooks.length}
                </span>
              </h3>
            </div>
          </div>

          <div className="relative mx-1 md:mx-2 group/shelf">
            <div className="absolute inset-0 bg-[#2c241b] dark:bg-[#0f0f0f] rounded-t-lg shadow-inner z-0 border-x-2 md:border-x-4 border-[#3e3226] dark:border-[#222]" />

            <div className="relative z-10 flex items-end px-3 md:px-6 pt-16 md:pt-24 pb-[14px] md:pb-[18px] min-h-[180px] md:min-h-[220px] overflow-x-auto custom-scrollbar perspective-1000 snap-x snap-mandatory">
              {shelfBooks.map((book, i) => (
                <div key={book._id || i} className="snap-center shrink-0">
                  <RealisticSpine 
                    book={book} 
                    index={i} 
                    onClick={(e) => handleInteraction(e, book)}
                    onMouseEnter={(e) => handleMouseEnter(e, book)}
                    onMouseLeave={() => window.innerWidth >= 768 && setActiveTooltip(null)}
                  />
                </div>
              ))}
              <div className="w-4 shrink-0" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-4 md:h-5 bg-[#d4c5b0] dark:bg-[#2a2a2a] z-20 shadow-[0_-5px_10px_rgba(0,0,0,0.3)]">
               <div className="w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
            </div>
            <div className="absolute -bottom-3 md:-bottom-4 left-0 right-0 h-3 md:h-4 bg-[#b8a58e] dark:bg-[#1f1f1f] rounded-b-md shadow-2xl z-20 border-t border-[#8c7b66] dark:border-[#333]" />
          </div>
        </div>
      ))}

      <AnimatePresence>
        {activeTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: "-90%" }} 
            animate={{ opacity: 1, scale: 1, y: "-100%" }}
            exit={{ opacity: 0, scale: 0.9, y: "-90%" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              position: 'fixed',
              left: activeTooltip.x,
              top: activeTooltip.y - 15,
              zIndex: 9999,
              x: "-50%",
            }}
            className="w-64 p-4 pointer-events-none"
          >
            <div className="relative bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl border border-slate-700/50 dark:border-slate-200/50">
              <h4 className="relative z-10 mb-1 text-sm font-black leading-snug tracking-wider uppercase text-amber-400 dark:text-indigo-600">
                {activeTooltip.book.title}
              </h4>
              <p className="text-[11px] text-slate-300 dark:text-slate-500 font-serif italic mb-3 border-b border-white/10 dark:border-slate-200/20 pb-2 relative z-10">
                by {activeTooltip.book.author}
              </p>
              
              {activeTooltip.book.coreConcept ? (
                <div className="flex gap-3 items-start bg-white/5 dark:bg-slate-100 p-2.5 rounded-lg relative z-10">
                   <Lightbulb size={16} className="text-amber-400 dark:text-indigo-500 shrink-0 mt-0.5" />
                   <p className="text-[11px] leading-relaxed opacity-90 font-medium">
                     {activeTooltip.book.coreConcept}
                   </p>
                </div>
              ) : (
                 <p className="text-[10px] opacity-50 italic relative z-10">No details added.</p>
              )}
              <div className="absolute w-4 h-4 rotate-45 -translate-x-1/2 border-b border-r bg-slate-900/95 dark:bg-white/95 left-1/2 -bottom-2 border-slate-700/50 dark:border-slate-200/50"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {books?.length === 0 && (
        <div className="py-20 text-center opacity-40 md:py-32">
          <p className="text-lg font-black tracking-widest uppercase text-slate-300 dark:text-slate-700 md:text-xl">Library Empty</p>
        </div>
      )}
    </div>
  );
};

const RealisticSpine = ({ book, onClick, onMouseEnter, onMouseLeave, index }) => {
  const seed = pseudoRandom(book.title || "book");
  const height = useMemo(() => 120 + (seed % 50), [seed]); 
  const width = useMemo(() => 28 + (seed % 14), [seed]);   
  const lean = useMemo(() => (seed % 6) - 3, [seed]);      
  
  const colorClass = useMemo(() => {
    const colors = ['bg-[#5D2E2E]', 'bg-[#2B3A42]', 'bg-[#3F4B3B]', 'bg-[#8C5E3C]', 'bg-[#1F1F1F]', 'bg-[#4A3B52]', 'bg-[#D35400]'];
    return colors[seed % colors.length];
  }, [seed]);

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ delay: index * 0.03, type: "spring", stiffness: 200 }}
      whileHover={{ y: -15, scale: 1.05, rotate: 0 }} 
      whileTap={{ scale: 0.95 }} 
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ 
        height: `${height}px`, width: `${width}px`, rotate: `${lean}deg`,
        marginLeft: '-2px', marginRight: '2px', transformOrigin: 'bottom center'
      }}
      className={`relative cursor-pointer group shrink-0 rounded-sm ${colorClass} shadow-xl transition-all duration-300 ease-out`}
    >
      <div className="absolute inset-0 rounded-sm pointer-events-none bg-gradient-to-r from-black/40 via-white/10 to-black/30" />
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')] mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 flex flex-col items-center justify-between py-2 pointer-events-none md:py-3">
        <div className="w-full h-[1px] md:h-[2px] bg-white/20 shadow-sm" />
        <div className="flex-1 flex flex-col items-center justify-center w-full px-0.5 overflow-hidden">
          <span className="text-[5px] md:text-[6px] font-serif text-amber-100/60 mb-1.5 uppercase tracking-widest">
            {(book.author || "??").split(" ").map(n => n[0]).join("")}
          </span>
          <h4 className="text-[9px] md:text-[11px] font-bold text-amber-50 drop-shadow-md text-center leading-tight [writing-mode:vertical-rl] rotate-180 line-clamp-3 uppercase tracking-wider font-serif border-y border-white/10 py-2 w-full">
            {book.title}
          </h4>
        </div>
        <div className="w-full space-y-0.5 md:space-y-1 opacity-50">
           <div className="w-full h-[1px] bg-black/30" />
           <div className="w-full h-[1px] md:h-[2px] bg-white/10" />
           <div className="w-full h-[1px] bg-black/30" />
        </div>
      </div>
    </motion.div>
  );
};

export default VirtualShelf;
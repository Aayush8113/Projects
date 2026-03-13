import { useState, useMemo, useEffect } from "react";
import { 
  IoAdd, IoChatbubbleOutline, IoSettingsOutline, IoClose, IoSearch, 
  IoMenu, IoTimeOutline, IoFlash, IoPlanet
} from "react-icons/io5";
import { useChat } from "../context/ChatContext";
import { useThemeAuth } from "../context/ThemeAuthContext";

const Sidebar = () => {
  const { chats, activeChatId, setActiveChatId, startNewChat, isSidebarOpen, setIsSidebarOpen } = useChat();
  const { setIsSettingsOpen, user } = useThemeAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Responsive State
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse
  const [isDeepThink, setIsDeepThink] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Handle Resize for Auto-Collapse on small laptops
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 1024 && window.innerWidth > 768) {
            setIsCollapsed(true);
        } else {
            setIsCollapsed(false);
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- DATA GROUPING ---
  const groupedChats = useMemo(() => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const groups = { today: [], yesterday: [], previous: [] };

    chats.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).forEach(chat => {
      const chatDate = new Date(chat.createdAt || Date.now());
      if (chatDate.toDateString() === today.toDateString()) groups.today.push(chat);
      else if (chatDate.toDateString() === yesterday.toDateString()) groups.yesterday.push(chat);
      else groups.previous.push(chat);
    });
    return groups;
  }, [chats, searchTerm]);

  return (
    <>
      {/* MOBILE BACKDROP (Only visible on mobile when open) */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* SIDEBAR CONTAINER */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-50 flex flex-col h-full
        bg-[#F8FAFC] dark:bg-[#0B1120] border-r border-gray-200 dark:border-slate-800
        transition-all duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-[80px]' : 'md:w-[280px] w-[85vw] max-w-[300px]'}
      `}>
        
        {/* 1. HEADER */}
        <div className="flex flex-col gap-4 p-4">
          
          {/* Top Row */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
             {/* Collapse Toggle (Desktop) */}
             <button 
               onClick={() => setIsCollapsed(!isCollapsed)}
               className="hidden p-2 text-gray-500 transition-colors rounded-lg md:flex hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-slate-800"
             >
               <IoMenu size={24} />
             </button>
             
             {/* Clock (Only if expanded) */}
             {!isCollapsed && (
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-full shadow-sm">
                   <IoTimeOutline size={14} className="text-indigo-500" />
                   <span className="font-mono text-xs font-bold text-gray-600 dark:text-gray-400">
                     {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                </div>
             )}

             {/* Mobile Close Button */}
             <div className="flex items-center justify-between w-full md:hidden">
                <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Aethel</span>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"><IoClose size={24}/></button>
             </div>
          </div>

          {/* New Chat Button */}
          <button 
            onClick={() => { startNewChat(); if(window.innerWidth < 768) setIsSidebarOpen(false); }}
            className={`flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg shadow-indigo-500/20 group
              ${isCollapsed 
                ? 'w-10 h-10 rounded-full mx-auto' 
                : 'w-full py-3 rounded-xl'
              }`}
            title="New Chat"
          >
            <IoAdd size={24} className={`transition-transform duration-300 ${!isCollapsed && 'group-hover:rotate-90'}`} />
            {!isCollapsed && <span className="text-sm font-semibold">New Chat</span>}
          </button>

          {/* Search Bar (Hide if collapsed) */}
          {!isCollapsed && (
            <div className="relative animate-fade-in-up">
              <IoSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pr-3 text-sm text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg outline-none pl-9 dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
              />
            </div>
          )}
        </div>

        {/* 2. CHAT LIST (Scrollable) */}
        <div className="flex-1 px-3 pb-2 space-y-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
             {!isCollapsed && <h3 className="px-3 mt-2 mb-2 text-xs font-bold tracking-widest text-gray-400 uppercase">History</h3>}
             
             {['today', 'yesterday', 'previous'].map(groupKey => (
               groupedChats[groupKey].map(chat => (
                  <button
                    key={chat._id}
                    onClick={() => { setActiveChatId(chat._id); if(window.innerWidth < 768) setIsSidebarOpen(false); }}
                    className={`group flex items-center gap-3 w-full p-2.5 rounded-lg text-sm transition-all relative
                      ${activeChatId === chat._id 
                        ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-gray-200 dark:ring-slate-700 font-semibold" 
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                      }
                      ${isCollapsed ? 'justify-center' : 'text-left'}
                    `}
                    title={isCollapsed ? chat.title : ""}
                  >
                    <IoChatbubbleOutline className="flex-shrink-0" size={18} />
                    {!isCollapsed && <span className="z-10 flex-1 truncate">{chat.title || "Untitled"}</span>}
                    {activeChatId === chat._id && <div className="absolute left-0 w-1 h-5 -translate-y-1/2 bg-indigo-500 rounded-r-full top-1/2" />}
                  </button>
               ))
             ))}
          </div>
        </div>

        {/* 3. FOOTER */}
        <div className="p-4 bg-[#F8FAFC] dark:bg-[#0B1120] border-t border-gray-200 dark:border-slate-800 flex flex-col gap-2">
          
          {/* Deep Think Toggle */}
          {!isCollapsed && (
             <div 
               className="flex items-center justify-between p-2.5 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl cursor-pointer border border-amber-100 dark:border-amber-900/20 hover:border-amber-200 transition-all"
               onClick={() => setIsDeepThink(!isDeepThink)}
             >
                <div className="flex items-center gap-2">
                   <div className={`p-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 ${isDeepThink ? 'animate-spin-slow' : ''}`}>
                      <IoPlanet size={12} />
                   </div>
                   <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Deep Think</span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${isDeepThink ? 'bg-amber-500' : 'bg-gray-300 dark:bg-slate-600'}`}>
                   <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isDeepThink ? 'left-4.5' : 'left-0.5'}`} />
                </div>
             </div>
          )}

          {/* User Profile */}
          <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white rounded-lg shadow-md bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0">
               {user?.name?.[0] || "U"}
            </div>
            
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate dark:text-white">{user?.name}</p>
                <p className="text-[10px] text-indigo-500 font-semibold">Pro Plan</p>
              </div>
            )}

            {!isCollapsed && (
              <button 
                 onClick={(e) => { e.stopPropagation(); setIsSettingsOpen(true); }}
                 className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                 <IoSettingsOutline size={18} />
              </button>
            )}
          </div>
        </div>

      </div>
    </>
  );
};

export default Sidebar;
import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Sparkles, BookOpen, ShoppingCart, Compass, Eraser, Minimize2 } from 'lucide-react';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { LibraryContext } from '../context/LibraryContext';

const MessageContent = ({ text }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span className="leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={index} className="font-black text-indigo-200">{part.slice(2, -2)}</strong>;
        return part;
      })}
    </span>
  );
};

const AILibrarian = () => {
  const { user } = useContext(AuthContext);
  const { books } = useContext(LibraryContext); 
  
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chat, setChat] = useState([{ role: 'ai', text: `Greetings, ${user?.name?.split(' ')[0]}. I have analyzed your ${books.length} books. How can I serve you?` }]);
  
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    if (isOpen && inputRef.current) setTimeout(() => inputRef.current.focus(), 300);
  }, [chat, isTyping, isOpen]);

  const sendMessage = async (overrideMessage) => {
    const messageToSend = overrideMessage || input;
    if (!messageToSend.trim()) return;

    setChat(prev => [...prev, { role: 'user', text: messageToSend }]);
    setInput('');
    setIsTyping(true);

    try {
      // Backend automatically pulls context from DB now!
      const { data } = await client.post('/books/ai/chat', { 
        message: messageToSend
      });
      
      setChat(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (err) {
      console.error("Chat Failed:", err);
      setChat(prev => [...prev, { role: 'ai', text: "I cannot access your shelf data right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { label: 'Pick Next', icon: <BookOpen size={14} />, prompt: 'Look at my "Next Up" books and pick the best one for me to start today.' },
    { label: 'Gaps?', icon: <ShoppingCart size={14} />, prompt: 'Analyze my shelf categories. What genre am I missing?' },
    { label: 'Summarize', icon: <Compass size={14} />, prompt: 'Give me a 1-sentence summary of my reading taste based on my collection.' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9000] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="w-[90vw] md:w-[400px] bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[600px] h-[70vh]">
            <div className="flex items-center justify-between p-5 text-white bg-gradient-to-r from-slate-900 to-slate-800 dark:from-indigo-950 dark:to-slate-900">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm"><Bot size={20} className="text-indigo-300" /></div>
                  <div className="absolute w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full -top-1 -right-1 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-widest uppercase">Vault Keeper</h3>
                  <p className="text-[10px] text-indigo-200/70 font-bold uppercase tracking-tighter">Connected to Library DB</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setChat([{ role: 'ai', text: "Memory wiped." }])} className="p-2 transition-colors rounded-full hover:bg-white/10 text-slate-400 hover:text-white"><Eraser size={18}/></button>
                <button onClick={() => setIsOpen(false)} className="p-2 transition-colors rounded-full hover:bg-white/10 text-slate-400 hover:text-white"><Minimize2 size={18}/></button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 p-5 space-y-6 overflow-y-auto bg-slate-50 dark:bg-slate-950/50">
              {chat.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm relative ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm border border-slate-100 dark:border-slate-700'}`}>
                    {msg.role === 'user' ? msg.text : <MessageContent text={msg.text} />}
                  </div>
                </div>
              ))}
              {isTyping && <div className="flex items-center gap-1 p-4 bg-white border rounded-tl-sm shadow-sm dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-2xl w-fit"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" /><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" /><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" /></div>}
            </div>

            {!isTyping && (
              <div className="flex gap-2 px-5 py-3 overflow-x-auto bg-white border-t dark:bg-slate-900 border-slate-100 dark:border-slate-800 no-scrollbar">
                {quickActions.map((action, idx) => (
                  <button key={idx} onClick={() => sendMessage(action.prompt)} className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap active:scale-95">{action.icon} {action.label}</button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 p-4 bg-white border-t dark:bg-slate-900 border-slate-100 dark:border-slate-800">
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Ask about your books..." className="flex-1 px-5 py-3 text-sm transition-all border-none outline-none bg-slate-100 dark:bg-slate-800 dark:text-white rounded-xl placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20" />
              <button onClick={() => sendMessage()} disabled={isTyping || !input.trim()} className="p-3 text-white transition-all bg-indigo-600 shadow-lg rounded-xl hover:bg-indigo-700 disabled:opacity-50 active:scale-90"><Send size={18}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsOpen(!isOpen)} className={`relative flex items-center justify-center w-16 h-16 text-white transition-all rounded-full shadow-2xl group ${isOpen ? 'bg-slate-800 dark:bg-slate-700 rotate-90' : 'bg-slate-900 dark:bg-indigo-600 hover:rotate-12'}`}>
        {isOpen ? <X /> : <Sparkles className="transition-colors group-hover:text-indigo-300" />}
        {!isOpen && <span className="absolute flex w-4 h-4 -top-1 -right-1"><span className="absolute inline-flex w-full h-full bg-indigo-400 rounded-full opacity-75 animate-ping"></span><span className="relative inline-flex w-4 h-4 bg-indigo-500 border-2 border-white rounded-full dark:border-slate-900"></span></span>}
      </motion.button>
    </div>
  );
};

export default AILibrarian;
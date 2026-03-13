import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { processChatMessage } from '../utils/chatbotLogic';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bot, X, Send } from 'lucide-react';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! I'm Vertexia AI, your premium shopping assistant. How can I assist you today?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const { user } = useSelector((state) => state.auth);
    const cart = useSelector((state) => state.cart);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isTyping, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userText = input;
        setInput('');

        // Add user message
        setMessages(prev => [...prev, { id: Date.now(), text: userText, sender: 'user' }]);

        setIsTyping(true);

        // Process AI response
        const responseText = await processChatMessage(userText, { user, cart });

        setIsTyping(false);
        setMessages(prev => [
            ...prev,
            { id: Date.now() + 1, text: responseText, sender: 'ai' }
        ]);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 flex items-center justify-center bg-slate-900 border border-slate-700 dark:bg-white dark:border-white text-white dark:text-slate-900 transition-colors ${isOpen ? 'hidden' : 'block'}`}
            >
                <Sparkles size={24} className="animate-pulse" />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden border border-slate-100 dark:border-slate-700 flex flex-col h-[500px] max-h-[80vh] transition-colors"
                    >
                        {/* Header */}
                        <div className="bg-slate-900 dark:bg-[#020617] p-4 flex justify-between items-center text-white border-b border-slate-800 dark:border-white/10">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/5">
                                    <Bot size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-wide">Vertexia AI</h3>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Intelligent Assistant</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 p-5 overflow-y-auto bg-white dark:bg-[#020617] flex flex-col space-y-4 no-scrollbar transition-colors">
                            <div className="text-center text-xs text-slate-400 dark:text-slate-500 mb-2">Today, 10:42 AM</div>
                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm transition-colors whitespace-pre-wrap ${msg.sender === 'user'
                                        ? 'bg-slate-900 text-white rounded-br-sm dark:bg-white dark:text-slate-900'
                                        : 'bg-slate-50 dark:bg-[#020617] text-slate-800 dark:text-white border border-slate-200/60 dark:border-slate-800 rounded-bl-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-slate-50 dark:bg-[#020617] text-slate-800 dark:text-white border border-slate-200/60 dark:border-slate-800 rounded-2xl rounded-bl-sm p-3.5 flex space-x-1 items-center h-[42px]">
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-[#020617] border-t border-slate-100 dark:border-slate-800 transition-colors">
                            <div className="flex items-center bg-slate-50 dark:bg-[#020617] rounded-xl border border-slate-200 dark:border-slate-700/50 px-2 py-1.5 focus-within:ring-2 focus-within:ring-slate-900 dark:focus-within:ring-white focus-within:border-transparent transition-all">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Message Vertexia AI..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 px-3 py-2 text-[13px] font-medium text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 p-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                            <div className="text-center mt-3">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase">Powered by Vertexia</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIChatbot;

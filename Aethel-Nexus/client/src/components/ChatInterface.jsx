import { useRef, useEffect, useState } from "react";
import { 
  IoSend, IoFlash, IoAddCircle, IoMic, IoMicOutline, 
  IoImageOutline, IoSearch, IoBrushOutline, IoVideocamOutline, 
  IoClose, IoSparkles, IoCloudUploadOutline, IoLogoGoogle, 
  IoCodeSlash, IoMenu, IoCopyOutline, IoRefreshOutline, 
  IoDownloadOutline, IoPerson, IoArrowDown, IoTerminal, IoAnalytics, IoCheckmark
} from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import TypingIndicator from "./TypingIndicator";
import { useChat } from "../context/ChatContext";

const ChatInterface = () => {
  const { messages, isLoading, handleSendMessage, activeChatId, chats, setIsSidebarOpen } = useChat();
  const [input, setInput] = useState("");
  
  // State
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isToolMenuOpen, setIsToolMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); 
  const [isListening, setIsListening] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Refs
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Refs for Click Outside
  const addMenuRef = useRef(null);
  const toolMenuRef = useRef(null);
  const addButtonRef = useRef(null);
  const toolButtonRef = useRef(null);

  const currentChat = chats.find(c => c._id === activeChatId);
  const chatTitle = currentChat ? currentChat.title : "New Conversation";

  // Dynamic Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // --- CLICK OUTSIDE LOGIC ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isAddMenuOpen && addMenuRef.current && !addMenuRef.current.contains(event.target) && addButtonRef.current && !addButtonRef.current.contains(event.target)) {
        setIsAddMenuOpen(false);
      }
      if (isToolMenuOpen && toolMenuRef.current && !toolMenuRef.current.contains(event.target) && toolButtonRef.current && !toolButtonRef.current.contains(event.target)) {
        setIsToolMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAddMenuOpen, isToolMenuOpen]);

  // --- SCROLL LOGIC ---
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isBottom = scrollHeight - scrollTop - clientHeight < 150;
      setShowScrollButton(!isBottom);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { 
    if (messages.length > 0) scrollToBottom();
  }, [messages, isLoading, selectedImage, activeTool]);

  // --- HANDLERS ---
  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit(e); }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;
    
    let finalMessage = input;
    if (activeTool === 'deepSearch') finalMessage = `[DEEP SEARCH] ${input}`;
    
    handleSendMessage(finalMessage, selectedImage);
    
    setInput("");
    setSelectedImage(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsAddMenuOpen(false);
    setIsToolMenuOpen(false);
  };

  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser does not support voice.");
    if (isListening) { window.speechRecognition?.stop(); setIsListening(false); } 
    else {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (e) => setInput(Array.from(e.results).map(r => r[0].transcript).join(''));
      window.speechRecognition = recognition;
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setSelectedImage(reader.result); setIsAddMenuOpen(false); };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    const content = messages.map(m => `### ${m.role}\n${m.content}\n---\n`).join('\n');
    const blob = new Blob([content], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${chatTitle}.md`;
    a.click();
  };

  const toggleMenu = (menu) => {
    if (menu === 'add') {
      setIsAddMenuOpen(!isAddMenuOpen);
      setIsToolMenuOpen(false);
    } else {
      setIsToolMenuOpen(!isToolMenuOpen);
      setIsAddMenuOpen(false);
    }
  };

  const toggleTool = (id) => {
    setActiveTool(activeTool === id ? null : id);
    setIsToolMenuOpen(false);
  };

  // --- CONFIG ---
  const addOptions = [
    { id: 'upload', name: 'Upload File', icon: <IoCloudUploadOutline />, color: 'text-blue-500', action: () => fileInputRef.current.click() },
    { id: 'drive', name: 'Drive', icon: <IoLogoGoogle />, color: 'text-green-600', action: () => alert("Drive Link (Pro Feature)") },
    { id: 'photos', name: 'Photos', icon: <IoImageOutline />, color: 'text-yellow-500', action: () => fileInputRef.current.click() },
    { id: 'code', name: 'Import Code', icon: <IoCodeSlash />, color: 'text-purple-500', action: () => fileInputRef.current.click() },
  ];

  const toolsOptions = [
    { id: 'deepSearch', name: 'Deep Search', icon: <IoSearch />, color: 'text-blue-400' },
    { id: 'imageGen', name: 'Create Image', icon: <IoImageOutline />, color: 'text-purple-400' },
    { id: 'canvas', name: 'Canvas', icon: <IoBrushOutline />, color: 'text-orange-400' },
    { id: 'video', name: 'Video', icon: <IoVideocamOutline />, color: 'text-red-400' },
  ];

  const suggestions = [
    { icon: <IoTerminal />, text: "Generate React Code" },
    { icon: <IoAnalytics />, text: "Analyze Data" },
    { icon: <IoImageOutline />, text: "Generate Assets" },
    { icon: <IoCodeSlash />, text: "Debug API" },
  ];

  return (
    <div className="relative flex flex-col h-full bg-[#FDFDFD] dark:bg-[#0B1120] transition-colors duration-300 font-sans">
      
      {/* 1. GLASS HEADER */}
      <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-10 bg-white/70 dark:bg-[#0B1120]/70 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 transition-all">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-500 transition-colors rounded-lg md:hidden hover:bg-gray-200 dark:hover:bg-slate-800">
             <IoMenu size={24} />
          </button>
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{chatTitle}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full bg-indigo-400 rounded-full opacity-75 animate-ping"></span>
                <span className="relative inline-flex w-2 h-2 bg-indigo-500 rounded-full"></span>
              </span>
              <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                Gemini 2.5 Flash
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           {messages.length > 0 && (
             <button onClick={handleExport} className="p-2 text-gray-400 transition-all rounded-lg hover:text-indigo-600 dark:text-slate-500 hover:bg-indigo-50 dark:hover:bg-slate-800/50" title="Export Chat">
               <IoDownloadOutline size={20} />
             </button>
           )}
        </div>
      </div>

      {/* 2. CHAT SCROLL AREA */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 p-4 overflow-y-auto custom-scrollbar scroll-smooth"
      >
        <div className="max-w-4xl pb-32 mx-auto space-y-8">
          
          {/* A. WELCOME SCREEN */}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-10 animate-fade-in">
              <div className="relative group">
                <div className="absolute transition-opacity duration-500 rounded-full -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 group-hover:opacity-40 blur-xl"></div>
                <div className="relative p-6 text-white shadow-2xl rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 shadow-indigo-500/30">
                  <IoFlash size={56} />
                </div>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-slate-400">
                    {getGreeting()}, Creator.
                </h2>
                <p className="text-lg font-medium text-gray-500 dark:text-slate-400">What shall we build today?</p>
              </div>
              
              {/* Chips */}
              <div className="grid w-full max-w-3xl grid-cols-1 gap-3 px-4 md:grid-cols-2 lg:grid-cols-4">
                {suggestions.map((s, i) => (
                   <button 
                     key={i} 
                     onClick={() => setInput(s.text)} 
                     className="flex items-center gap-3 p-4 bg-white dark:bg-[#131b2e] hover:bg-indigo-50/50 dark:hover:bg-slate-800/50 border border-gray-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 rounded-2xl text-left transition-all hover:shadow-lg hover:shadow-indigo-500/5 group"
                   >
                      <div className="p-2.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        {s.icon}
                      </div>
                      <span className="text-sm font-semibold text-gray-700 transition-colors dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-white">{s.text}</span>
                   </button>
                ))}
              </div>
            </div>
          ) : (
            /* B. MESSAGES LIST */
            <>
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-4 md:gap-6 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} animate-fade-in-up`}>
                  
                  {/* Avatar */}
                  <div className={`flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 mt-1 shadow-sm border border-transparent 
                    ${msg.role === "model" 
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" 
                      : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400"
                    }`}>
                    {msg.role === "model" ? <IoFlash size={14} /> : <IoPerson size={14} />}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-5 shadow-sm leading-relaxed text-[15px]
                    ${msg.role === "user" 
                      ? "bg-[#F3F4F6] dark:bg-[#1E293B] text-gray-900 dark:text-white rounded-tr-sm" 
                      : "bg-white dark:bg-transparent text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-transparent px-0 md:px-0 py-2 shadow-none"
                    }`}>
                    <ReactMarkdown components={{
                        code({node, className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '');
                          return match ? <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} /> : <code className="bg-gray-100 dark:bg-slate-800/50 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded text-xs font-mono border border-gray-200 dark:border-slate-700" {...props}>{children}</code>;
                        }
                      }}>
                      {msg.content}
                    </ReactMarkdown>
                    
                    {/* Bot Actions */}
                    {msg.role === "model" && (
                       <div className="flex items-center gap-3 mt-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                          <button className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                            <IoCopyOutline size={14}/> Copy
                          </button>
                          <button className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                            <IoRefreshOutline size={14}/> Retry
                          </button>
                       </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isLoading && (
                <div className="pl-14">
                   <div className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 shadow-sm dark:bg-slate-800/50 rounded-2xl dark:border-slate-800">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 delay-75 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 delay-150 bg-pink-500 rounded-full animate-bounce"></div>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-2" />
            </>
          )}
        </div>
      </div>

      {/* 3. SCROLL BUTTON */}
      {showScrollButton && (
        <button 
          onClick={scrollToBottom}
          className="absolute z-30 p-3 text-indigo-600 transition-all -translate-x-1/2 bg-white border border-gray-100 rounded-full shadow-xl bottom-24 left-1/2 dark:bg-slate-700 dark:text-white dark:border-slate-600 hover:scale-110 animate-fade-in-up"
        >
          <IoArrowDown size={18} />
        </button>
      )}

      {/* 4. INPUT AREA (Floating & Levitating) */}
      <div className="z-20 p-4 bg-transparent">
        <div className={`max-w-4xl mx-auto relative group transition-all duration-500 ${activeTool === 'deepSearch' ? 'shadow-[0_0_40px_rgba(99,102,241,0.3)]' : ''}`}>
          
          {/* Active Tool Chip */}
          {activeTool && (
            <div className="absolute left-0 flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-600 border border-indigo-100 rounded-full shadow-sm -top-12 bg-indigo-50/90 dark:bg-indigo-900/30 backdrop-blur-md dark:text-indigo-300 animate-fade-in dark:border-indigo-800/50">
              <IoSearch />
              {toolsOptions.find(t => t.id === activeTool)?.name} Mode
              <button onClick={() => setActiveTool(null)} className="ml-2 transition-colors hover:text-indigo-900 dark:hover:text-white"><IoClose /></button>
            </div>
          )}

          {/* Image Preview */}
          {selectedImage && (
            <div className="absolute left-0 p-2 bg-white border border-gray-200 shadow-xl dark:bg-slate-800 rounded-2xl dark:border-slate-700 -top-28 animate-fade-in-up">
              <img src={selectedImage} alt="Preview" className="object-cover w-auto h-20 rounded-xl" />
              <button onClick={() => setSelectedImage(null)} className="absolute p-1 text-red-500 transition-transform bg-white rounded-full shadow-md -top-2 -right-2 dark:bg-slate-700 hover:scale-110"><IoClose size={16} /></button>
            </div>
          )}

          {/* Menus */}
          {(isAddMenuOpen || isToolMenuOpen) && (
             <div 
               ref={isAddMenuOpen ? addMenuRef : toolMenuRef}
               className={`absolute bottom-20 w-64 bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-slate-700/50 overflow-hidden animate-fade-in-up z-30 p-2
               ${isToolMenuOpen ? 'left-16' : 'left-0'}`}
             >
                {isAddMenuOpen && (
                   <>
                     <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Media</div>
                     {addOptions.map((opt) => (
                       <button key={opt.id} onClick={opt.action} className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700/50 rounded-xl text-left transition-colors group">
                          <div className={`p-1.5 rounded-lg bg-gray-50 dark:bg-slate-800 ${opt.color} group-hover:scale-110 transition-transform`}>{opt.icon}</div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{opt.name}</span>
                       </button>
                     ))}
                   </>
                )}
                {isToolMenuOpen && (
                  <>
                    <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Capabilities</div>
                    {toolsOptions.map((tool) => (
                      <button key={tool.id} onClick={() => toggleTool(tool.id)} className={`flex items-center gap-3 w-full px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700/50 rounded-xl text-left transition-colors group ${activeTool === tool.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>
                         <div className={`p-1.5 rounded-lg bg-gray-50 dark:bg-slate-800 ${tool.color} group-hover:scale-110 transition-transform`}>{tool.icon}</div>
                         <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{tool.name}</span>
                         {activeTool === tool.id && <IoCheckmark className="ml-auto text-indigo-500" />}
                      </button>
                    ))}
                  </>
                )}
             </div>
          )}

          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*, .js, .jsx, .py, .txt" className="hidden" />

          {/* --- MAIN INPUT BAR --- */}
          <form 
            onSubmit={onSubmit} 
            className={`relative flex items-end w-full p-2 bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-slate-700 rounded-[32px] transition-all duration-300 gap-2
            ${activeTool ? 'shadow-[0_0_0_2px_rgba(99,102,241,0.2)] border-indigo-300 dark:border-indigo-800' : 'shadow-lg shadow-gray-200/50 dark:shadow-none hover:border-gray-300 dark:hover:border-slate-600 focus-within:shadow-xl focus-within:border-indigo-500/50'}`}
          >
            
            {/* Button 1: Add */}
            <button 
              type="button" 
              ref={addButtonRef}
              onClick={() => toggleMenu('add')} 
              className={`p-3 flex-shrink-0 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-white bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-all duration-200 ${isAddMenuOpen ? 'bg-gray-200 dark:bg-slate-600 text-gray-900' : ''}`}
            >
                <IoAddCircle size={24} />
            </button>

            {/* Button 2: Tools */}
            <button 
                type="button" 
                ref={toolButtonRef}
                onClick={() => toggleMenu('tool')} 
                className={`p-3 flex-shrink-0 text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 bg-gray-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-900/20 rounded-full transition-all duration-200 ${activeTool ? 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30' : ''}`}
            >
                <IoSparkles size={22} />
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={onKeyDown}
              placeholder={isListening ? "Listening..." : "Ask Aethel..."}
              rows={1}
              className="w-full max-h-[200px] bg-transparent text-gray-900 dark:text-white px-3 py-3.5 outline-none resize-none placeholder-gray-400 dark:placeholder-slate-500 text-[16px] custom-scrollbar self-center font-medium leading-relaxed"
              disabled={isLoading}
            />

            {/* Right Action */}
            {input.trim() || selectedImage ? (
                <div className="flex-shrink-0 pb-1">
                    <button type="submit" className="p-3 text-white transition-all duration-200 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-105 active:scale-95">
                    <IoSend size={18} />
                    </button>
                </div>
            ) : (
                <div className="flex-shrink-0 pb-1">
                    <button type="button" onClick={toggleVoice} className={`p-3 rounded-full transition-all duration-300 ${isListening ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"}`}>
                        {isListening ? <IoMic size={22} /> : <IoMicOutline size={24} />}
                    </button>
                </div>
            )}
          </form>
          
          <p className="mt-3 text-[11px] text-center text-gray-400 dark:text-slate-600 font-medium opacity-60">
            Aethel Nexus v2.5
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
import { useState } from "react";
import ChatInterface from "./components/ChatInterface";
import Sidebar from "./components/Sidebar";
import SettingsModal from "./components/SettingsModal";
import SEO from "./components/SEO"; 
import { ChatProvider, useChat } from "./context/ChatContext";
import { ThemeAuthProvider } from "./context/ThemeAuthContext";
import { IoMenu } from "react-icons/io5";

// Internal Layout
const Layout = () => {
  const { setIsSidebarOpen } = useChat();

  return (
    <div className="flex h-screen overflow-hidden text-gray-900 dark:text-white bg-gray-50 dark:bg-[#020617] transition-colors duration-300">
      
      {/* 1. SEO Logic (Zero Dependencies) */}
      <SEO />

      {/* 2. Mobile Trigger */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="fixed z-30 p-2.5 text-gray-600 dark:text-white bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg md:hidden top-4 left-4"
      >
        <IoMenu size={24} />
      </button>

      {/* 3. Main UI */}
      <Sidebar />
      <div className="relative flex-1 h-full">
        <ChatInterface />
      </div>

      <SettingsModal />
    </div>
  );
};

function App() {
  return (
    <ThemeAuthProvider>
      <ChatProvider>
        <Layout />
      </ChatProvider>
    </ThemeAuthProvider>
  );
}

export default App;
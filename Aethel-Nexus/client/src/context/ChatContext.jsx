import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { sendMessageToAI, fetchAllChats, fetchChatById, clearChatHistory } from "../services/api";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const refreshSidebar = useCallback(async () => {
    const data = await fetchAllChats();
    setChats(data || []);
  }, []);

  useEffect(() => { refreshSidebar(); }, [refreshSidebar]);

  useEffect(() => {
    const loadActiveChat = async () => {
      if (!activeChatId) { setMessages([]); return; }
      setIsLoading(true);
      try {
        const data = await fetchChatById(activeChatId);
        if (data && data.messages) setMessages(data.messages);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    loadActiveChat();
  }, [activeChatId]);

  // 🆕 Updated to handle Image
  const handleSendMessage = async (text, image = null) => {
    if (!text.trim() && !image) return;

    // Visual update immediately
    const userMsg = { role: "user", content: text + (image ? " [Image Uploaded]" : "") };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // API Call
      const response = await sendMessageToAI(text, messages, activeChatId, image);
      
      const botMsg = { role: "model", content: response.reply };
      setMessages((prev) => [...prev, botMsg]);

      if (response.isNewChat) {
        setActiveChatId(response.chatId);
        await refreshSidebar(); 
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "model", content: "⚠️ **Error**: Neural Link Failed." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => { setActiveChatId(null); setMessages([]); setIsSidebarOpen(false); };
  const clearHistory = async () => {
    if (window.confirm("Delete all chat history?")) {
      await clearChatHistory();
      setChats([]);
      startNewChat();
    }
  };

  return (
    <ChatContext.Provider value={{ messages, chats, activeChatId, isLoading, isSidebarOpen, setIsSidebarOpen, handleSendMessage, setActiveChatId, startNewChat, clearHistory }}>
      {children}
    </ChatContext.Provider>
  );
};
import { useEffect } from 'react';
import { useChat } from '../context/ChatContext';

const SEO = () => {
  const { chats, activeChatId } = useChat();

  useEffect(() => {
    // 1. Determine Title
    const currentChat = chats.find(c => c._id === activeChatId);
    const pageTitle = currentChat ? `${currentChat.title} | Aethel Nexus` : 'Aethel Nexus | AI Architect';

    // 2. Update Document Title
    document.title = pageTitle;

    // 3. Update Meta Description (Manual DOM manipulation)
    // This looks for <meta name="description"> and updates it, or creates it if missing.
    let metaDescription = document.querySelector("meta[name='description']");
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = currentChat 
      ? `Continuing conversation: ${currentChat.title}` 
      : "Aethel Nexus is an advanced AI coding assistant for full-stack developers.";

  }, [activeChatId, chats]); // Re-run whenever chat changes

  return null; // This component renders nothing visually
};

export default SEO;
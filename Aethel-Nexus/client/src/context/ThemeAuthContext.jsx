import { createContext, useContext, useState, useEffect } from "react";

const ThemeAuthContext = createContext();

export const useThemeAuth = () => useContext(ThemeAuthContext);

export const ThemeAuthProvider = ({ children }) => {
  // 1. Theme Logic
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  
  // 2. User State (Exposed setUser for updates)
  const [user, setUser] = useState({
    name: "Creator",
    email: "creator@aethelnexus.ai",
    plan: "Pro",
    avatar: "U"
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const logout = () => {
    alert("Logging out...");
    // Reset state or clear tokens here
  };

  return (
    <ThemeAuthContext.Provider value={{ 
      theme, 
      toggleTheme, 
      user, 
      setUser, // <--- Exposed this so SettingsModal can update the profile
      isSettingsOpen, 
      setIsSettingsOpen,
      logout
    }}>
      {children}
    </ThemeAuthContext.Provider>
  );
};
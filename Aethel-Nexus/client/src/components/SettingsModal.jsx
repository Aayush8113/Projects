import { useState, useEffect } from "react";
import { 
  IoClose, IoMoon, IoSunny, IoPerson, IoShieldCheckmark, 
  IoTrashBin, IoCodeSlash, IoHardwareChip, 
  IoColorPalette, IoSave, IoCheckmarkCircle, IoFlash, 
  IoStatsChart, IoKey, IoDesktopOutline, IoContrast
} from "react-icons/io5";
import { useThemeAuth } from "../context/ThemeAuthContext";
import { useChat } from "../context/ChatContext";

const SettingsModal = () => {
  const { isSettingsOpen, setIsSettingsOpen, theme, toggleTheme, user } = useThemeAuth();
  const { clearHistory } = useChat();
  const [activeTab, setActiveTab] = useState("intelligence");
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  // Local state for visual selection (includes 'system')
  const [visualTheme, setVisualTheme] = useState(theme); 

  // Sync visual theme with actual context theme on mount
  useEffect(() => {
    setVisualTheme(theme);
  }, [theme]);

  const profile = user || { name: "Creator", email: "user@aethel.ai" };

  // Default Settings
  const defaultSettings = {
    model: "gemini-2.5-flash",
    systemInstruction: "You are Aethel, a helpful AI assistant focused on coding.",
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    apiKey: "sk-....................8x92", 
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const isDirty = JSON.stringify(settings) !== JSON.stringify(defaultSettings);
    setHasChanges(isDirty);
  }, [settings]);

  useEffect(() => {
    if (isSettingsOpen) {
      setDeleteConfirm(false);
      setShowToast(false);
    }
  }, [isSettingsOpen]);

  if (!isSettingsOpen) return null;

  // --- HANDLERS ---
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setHasChanges(false);
      setTimeout(() => setShowToast(false), 3000);
    }, 800);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      clearHistory();
      setDeleteConfirm(false);
      setIsSettingsOpen(false);
    } else {
      setDeleteConfirm(true);
    }
  };

  // Handle Theme Selection (Visual + Logic)
  const handleThemeSelect = (selectedMode) => {
    setVisualTheme(selectedMode);
    
    if (selectedMode === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemDark && theme !== 'dark') toggleTheme();
        if (!systemDark && theme !== 'light') toggleTheme();
    } else {
        if (selectedMode !== theme) toggleTheme();
    }
  };

  const tabs = [
    { id: 'intelligence', label: 'Intelligence', icon: <IoHardwareChip size={18} /> },
    { id: 'developer', label: 'Developer', icon: <IoCodeSlash size={18} /> },
    { id: 'profile', label: 'Profile', icon: <IoPerson size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <IoColorPalette size={18} /> },
    { id: 'privacy', label: 'Data', icon: <IoShieldCheckmark size={18} /> },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4 font-sans">
      <div className="w-full max-w-5xl bg-white dark:bg-[#0F172A] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[700px] ring-1 ring-gray-200 dark:ring-slate-800 relative">
        
        {/* TOAST */}
        {showToast && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-sm font-bold animate-fade-in z-50">
            <IoCheckmarkCircle size={20} />
            Changes Saved Successfully
          </div>
        )}

        {/* SIDEBAR */}
        <div className="w-full md:w-72 bg-gray-50/80 dark:bg-[#0B1120] p-6 border-r border-gray-200 dark:border-slate-800 flex flex-col justify-between backdrop-blur-xl">
          <div>
            <div className="px-2 mb-8">
               <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <div className="flex items-center justify-center w-8 h-8 text-white bg-indigo-600 rounded-lg">
                    <IoFlash size={18} />
                  </div>
                  Settings
               </h2>
            </div>
            
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab.id 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 translate-x-1" 
                    : "text-gray-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Plan Badge */}
          <div className="p-4 border border-indigo-100 bg-indigo-50 dark:bg-slate-800/50 rounded-2xl dark:border-slate-700">
             <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider mb-2">Current Plan</p>
             <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900 dark:text-white">Pro Developer</span>
                <span className="px-2 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded-full">ACTIVE</span>
             </div>
             <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full mt-3 overflow-hidden">
                <div className="w-[75%] h-full bg-indigo-500 rounded-full"></div>
             </div>
             <p className="text-[10px] text-gray-400 mt-1">750 / 1000 credits used</p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col relative bg-white dark:bg-[#0F172A]">
          
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-slate-800">
             <div>
               <h3 className="text-2xl font-bold tracking-tight text-gray-900 capitalize dark:text-white">
                 {tabs.find(t => t.id === activeTab)?.label}
               </h3>
               <p className="text-sm text-gray-500 dark:text-slate-400">Manage your workspace preferences</p>
             </div>
             
             <div className="flex items-center gap-4">
                <button 
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all ${
                    hasChanges 
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 translate-y-0 opacity-100" 
                      : "bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed opacity-50"
                  }`}
                >
                  {isSaving ? <div className="w-4 h-4 border-2 rounded-full border-white/50 border-t-white animate-spin"></div> : <IoSave size={18} />}
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
                
                <button 
                  onClick={() => setIsSettingsOpen(false)} 
                  className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <IoClose size={24} />
                </button>
             </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            
            {/* 1. INTELLIGENCE */}
            {activeTab === 'intelligence' && (
              <div className="max-w-3xl space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Flash Model */}
                    <div 
                      onClick={() => setSettings({...settings, model: 'gemini-2.5-flash'})}
                      className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                         settings.model === 'gemini-2.5-flash' 
                         ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10' 
                         : 'border-gray-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-600'
                      }`}
                    >
                       <div className="flex items-start justify-between mb-2">
                          <div className={`p-2 rounded-lg ${settings.model === 'gemini-2.5-flash' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-500'}`}>
                             <IoFlash size={20} />
                          </div>
                          {settings.model === 'gemini-2.5-flash' && <IoCheckmarkCircle className="text-indigo-600" size={24} />}
                       </div>
                       <h4 className="font-bold text-gray-900 dark:text-white">Gemini 2.5 Flash</h4>
                       <p className="mt-1 mb-3 text-xs text-gray-500 dark:text-slate-400">Ultra-fast, low latency model.</p>
                       <span className="px-2 py-1 bg-white dark:bg-slate-900 rounded text-[10px] font-bold text-gray-500 border border-gray-200 dark:border-slate-700">FASTEST</span>
                    </div>

                    {/* Pro Model */}
                    <div 
                      onClick={() => setSettings({...settings, model: 'gemini-1.5-pro'})}
                      className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                         settings.model === 'gemini-1.5-pro' 
                         ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10' 
                         : 'border-gray-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-600'
                      }`}
                    >
                       <div className="flex items-start justify-between mb-2">
                          <div className={`p-2 rounded-lg ${settings.model === 'gemini-1.5-pro' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-500'}`}>
                             <IoHardwareChip size={20} />
                          </div>
                          {settings.model === 'gemini-1.5-pro' && <IoCheckmarkCircle className="text-indigo-600" size={24} />}
                       </div>
                       <h4 className="font-bold text-gray-900 dark:text-white">Gemini 1.5 Pro</h4>
                       <p className="mt-1 mb-3 text-xs text-gray-500 dark:text-slate-400">Reasoning powerhouse.</p>
                       <span className="px-2 py-1 bg-white dark:bg-slate-900 rounded text-[10px] font-bold text-gray-500 border border-gray-200 dark:border-slate-700">SMARTEST</span>
                    </div>
                </div>
              </div>
            )}

            {/* 2. PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="max-w-2xl space-y-8 animate-fade-in">
                <div className="flex items-center gap-6 p-6 border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl dark:border-slate-700">
                   <div className="flex items-center justify-center w-20 h-20 text-3xl font-bold text-white shadow-lg rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600">
                      {profile.name[0]}
                   </div>
                   <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">{profile.name}</h4>
                      <p className="mb-3 text-sm text-gray-500 dark:text-slate-400">{profile.email}</p>
                      <div className="flex gap-2">
                         <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full shadow-md shadow-indigo-500/20">PRO PLAN</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">Display Name</label>
                        <div className="relative">
                           <IoPerson className="absolute text-gray-400 left-3 top-3" />
                           <input type="text" defaultValue={profile.name} className="w-full py-3 pl-10 pr-4 text-sm font-semibold text-gray-900 border border-gray-200 bg-gray-50 dark:bg-slate-900 dark:border-slate-800 rounded-xl dark:text-white focus:ring-2 focus:ring-indigo-500" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">Role</label>
                        <input type="text" value="Full Stack Developer" disabled className="w-full px-4 py-3 text-sm text-gray-500 bg-gray-100 border border-gray-200 cursor-not-allowed dark:bg-slate-900 dark:border-slate-800 rounded-xl" />
                      </div>
                   </div>
                </div>

                <div className="pt-4 space-y-3 border-t border-gray-100 dark:border-slate-800">
                    <h5 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                       <IoStatsChart className="text-indigo-500" /> Monthly Usage
                    </h5>
                    <div className="grid grid-cols-3 gap-4">
                       <div className="p-4 text-center border border-gray-100 bg-gray-50 dark:bg-slate-900 rounded-xl dark:border-slate-800">
                          <p className="text-2xl font-bold text-indigo-600">8.2k</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">Tokens</p>
                       </div>
                       <div className="p-4 text-center border border-gray-100 bg-gray-50 dark:bg-slate-900 rounded-xl dark:border-slate-800">
                          <p className="text-2xl font-bold text-purple-600">42</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">Chats</p>
                       </div>
                       <div className="p-4 text-center border border-gray-100 bg-gray-50 dark:bg-slate-900 rounded-xl dark:border-slate-800">
                          <p className="text-2xl font-bold text-emerald-500">12</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">Images</p>
                       </div>
                    </div>
                </div>
              </div>
            )}

            {/* 3. APPEARANCE TAB (FIXED CONTRAST & BETTER CONTENT) */}
            {activeTab === 'appearance' && (
              <div className="max-w-2xl space-y-6 animate-fade-in">
                 <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    
                    {/* Light Mode - ALWAYS WHITE CARD */}
                    <button 
                      onClick={() => handleThemeSelect('light')}
                      className={`p-5 rounded-2xl border-2 transition-all text-left relative overflow-hidden group bg-white ${
                         visualTheme === 'light' 
                         ? 'border-indigo-600 shadow-xl shadow-indigo-100' 
                         : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                       <div className="absolute top-0 right-0 p-2 bg-amber-100 rounded-bl-xl">
                          <IoSunny className="text-amber-500" size={18} />
                       </div>
                       <h4 className="mb-1 text-lg font-bold text-gray-900">Light</h4>
                       {/* Hides description if selected */}
                       {visualTheme !== 'light' && <p className="mt-1 text-xs text-gray-500">High clarity & brightness.</p>}
                       {visualTheme === 'light' && <div className="absolute text-indigo-600 bottom-4 right-4"><IoCheckmarkCircle size={24}/></div>}
                    </button>

                    {/* Dark Mode - ALWAYS DARK CARD */}
                    <button 
                      onClick={() => handleThemeSelect('dark')}
                      className={`p-5 rounded-2xl border-2 transition-all text-left relative overflow-hidden group bg-[#0F172A] ${
                         visualTheme === 'dark' 
                         ? 'border-indigo-500 shadow-xl shadow-black/30' 
                         : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                       <div className="absolute top-0 right-0 p-2 bg-slate-800 rounded-bl-xl">
                          <IoMoon className="text-indigo-400" size={18} />
                       </div>
                       <h4 className="mb-1 text-lg font-bold text-white">Dark</h4>
                       {/* Hides description if selected */}
                       {visualTheme !== 'dark' && <p className="mt-1 text-xs text-slate-400">Easy on the eyes.</p>}
                       {visualTheme === 'dark' && <div className="absolute text-indigo-500 bottom-4 right-4"><IoCheckmarkCircle size={24}/></div>}
                    </button>

                    {/* System Mode - SPLIT CARD */}
                    <button 
                      onClick={() => handleThemeSelect('system')}
                      className={`p-5 rounded-2xl border-2 transition-all text-left relative overflow-hidden group bg-gradient-to-br from-gray-100 to-slate-800 ${
                         visualTheme === 'system' 
                         ? 'border-indigo-600 shadow-xl' 
                         : 'border-gray-300 dark:border-slate-700 hover:border-gray-400'
                      }`}
                    >
                       <div className="absolute top-0 right-0 p-2 text-white bg-white/20 backdrop-blur-sm rounded-bl-xl">
                          <IoDesktopOutline size={18} />
                       </div>
                       <h4 className="mb-1 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-white">Auto</h4>
                       {/* Hides description if selected */}
                       {visualTheme !== 'system' && <p className="mt-1 text-xs text-gray-200 drop-shadow-md">Syncs with OS.</p>}
                       {visualTheme === 'system' && <div className="absolute text-white bottom-4 right-4"><IoCheckmarkCircle size={24}/></div>}
                    </button>

                 </div>
              </div>
            )}

            {/* 4. DEVELOPER TAB */}
            {activeTab === 'developer' && (
               <div className="max-w-2xl space-y-6 animate-fade-in">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                       <IoKey className="text-indigo-500" /> API Access Key
                    </label>
                    <div className="flex gap-2">
                       <input 
                         type="password" 
                         value={settings.apiKey} 
                         readOnly
                         className="flex-1 px-4 py-3 font-mono text-sm text-gray-600 border border-gray-200 bg-gray-50 dark:bg-slate-900 dark:border-slate-800 rounded-xl dark:text-gray-400" 
                       />
                       <button className="px-5 py-3 text-sm font-bold transition-colors bg-white border border-gray-200 dark:bg-slate-800 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700">
                          Regenerate
                       </button>
                    </div>
                  </div>
               </div>
            )}

            {/* 5. PRIVACY TAB */}
            {activeTab === 'privacy' && (
               <div className="max-w-2xl space-y-6 animate-fade-in">
                  <div className="p-6 border border-red-100 dark:border-red-900/20 bg-red-50/50 dark:bg-red-900/5 rounded-2xl">
                     <div className="flex items-start gap-4">
                        <div className="p-3 text-red-600 bg-red-100 dark:bg-red-900/30 rounded-xl">
                           <IoTrashBin size={24} />
                        </div>
                        <div>
                           <h4 className="text-lg font-bold text-gray-900 dark:text-white">Delete Workspace</h4>
                           <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                              This will permanently delete all your conversation history.
                           </p>
                        </div>
                     </div>
                     <div className="flex justify-end mt-6">
                        <button 
                           onClick={handleDelete}
                           className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm
                           ${deleteConfirm 
                              ? "bg-red-600 text-white shadow-red-500/30" 
                              : "bg-white dark:bg-slate-900 text-red-600 border border-red-200 dark:border-red-900/30 hover:bg-red-50"
                           }`}
                        >
                           {deleteConfirm ? "Are you sure?" : "Delete Everything"}
                        </button>
                     </div>
                  </div>
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
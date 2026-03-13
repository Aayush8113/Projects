// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Sidebar } from './components/Sidebar';
import { AISidebar } from './components/AISidebar';
import { Overview } from './pages/Overview';
import { Clients } from './pages/Clients';
import { Settings } from './pages/Settings';
import { useStore } from './store/uiStore';
import { Menu, Sparkles, Bell, Search, AlertCircle } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* HEADER COMPONENT                             */
/* -------------------------------------------------------------------------- */
const Header = () => {
  const { toggleAi, toggleSidebar, notifications } = useStore();
  const location = useLocation();

  // Professional Route Mapping (Cleaner than string splitting)
  const routeTitles = {
    '/': 'Dashboard Overview',
    '/clients': 'Client Management',
    '/settings': 'Platform Settings',
    '/analytics': 'Analytics Engine',
  };

  const title = routeTitles[location.pathname] || 'Dashboard';

  return (
    <header className="h-20 border-b border-white/5 flex justify-between items-center px-6 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10 transition-all">
      
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors" 
          onClick={toggleSidebar}
        >
          <Menu />
        </button>
        <h2 className="text-xl font-semibold text-white tracking-tight">{title}</h2>
      </div>

      {/* Right: Actions & Search */}
      <div className="flex items-center gap-4">
        {/* Search Bar (Hidden on Mobile) */}
        <div className="hidden md:flex items-center bg-slate-800/50 rounded-full px-4 py-2 border border-white/10 focus-within:border-indigo-500/50 transition-colors">
          <Search size={16} className="text-slate-400 mr-2" />
          <input 
            className="bg-transparent border-none focus:outline-none text-sm text-white w-48 placeholder:text-slate-500" 
            placeholder="Search metrics..." 
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-full">
          <Bell size={20} />
          {notifications > 0 && (
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse ring-2 ring-slate-900" />
          )}
        </button>

        {/* AI Trigger Button */}
        <button 
          onClick={toggleAi} 
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-2 rounded-full text-sm font-medium shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles size={16} className="animate-pulse" /> 
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </div>
    </header>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN LAYOUT                                  */
/* -------------------------------------------------------------------------- */
const Layout = ({ children }) => (
  <div className="flex bg-slate-950 min-h-screen font-sans text-slate-200 selection:bg-indigo-500/30">
    <Sidebar />
    <AISidebar />
    
    {/* Main Content Area */}
    <main className="flex-1 md:ml-64 flex flex-col min-w-0 overflow-hidden">
      <Header />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </div>
    </main>
  </div>
);

/* -------------------------------------------------------------------------- */
/* APP ROUTER                                   */
/* -------------------------------------------------------------------------- */
export default function App() {
  return (
    <Router>
      {/* Global Notifications */}
      <Toaster 
        position="top-center" 
        theme="dark" 
        toastOptions={{
          style: { background: '#1e293b', border: '1px solid #334155', color: '#fff' }
        }}
      />
      
      <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Overview />} />
          
          {/* 404 Fallback Route */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <AlertCircle size={48} className="text-slate-600 mb-4" />
              <h1 className="text-2xl font-bold text-white">404: Page Not Found</h1>
              <p className="text-slate-400 mt-2">The section you are looking for does not exist.</p>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}
import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, LayoutDashboard, Library, LogOut, ShieldAlert, Star, Moon, Sun, Menu, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const SidebarItem = ({ icon: Icon, label, to, active, color, onClick }) => (
  <Link to={to} onClick={onClick} className="block group shrink-0">
    <div className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 font-medium ${
      active
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none dark:bg-indigo-500"
        : `text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:pl-6 ${color}`
    }`}>
      <Icon size={20} className={active ? "text-white" : ""} />
      <span className="text-sm tracking-tight">{label}</span>
    </div>
  </Link>
);

const SidebarContent = ({ onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center gap-3 px-2 mb-8 shrink-0">
        <div className="p-3 text-white bg-indigo-600 shadow-xl rounded-2xl shadow-indigo-100 dark:shadow-none">
          <Library size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black leading-none tracking-tighter uppercase text-slate-900 dark:text-white">DearPages</h1>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.3em]">Family Vault</span>
        </div>
      </div>

      <nav className="flex flex-col flex-1 gap-1.5 overflow-y-auto custom-scrollbar pr-1 pb-4 min-h-0">
        <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 shrink-0">Menu</p>
        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" active={location.pathname === "/"} onClick={onClose} />
        <SidebarItem icon={Clock} label="History" to="/lent" active={location.pathname === "/lent"} onClick={onClose} />
        <SidebarItem icon={Star} label="Dream Books" to="/wishlist" active={location.pathname === "/wishlist"} onClick={onClose} />

        {user?.role === "admin" && (
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 shrink-0">
            <p className="px-4 text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-2"><ShieldAlert size={12} /> God Mode</p>
            <SidebarItem icon={ShieldAlert} label="Control Center" to="/admin" color="text-rose-600 dark:text-rose-400" active={location.pathname === "/admin"} onClick={onClose} />
          </div>
        )}
      </nav>

      <div className="pt-6 mt-auto space-y-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
        <button onClick={toggleTheme} className="flex items-center justify-between w-full px-4 py-3 text-xs font-bold uppercase transition-colors rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
          <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
          {theme === 'light' ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-indigo-400" />}
        </button>

        <div className="flex items-center gap-3 px-2">
          <div className="flex items-center justify-center w-10 h-10 text-sm font-black text-white shadow-lg rounded-xl bg-slate-900 dark:bg-indigo-600">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-slate-800 dark:text-white">{user?.name}</p>
            <button onClick={logout} className="flex items-center gap-1 text-xs font-medium transition-colors text-slate-400 hover:text-rose-500"><LogOut size={12} /> Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-100 dark:border-slate-800 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="p-2 text-white bg-indigo-600 rounded-lg"><Library size={18} /></div>
          <span className="text-lg font-black tracking-tighter text-slate-900 dark:text-white">DearPages</span>
        </div>
        <button onClick={() => setIsOpen(true)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-900/30"><Menu size={24} /></button>
      </div>

      <div className="sticky top-0 flex-col hidden h-screen p-6 transition-colors duration-300 border-r lg:flex w-72 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-slate-100 dark:border-slate-800">
        <SidebarContent /> 
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-white border-r shadow-2xl w-72 dark:bg-slate-950 lg:hidden border-slate-100 dark:border-slate-800">
              <div className="flex justify-end p-4 shrink-0">
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-white"><X size={24} /></button>
              </div>
              <div className="flex-1 px-6 pb-6 overflow-hidden">
                <SidebarContent onClose={() => setIsOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
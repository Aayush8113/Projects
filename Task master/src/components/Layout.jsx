import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, CheckCircle, Sparkles } from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-indigo-200 shadow-lg' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
      }`
    }
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col p-6">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Sparkles className="text-white" size={20} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">TaskMaster</h1>
        </div>
        
        <nav className="space-y-2">
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem to="/active" icon={ListTodo} label="Active Tasks" />
          <SidebarItem to="/completed" icon={CheckCircle} label="Completed" />
        </nav>

        <div className="mt-auto p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Pro Feature</p>
          <p className="text-sm text-indigo-900 leading-relaxed">
            Use the <span className="font-semibold">AI Wand</span> to automatically organize complex projects.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
import React, { useState, useEffect, useCallback } from 'react';
import client from '../api/client';
import Sidebar from '../components/Sidebar';
import UserManagementModal from '../components/UserManagementModal';
import { ShieldCheck, Users, Book, Activity, RefreshCw, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const loadSystem = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await client.get('/admin/dashboard');
      setData(response.data.data);
    } catch (err) { console.error(err); } 
    finally { 
      setLoading(false); 
      setIsRefreshing(false); 
    }
  }, []);

  useEffect(() => { loadSystem(); }, [loadSystem]);

  const handleForceReturn = async (id) => {
    try {
      await client.patch(`/admin/books/${id}/return`);
      loadSystem();
    } catch (err) { alert("Action failed."); }
  };

  const openUserManagement = (member) => {
    setSelectedUser(member);
    setIsUserModalOpen(true);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen font-black tracking-widest text-indigo-600 uppercase bg-slate-50 dark:bg-slate-950 dark:text-indigo-400 animate-pulse">
      Loading Vault...
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300 lg:flex-row bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="flex-1 w-full p-4 pt-24 overflow-y-auto lg:p-8 lg:pt-8">
        <div className="mx-auto max-w-7xl">
          <header className="flex flex-col gap-4 mb-10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1 text-rose-500">
                <ShieldCheck size={18} className="animate-bounce" />
                <span className="text-[10px] font-black uppercase tracking-[3px]">DearPages Console</span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter lg:text-4xl text-slate-900 dark:text-white">Control Center</h1>
            </div>
            <button onClick={loadSystem} disabled={isRefreshing} className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all active:scale-95 w-fit ${isRefreshing ? 'animate-spin' : ''}`}>
              <RefreshCw size={20} className="text-indigo-600 dark:text-indigo-400" />
            </button>
          </header>

          <div className="grid grid-cols-1 gap-6 mb-10 sm:grid-cols-3">
            <StatCard label="Active Users" value={data?.totalMembers} icon={<Users />} color="bg-blue-600" delay={0.1} />
            <StatCard label="Global Library" value={data?.totalBooks} icon={<Book />} color="bg-indigo-600" delay={0.2} />
            <StatCard label="Circulating" value={data?.lentBooks || 0} icon={<Activity />} color="bg-amber-500" delay={0.3} />
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="flex items-center gap-2 mb-8 text-xl font-bold text-slate-800 dark:text-white">
                <Users className="text-indigo-600 dark:text-indigo-400" size={22} /> Family Network
              </h3>
              <div className="space-y-4">
                {data?.familyMembers?.map((member, i) => (
                  <motion.div key={member._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between p-5 transition-all border group bg-slate-50 dark:bg-slate-950 rounded-3xl border-slate-50 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 font-black text-white bg-indigo-600 rounded-2xl">
                        {member.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{member.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{member.bookCount} Volumes</p>
                      </div>
                    </div>
                    <button onClick={() => openUserManagement(member)} className="p-3 transition-colors bg-white dark:bg-slate-900 rounded-xl text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      <ExternalLink size={18} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="flex items-center gap-2 mb-8 text-xl font-bold text-slate-800 dark:text-white">
                <Activity className="text-rose-500" size={22} /> System Intelligence
              </h3>
              <div className="space-y-1">
                <AnimatePresence>
                  {data?.recentActivity?.map((log) => (
                    <motion.div key={log._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between py-5 border-b border-slate-50 dark:border-slate-800 last:border-0">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          <span className="font-black text-slate-900 dark:text-white">{log.owner?.name}</span> {log.status === 'With Friends' ? 'lent out' : 'added'} <span className="italic text-indigo-600 dark:text-indigo-400">"{log.title}"</span>
                        </p>
                        <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">{new Date(log.updatedAt).toLocaleTimeString()}</span>
                      </div>
                      {log.status === 'With Friends' && (
                        <button onClick={() => handleForceReturn(log._id)} className="flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white">
                          <RefreshCw size={14} /> Force Return
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <UserManagementModal isOpen={isUserModalOpen} user={selectedUser} onClose={() => setIsUserModalOpen(false)} onRefresh={loadSystem} />
    </div>
  );
};

const StatCard = ({ label, value, icon, color, delay }) => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }} whileHover={{ y: -5 }} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-6 group">
    <div className={`p-5 rounded-[24px] text-white shadow-2xl ${color} transition-transform group-hover:rotate-12`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div>
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[2px] mb-1">{label}</p>
      <h3 className="text-4xl font-black leading-none text-slate-900 dark:text-white">{value || 0}</h3>
    </div>
  </motion.div>
);

export default AdminDashboard;
import { Search, Trash2, MoreHorizontal, Filter } from "lucide-react";
import { useStore } from "../store/uiStore";
import { toast } from "sonner";

export const Clients = () => {
  const { customers, deleteCustomer } = useStore();

  const handleDelete = (id) => {
    deleteCustomer(id);
    toast.error("Client removed from database");
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Client Management</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search clients..." className="bg-slate-800 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <button className="p-2 bg-slate-800 border border-white/10 rounded-lg text-slate-300 hover:text-white"><Filter size={20} /></button>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-white/5 text-slate-200 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Revenue</th>
              <th className="px-6 py-4">Date Added</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{c.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs border ${
                    c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    c.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>{c.status}</span>
                </td>
                <td className="px-6 py-4 text-white">${c.amount}</td>
                <td className="px-6 py-4">{c.date}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-rose-500/20 hover:text-rose-400 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <div className="p-8 text-center text-slate-500">No clients found.</div>}
      </div>
    </div>
  );
};
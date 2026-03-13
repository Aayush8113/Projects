import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Activity, TrendingUp } from "lucide-react";
import { useStore } from "../store/uiStore";

const data = [
  { name: 'Mon', val: 4000 }, { name: 'Tue', val: 3000 }, { name: 'Wed', val: 2000 },
  { name: 'Thu', val: 2780 }, { name: 'Fri', val: 1890 }, { name: 'Sat', val: 2390 }, { name: 'Sun', val: 3490 },
];

export const Overview = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="$45,231" icon={DollarSign} trend="+20.1%" color="text-emerald-400" />
        <StatCard title="Active Clients" value="124" icon={Users} trend="+4" color="text-blue-400" />
        <StatCard title="Bounce Rate" value="42.3%" icon={Activity} trend="-2%" color="text-rose-400" />
        <StatCard title="AI Predictions" value="98%" icon={TrendingUp} trend="High Accuracy" color="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Analytics</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff'}} />
                <Area type="monotone" dataKey="val" stroke="#6366f1" fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-md border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            {['Direct', 'Social', 'Referral', 'Organic'].map((source, i) => (
              <div key={source} className="group">
                <div className="flex justify-between text-sm text-slate-400 mb-1">
                  <span>{source}</span>
                  <span className="text-white font-medium">{90 - (i * 20)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{width: `${90 - (i * 20)}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-slate-800/50 border border-white/5 p-6 rounded-xl hover:border-indigo-500/30 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div className="p-2 bg-white/5 rounded-lg">
        <Icon className="text-slate-300 w-5 h-5" />
      </div>
    </div>
    <p className={`text-xs font-medium ${color}`}>{trend} <span className="text-slate-500 ml-1">vs last month</span></p>
  </div>
);
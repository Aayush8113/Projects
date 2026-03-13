import { Bell, Lock, Eye, Palette, Save } from "lucide-react";
import { toast } from "sonner";

export const Settings = () => {
  const handleSave = () => toast.success("Settings saved successfully!");

  return (
    <div className="max-w-2xl animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-white mb-6">Platform Settings</h1>
      
      <div className="bg-slate-800/50 border border-white/5 rounded-xl p-6 space-y-6">
        <Section icon={Bell} title="Notifications" desc="Manage how you receive alerts">
          <Toggle label="Email Alerts" defaultChecked />
          <Toggle label="Push Notifications" defaultChecked />
        </Section>
        
        <Section icon={Lock} title="Security" desc="2FA and password management">
          <Toggle label="Two-Factor Auth" />
          <button className="text-sm text-indigo-400 hover:text-indigo-300 mt-2">Change Password</button>
        </Section>

        <Section icon={Palette} title="Appearance" desc="Customize dashboard theme">
           <Toggle label="Dark Mode" defaultChecked />
           <Toggle label="Glassmorphism Effects" defaultChecked />
        </Section>

        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button onClick={handleSave} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const Section = ({ icon: Icon, title, desc, children }) => (
  <div className="pb-6 border-b border-white/5 last:border-0 last:pb-0">
    <div className="flex gap-4 mb-4">
      <div className="p-2 bg-indigo-500/10 rounded-lg h-fit"><Icon className="text-indigo-400 w-5 h-5" /></div>
      <div>
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <p className="text-slate-400 text-sm">{desc}</p>
      </div>
    </div>
    <div className="pl-14 space-y-3">{children}</div>
  </div>
);

const Toggle = ({ label, defaultChecked }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-300 text-sm">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
    </label>
  </div>
);
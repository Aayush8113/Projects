import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskList from '../components/TaskList';
import AIModal from '../components/AIModal';
import { Plus, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { tasks, addTask } = useTasks();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [newTask, setNewTask] = useState('');

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    addTask({ title: newTask, type: 'manual' });
    setNewTask('');
  };

  const pendingCount = tasks.filter(t => t.status === 'todo').length;

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-2">You have <span className="font-bold text-indigo-600">{pendingCount}</span> tasks pending today.</p>
        </div>
        
        <button 
          onClick={() => setIsAIModalOpen(true)}
          className="bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg"
        >
          <Sparkles size={18} className="text-indigo-400" />
          AI Assistant
        </button>
      </div>

      <AIModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />

      {/* Input Form */}
      <form onSubmit={handleManualAdd} className="mb-8 relative group">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full pl-6 pr-14 py-5 rounded-2xl bg-white border border-gray-200 shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none transition-all text-lg"
        />
        <button 
          type="submit" 
          disabled={!newTask.trim()}
          className="absolute right-3 top-3 bottom-3 aspect-square bg-indigo-600 rounded-xl hover:bg-indigo-700 text-white flex items-center justify-center disabled:opacity-50 disabled:bg-gray-300 transition-all"
        >
          <Plus size={24} />
        </button>
      </form>

      {/* Task List */}
      <div>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Your Timeline</h2>
        <TaskList tasks={tasks} emptyMessage="Your dashboard is empty. Add a task to get started!" />
      </div>
    </div>
  );
}
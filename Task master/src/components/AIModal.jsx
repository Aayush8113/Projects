import { useState } from 'react';
import { Sparkles, Loader2, X } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

// Mock AI Service (Replace with real API in production)
const generateSubtasks = async (goal) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        `Research requirements for ${goal}`,
        `Create initial draft for ${goal}`,
        `Review and refine ${goal}`,
        `Final execution of ${goal}`
      ]);
    }, 1500); 
  });
};

export default function AIModal({ isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { addTask } = useTasks();

  const handleAIMagic = async () => {
    if (!input.trim()) return;
    setLoading(true);
    
    // 1. Generate Subtasks
    const subtasks = await generateSubtasks(input);
    
    // 2. Add Parent Project (optional) and Subtasks
    subtasks.forEach(sub => addTask({ title: sub, type: 'subtask', parent: input }));
    
    setLoading(false);
    setInput('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl animate-fade-in relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Sparkles className="text-indigo-600" size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">AI Task Breakdown</h2>
        </div>

        <p className="text-gray-600 mb-4 text-sm">
          Type a complex goal (e.g., "Plan a marketing campaign"), and our AI will break it down into actionable steps.
        </p>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What is your main goal?"
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none h-32 resize-none mb-6 text-gray-700 placeholder-gray-400"
        />

        <button
          onClick={handleAIMagic}
          disabled={loading || !input}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
          {loading ? 'Generating Plan...' : 'Break Down with AI'}
        </button>
      </div>
    </div>
  );
}
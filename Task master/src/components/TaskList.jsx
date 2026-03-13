import { Check, Trash2, Sparkles } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function TaskList({ tasks, emptyMessage }) {
  const { updateTaskStatus, deleteTask } = useTasks();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
        <Sparkles className="mx-auto mb-4 text-indigo-300" size={48} />
        <p className="font-medium">{emptyMessage || "No tasks found."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div 
          key={task.id}
          className={`group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all ${task.status === 'done' ? 'opacity-60 bg-gray-50' : ''}`}
        >
          <div className="flex items-center gap-4">
            {/* Checkbox Button */}
            <button
              onClick={() => updateTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                task.status === 'done' ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-indigo-500'
              }`}
            >
              {task.status === 'done' && <Check size={14} className="text-white" />}
            </button>
            
            {/* Task Content */}
            <div>
              <span className={`font-medium block ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {task.title}
              </span>
              <div className="flex gap-2">
                {task.type === 'subtask' && (
                  <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full mt-1 inline-block uppercase tracking-wider">
                    AI Generated
                  </span>
                )}
                <span className="text-[10px] text-gray-400 mt-1 inline-block">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Delete Button */}
          <button 
            onClick={() => deleteTask(task.id)}
            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
            title="Delete Task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
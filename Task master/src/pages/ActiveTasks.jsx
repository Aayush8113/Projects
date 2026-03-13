import { useTasks } from '../context/TaskContext';
import TaskList from '../components/TaskList';
import { ListTodo } from 'lucide-react';

export default function ActiveTasks() {
  const { tasks } = useTasks();
  const activeTasks = tasks.filter(task => task.status === 'todo');

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
          <ListTodo size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Active Tasks</h1>
          <p className="text-gray-500 mt-1">Keep focus on these {activeTasks.length} items.</p>
        </div>
      </div>

      <TaskList 
        tasks={activeTasks} 
        emptyMessage="No active tasks! You are all caught up." 
      />
    </div>
  );
}
import { useTasks } from '../context/TaskContext';
import TaskList from '../components/TaskList';
import { CheckCircle } from 'lucide-react';

export default function Completed() {
  const { tasks } = useTasks();
  const completedTasks = tasks.filter(task => task.status === 'done');

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-green-100 rounded-xl text-green-600">
          <CheckCircle size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Completed</h1>
          <p className="text-gray-500 mt-1">History of your {completedTasks.length} finished achievements.</p>
        </div>
      </div>

      <TaskList 
        tasks={completedTasks} 
        emptyMessage="No completed tasks yet. Get to work!" 
      />
    </div>
  );
}
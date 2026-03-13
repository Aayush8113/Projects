import { createContext, useState, useContext, useEffect } from 'react';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  // Initialize from LocalStorage or empty array
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to LocalStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    setTasks((prev) => [...prev, { ...task, id: Date.now(), status: 'todo', createdAt: new Date().toISOString() }]);
  };

  const updateTaskStatus = (id, status) => {
    setTasks((prev) => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter(t => t.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
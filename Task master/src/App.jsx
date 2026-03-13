import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ActiveTasks from './pages/ActiveTasks';
import Completed from './pages/Completed';

function App() {
  return (
    <TaskProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="active" element={<ActiveTasks />} />
            <Route path="completed" element={<Completed />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TaskProvider>
  );
}

export default App;
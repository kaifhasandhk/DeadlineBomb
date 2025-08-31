import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CourseListPage from './pages/CourseListPage';
import CoursePage from './pages/CoursePage';
import DashboardPage from './pages/DashboardPage';
import TaskDetailPage from './pages/TaskDetailPage';
import FilteredTasksPage from './pages/FilteredTasksPage'; 
import NotificationToast from './components/NotificationToast';
import NavigationBar from './components/NavigationBar';

function App() {
  const [notifications, setNotifications] = useState({});
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const notifiedTasksRef = useRef({}); 
  const location = useLocation();

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const coursesResponse = await fetch('http://localhost:5000/api/courses');
        if (!coursesResponse.ok) throw new Error('Failed to fetch courses');
        
        const courses = await coursesResponse.json();
        let allTasks = [];
        for (const course of courses) {
          const tasksResponse = await fetch(`http://localhost:5000/api/tasks/${course._id}`);
          if (tasksResponse.ok) {
            const courseTasks = await tasksResponse.json();
            allTasks.push(...courseTasks);
          }
        }
        setTasks(allTasks);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Global task fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTasks();
    const intervalId = setInterval(fetchAllTasks, 20000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (location.pathname === '/' || tasks.length === 0) {
        return;
      }

      const now = new Date();
      tasks.forEach(task => {
        if (task.isCompleted) return;

        const deadlineDate = new Date(task.deadline);
        const diff = deadlineDate.getTime() - now.getTime();

        if (diff <= 0 && notifiedTasksRef.current[task._id] !== 'expired') {
          addNotification(`Task "${task.title}" has expired!`, 'error');
          notifiedTasksRef.current[task._id] = 'expired';
          return;
        }

        const createdAtDate = new Date(task.createdAt);
        const originalTimeDiff = Math.max(1, deadlineDate.getTime() - createdAtDate.getTime());
        const percentageLeft = (diff / originalTimeDiff) * 100;
        
        const isUrgent = percentageLeft < 30;

        if (isUrgent && notifiedTasksRef.current[task._id] !== 'urgent' && notifiedTasksRef.current[task._id] !== 'expired') {
          addNotification(`Task "${task.title}" is urgent!`, 'urgent');
          notifiedTasksRef.current[task._id] = 'urgent';
        }
      });
    }, 5000);

    return () => clearInterval(checkInterval);
  }, [tasks, location.pathname]);


  const getNotificationKey = (message) => {
    const taskMatch = message.match(/Task "([^"]+)"/);
    return taskMatch ? `task-${taskMatch[1]}` : message;
  };

  const addNotification = (message, type = 'info') => {
    const key = getNotificationKey(message);
    const id = Date.now() + Math.random();
    const newNotification = { id, message, type };

    setNotifications(prevNots => {
      if (prevNots[key]) return prevNots;
      return { ...prevNots, [key]: newNotification };
    });
  };

  const removeNotification = (idToRemove) => {
    setNotifications(prevNots => {
      const newNots = { ...prevNots };
      const keyToDelete = Object.keys(newNots).find(key => newNots[key].id === idToRemove);
      if (keyToDelete) delete newNots[keyToDelete];
      return newNots;
    });
  };

  return (
    <div className="App">
      <NavigationBar />
      <div className="notification-container">
        {Object.values(notifications).map((notif) => (
          <NotificationToast
            key={notif.id}
            id={notif.id}
            message={notif.message}
            type={notif.type}
            onClose={removeNotification}
          />
        ))}
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CourseListPage addNotification={addNotification} />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
        <Route 
          path="/dashboard" 
          element={<DashboardPage tasks={tasks} loading={loading} error={error} />} 
        />
        <Route path="/task/:taskId" element={<TaskDetailPage />} />
        <Route path="/tasks/:filterType" element={<FilteredTasksPage />} />
        
      </Routes>
    </div>
  );
}

export default App;


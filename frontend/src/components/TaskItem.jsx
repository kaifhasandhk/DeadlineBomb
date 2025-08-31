import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TaskItem.css';


const CrossIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const TaskItem = ({ task, onTaskUpdated }) => {
  const [timerText, setTimerText] = useState('');
  const [urgencyClass, setUrgencyClass] = useState('safe');
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      if (task.isCompleted) {
        setUrgencyClass('completed');
        setTimerText('Done');
        setProgress(100);
        return;
      }

      const now = new Date();
      const deadline = new Date(task.deadline);
      const diff = deadline - now;

      if (diff <= 0) {
        setUrgencyClass('expired');
        setTimerText('Expired');
        setProgress(0);
        return;
      }

      const totalDuration = deadline - new Date(task.createdAt);
      const percentageLeft = Math.max(0, (diff / totalDuration) * 100);
      setProgress(percentageLeft);
      
      if (percentageLeft < 30) setUrgencyClass('urgent');
      else if (percentageLeft < 70) setUrgencyClass('upcoming');
      else setUrgencyClass('safe');

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (diff > 3600000) {
         if (days > 0) {
            setTimerText(`${days}d ${hours}h`);
         } else {
            setTimerText(`${hours}h ${minutes}m`);
         }
      } else {
        setTimerText(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [task]);


  const handleMarkComplete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: true }),
      });
      onTaskUpdated();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
          method: 'DELETE',
        });
        onTaskUpdated();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };
  
  const formatDeadline = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = ["th","st","nd","rd"][((day%100)>3 && (day%100)<21)?0:day%10]||"th";
    let formatted = new Intl.DateTimeFormat('en-US', options).format(date);
    formatted = formatted.replace(String(day), `${day}${suffix}`);
    return formatted.replace(',',' at');
  };

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <Link to={`/task/${task._id}`} className={`task-item-link ${urgencyClass}`}>
      <div className="task-item-content">
        <h3 className="task-item-title">{task.title}</h3>
        <p className="task-item-deadline">Due: {formatDeadline(task.deadline)}</p>
         {!task.isCompleted && (
          <div className="task-item-actions">
            <button onClick={handleMarkComplete} className="task-action-btn complete-btn" title="Mark as complete">
              ✓
            </button>
            <button onClick={handleDelete} className="task-action-btn delete-btn" title="Delete task">
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="task-item-timer">
        <svg className="progress-ring" width="120" height="120">
          <circle className="progress-ring-bg" r={radius} cx="60" cy="60" />
          <circle
            className="progress-ring-circle"
            r={radius}
            cx="60"
            cy="60"
            style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          />
        </svg>
        <span className="timer-text">{timerText}</span>
      </div>
    </Link>
  );
};

export default TaskItem;


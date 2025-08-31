import React from 'react';
import { Link } from 'react-router-dom'; // <-- STEP 1: Import Link
import './DashboardPage.css';

const DashboardPage = ({ tasks, loading, error }) => {
  if (loading) {
    return <div className="page-content-wrapper"><p className="loading-text">Loading Dashboard...</p></div>;
  }
  if (error) {
    return <div className="page-content-wrapper"><p className="error-text">Error: {error}</p></div>;
  }

  const now = new Date();
  const activeTasks = tasks.filter(task => !task.isCompleted && new Date(task.deadline) > now).length;
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  
  const urgentTasksCount = tasks.filter(task => {
    if (task.isCompleted || new Date(task.deadline) <= now) return false;
    const originalTimeDiff = Math.max(1, new Date(task.deadline).getTime() - new Date(task.createdAt).getTime());
    const remainingTimeDiff = new Date(task.deadline).getTime() - now.getTime();
    const percentageLeft = (remainingTimeDiff / originalTimeDiff) * 100;
    return percentageLeft < 30;
  }).length;

  return (
    <div className="page-content-wrapper">
      <h1 className="dashboard-title">Your Task Dashboard</h1>
      <div className="dashboard-stats-grid">
        {/* === START OF CHANGE: Each card is now a link === */}
        <Link to="/tasks/active" className="stat-card-link">
          <div className="stat-card active-tasks">
            <h3>Active Tasks</h3>
            <p className="stat-value">{activeTasks}</p>
          </div>
        </Link>
        <Link to="/tasks/completed" className="stat-card-link">
          <div className="stat-card completed-tasks">
            <h3>Completed Tasks</h3>
            <p className="stat-value">{completedTasks}</p>
          </div>
        </Link>
        <Link to="/tasks/urgent" className="stat-card-link">
          <div className="stat-card urgent-tasks">
            <h3>Urgent Tasks</h3>
            <p className="stat-value">{urgentTasksCount}</p>
          </div>
        </Link>
        <Link to="/tasks/total" className="stat-card-link">
          <div className="stat-card total-tasks">
            <h3>Total Tasks</h3>
            <p className="stat-value">{tasks.length}</p>
          </div>
        </Link>
        {/* === END OF CHANGE === */}
      </div>
    </div>
  );
};

export default DashboardPage;


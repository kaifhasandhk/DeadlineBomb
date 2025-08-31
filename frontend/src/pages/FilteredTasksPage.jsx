import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TaskItem from '../components/TaskItem'; // We will reuse the TaskItem component
import './FilteredTasksPage.css'; // We will create this next

const FilteredTasksPage = () => {
  const { filterType } = useParams(); // Gets 'active', 'completed', etc. from the URL
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Create a user-friendly title from the filterType
  const pageTitle = filterType.charAt(0).toUpperCase() + filterType.slice(1) + " Tasks";

  useEffect(() => {
    const fetchFilteredTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/tasks/filter/${filterType}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${filterType} tasks`);
        }
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredTasks();
  }, [filterType]); // Refetch if the filterType in the URL changes

  // This function is needed by TaskItem to refresh the list after a delete/complete action
  const handleTaskUpdate = () => {
      const fetchFilteredTasks = async () => {
      const response = await fetch(`http://localhost:5000/api/tasks/filter/${filterType}`);
      const data = await response.json();
      setTasks(data);
    };
    fetchFilteredTasks();
  };

  // Group tasks by course code
  const groupedTasks = tasks.reduce((acc, task) => {
    const courseCode = task.courseCode || 'Unassigned'; // Use a default for tasks without a course
    if (!acc[courseCode]) {
      acc[courseCode] = [];
    }
    acc[courseCode].push(task);
    return acc;
  }, {});

  if (loading) {
    return <div className="page-content-wrapper"><p className="loading-text">Loading tasks...</p></div>;
  }

  if (error) {
    return <div className="page-content-wrapper"><p className="error-text">Error: {error}</p></div>;
  }

  return (
    <div className="page-content-wrapper">
      <div className="filtered-tasks-header">
        <h1>{pageTitle}</h1>
        <Link to="/dashboard" className="back-to-dashboard-link">&larr; Back to Dashboard</Link>
      </div>

      {tasks.length === 0 ? (
        <p className="no-tasks-message">No {filterType} tasks found.</p>
      ) : (
        <div className="task-groups-container">
          {Object.keys(groupedTasks).map(courseCode => (
            <div key={courseCode} className="course-group">
              <h2 className="course-group-title">{courseCode}</h2>
              <div className="task-list">
                {groupedTasks[courseCode].map(task => (
                  <TaskItem key={task._id} task={task} onTaskUpdated={handleTaskUpdate} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilteredTasksPage;
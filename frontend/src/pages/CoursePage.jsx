import './CoursePage.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

const CoursePage = () => {
  const { courseId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTasks, setRefreshTasks] = useState(false);
  
  const [sortBy, setSortBy] = useState('deadline');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterCompletion, setFilterCompletion] = useState('All');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tasks/${courseId}`);
        let data = await response.json();

        if (filterDifficulty !== 'All') {
          data = data.filter(task => task.difficulty === filterDifficulty);
        }
        if (filterCompletion !== 'All') {
          const isCompleted = filterCompletion === 'Completed';
          data = data.filter(task => task.isCompleted === isCompleted);
        }

        data.sort((a, b) => {
          if (sortBy === 'deadline') {
            return new Date(a.deadline) - new Date(b.deadline);
          } else if (sortBy === 'difficulty') {
            const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
            return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
          }
          return 0;
        });
        
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchTasks();
    }
    setRefreshTasks(false);
  }, [courseId, refreshTasks, sortBy, filterDifficulty, filterCompletion]);

  const handleTaskAdded = () => {
    setRefreshTasks(true);
  };

  const handleTaskUpdated = () => {
    setRefreshTasks(true);
  };

  return (
    <div className="page-content-wrapper">
      <h1>Tasks for the Course</h1>
      
      {/* === START OF LAYOUT CHANGE === */}
      <div className="course-page-main-layout">
        <TaskForm courseId={courseId} onTaskAdded={handleTaskAdded} />
        
        <div className="task-legend-card">
          <h3>Task Color Legend</h3>
          <ul className="legend-list">
            <li><span className="legend-color-dot safe"></span> Safe</li>
            <li><span className="legend-color-dot upcoming"></span> Upcoming</li>
            <li><span className="legend-color-dot urgent"></span> Urgent</li>
            <li><span className="legend-color-dot expired"></span> Expired</li>
            <li><span className="legend-color-dot completed"></span> Completed</li>
          </ul>
          <p className="legend-note">
            Tasks become "Upcoming" when 70% of their time is left and "Urgent" when only 30% remains.
          </p>
        </div>
      </div>
      {/* === END OF LAYOUT CHANGE === */}

      <div className="filter-sort-controls">
        <div className="control-group">
          <label htmlFor="sortBy">Sort By:</label>
          <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="deadline">Deadline</option>
            <option value="difficulty">Difficulty</option>
          </select>
        </div>
        <div className="control-group">
          <label htmlFor="filterDifficulty">Difficulty:</label>
          <select id="filterDifficulty" value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}>
            <option value="All">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div className="control-group">
          <label htmlFor="filterCompletion">Status:</label>
          <select id="filterCompletion" value={filterCompletion} onChange={(e) => setFilterCompletion(e.target.value)}>
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Incomplete">Incomplete</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div>
          {tasks.length === 0 ? (
            <p>No tasks found for this course with the current filters.</p>
          ) : (
            <div className="task-list">
              {tasks.map(task => (
                <TaskItem key={task._id} task={task} onTaskUpdated={handleTaskUpdated} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoursePage;

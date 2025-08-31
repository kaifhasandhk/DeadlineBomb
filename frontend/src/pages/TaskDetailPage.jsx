import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import EditTaskForm from '../components/EditTaskForm';
import AttachmentManager from '../components/AttachmentManager'; // <-- STEP 1: Import the new component
import './TaskDetailPage.css';

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const fetchTaskDetails = async () => {
    try {
      // No need to set loading to true here, to avoid flashing on refetch
      const response = await fetch(`http://localhost:5000/api/tasks/details/${taskId}`);
      if (!response.ok) {
        throw new Error('Task not found');
      }
      const data = await response.json();
      setTask(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Only set loading false on initial fetch
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const handleSave = () => {
    setIsEditing(false);
    fetchTaskDetails();
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleAttachmentUpdate = () => {
    fetchTaskDetails(); // Refreshes task data after upload/delete
  };


  if (loading) return <div className="page-content-wrapper"><p className="loading-text">Loading Task...</p></div>;
  if (error) return <div className="page-content-wrapper"><p className="error-text">Error: {error}</p></div>;
  if (!task) return <div className="page-content-wrapper"><p>No task data.</p></div>;

  return (
    <div className="page-content-wrapper">
      <div className="task-detail-container">
        <div className="task-detail-header">
          <h1 className="task-detail-title">{task.title}</h1>
          <Link to={`/courses/${task.courseId}`} className="back-to-course-link">
            &larr; Back to Course
          </Link>
        </div>

        <div className="task-detail-grid">
          <div className="task-detail-main">
            <div className="task-detail-card">
              <h3>Description</h3>
              <p>{task.description || 'No description provided.'}</p>
            </div>
            
            {/* === START OF ATTACHMENT INTEGRATION === */}
            <div className="task-detail-card">
              <h3>Attachments</h3>
              <AttachmentManager task={task} onUpdate={handleAttachmentUpdate} />
            </div>
            {/* === END OF ATTACHMENT INTEGRATION === */}

          </div>

          <div className="task-detail-sidebar">
            {isEditing ? (
              <div className="task-detail-card">
                <h3>Edit Task</h3>
                <EditTaskForm task={task} onSave={handleSave} onCancel={handleCancel} />
              </div>
            ) : (
              <>
                <div className="task-detail-card">
                  <h3>Details</h3>
                  <ul className="details-list">
                    <li><strong>Status:</strong> {task.isCompleted ? 'Completed' : 'Incomplete'}</li>
                    <li><strong>Difficulty:</strong> {task.difficulty}</li>
                    <li><strong>Created:</strong> {formatDate(task.createdAt)}</li>
                    <li><strong>Due:</strong> {formatDate(task.deadline)}</li>
                  </ul>
                  <button onClick={() => setIsEditing(true)} className="edit-task-sidebar-btn">
                    Edit Task
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;


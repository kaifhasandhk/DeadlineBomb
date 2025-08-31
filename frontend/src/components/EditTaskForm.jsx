import React, { useState } from 'react';
import './EditTaskForm.css'; 

const EditTaskForm = ({ task, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    deadline: task.deadline.substring(0, 16), 
    difficulty: task.difficulty,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      onSave(); 
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-task-form">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
        />
      </div>
      <div className="form-group">
        <label htmlFor="deadline">Deadline</label>
        <input
          type="datetime-local"
          id="deadline"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="difficulty">Difficulty</label>
        <select
          id="difficulty"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          required
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <div className="edit-form-actions">
        <button type="button" onClick={onCancel} className="cancel-edit-btn">Cancel</button>
        <button type="submit" className="save-edit-btn">Save Changes</button>
      </div>
    </form>
  );
};

export default EditTaskForm;

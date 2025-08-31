import React, { useState } from 'react';

const TaskForm = ({ courseId, onTaskAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    difficulty: 'Medium',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, courseId }),
      });

      if (response.ok) {
        console.log('Task added successfully!');
        onTaskAdded();
        setFormData({ title: '', description: '', deadline: '', difficulty: 'Medium' });
      } else {
        console.error('Failed to add task.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container form-container-compact">
      <h3>Add New Task</h3>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Task Title (e.g., Assignment 1)"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description (optional)"
      ></textarea>
      <input
        type="datetime-local"
        name="deadline"
        value={formData.deadline}
        onChange={handleChange}
        required
      />
      <select
        name="difficulty"
        value={formData.difficulty}
        onChange={handleChange}
      >
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;

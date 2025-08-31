import React, { useState } from 'react';

const CourseForm = ({ onCourseAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    facultyName: '',
    routine: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Course added successfully!'); 
        onCourseAdded();
        setFormData({ title: '', code: '', facultyName: '', routine: '' });
      } else {
        console.error('Failed to add course.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container form-container-compact">

      <h3>Add New Course</h3>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Course Title (e.g., Software Engineering)"
        required
      />
      <input
        type="text"
        name="code"
        value={formData.code}
        onChange={handleChange}
        placeholder="Course Code (e.g., CSE470)"
        required
      />
      <input
        type="text"
        name="facultyName"
        value={formData.facultyName}
        onChange={handleChange}
        placeholder="Faculty Name"
        required
      />
      <input
        type="text"
        name="routine"
        value={formData.routine}
        onChange={handleChange}
        placeholder="Routine (optional)"
      />
      <button type="submit">Add Course</button>
    </form>
  );
};

export default CourseForm;

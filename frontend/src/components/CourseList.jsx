// frontend/src/components/CourseList.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const CourseList = ({ courses }) => {
  return (
    <div className="course-list">
      <h2>My Courses</h2>
      {courses.length === 0 ? (
        <p>No courses added yet. Add a new one!</p>
      ) : (
        <div className="course-grid">
          {courses.map(course => (
            <div key={course._id} className="course-card">
              <Link to={`/courses/${course._id}`}>
                <h3>{course.title} ({course.code})</h3>
                <p>Faculty: {course.facultyName}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
import './CourseListPage.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseList from '../components/CourseList';
import CourseForm from '../components/CourseForm';

const CourseListPage = ({ addNotification }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshCourses, setRefreshCourses] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        addNotification(`Failed to load courses: ${error.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
    setRefreshCourses(false);
  }, [refreshCourses, addNotification]);

  const handleCourseAdded = () => {
    setRefreshCourses(true);
    addNotification('Course added successfully!', 'success');
  };

  const handleTestNotification = () => {
    addNotification('This is a test notification!', 'info', 3000);
  };

  return (
    <div className="page-content-wrapper">
      <div className="dashboard-nav-link">
        <Link to="/dashboard" className="button test-notification-btn">View My Dashboard</Link>
        <button onClick={handleTestNotification} className="button test-notification-btn">Test Notification</button>
      </div>

      <CourseForm onCourseAdded={handleCourseAdded} />
      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <CourseList courses={courses} />
      )}
    </div>
  );
};

export default CourseListPage;
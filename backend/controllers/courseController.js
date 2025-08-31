// backend/controllers/courseController.js

const Course = require('../models/Course');

const createCourse = async (req, res) => {
  try {
    const { title, code, facultyName, routine } = req.body;

    if (!title || !code || !facultyName) {
      return res.status(400).json({ message: 'Please include all required fields' });
    }

    const course = await Course.create({
      title,
      code,
      facultyName,
      routine,
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createCourse,
  getCourses,
};
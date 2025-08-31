// backend/models/Course.js

const mongoose = require('mongoose');

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    code: {
      type: String,
      required: [true, 'Please add a course code'],
    },
    facultyName: {
      type: String,
      required: [true, 'Please add the faculty name'],
    },
    routine: {
      type: String,
      required: false, 
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('Course', courseSchema);
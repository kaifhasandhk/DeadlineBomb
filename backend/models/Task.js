// backend/models/Task.js

const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  deadline: {
    type: Date,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
 
  attachment: {
    fileName: String,
    filePath: String, 
    fileType: String, 
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);
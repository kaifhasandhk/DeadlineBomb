// backend/routes/taskRoutes.js

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  createTask,
  getTasksByCourse,
  deleteTask,
  updateTask,
  getTaskAttachment,
  uploadTaskAttachment,
  deleteTaskAttachment,
  getTaskById,
  getFilteredTasks 
} = require('../controllers/taskController');

router.post('/', createTask);
router.get('/:courseId', getTasksByCourse);
router.get('/details/:id', getTaskById);


router.get('/filter/:filterType', getFilteredTasks);


router.delete('/:id', deleteTask);
router.put('/:id', updateTask);

router.put('/upload-attachment/:id', upload.single('attachment'), uploadTaskAttachment);
router.get('/attachment/:id', getTaskAttachment);
router.delete('/attachment/:id', deleteTaskAttachment);

module.exports = router;


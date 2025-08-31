// backend/controllers/taskController.js

const Task = require('../models/Task');
const Course = require('../models/Course'); 
const path = require('path'); 
const fs = require('fs'); 



const createTask = async (req, res) => {
  const { courseId, title, description, deadline, difficulty } = req.body;

  try {
    const newTask = new Task({
      courseId,
      title,
      description,
      deadline,
      difficulty,
    });

    const task = await newTask.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


const getTasksByCourse = async (req, res) => {
  try {
    const tasks = await Task.find({ courseId: req.params.courseId }).sort({ deadline: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure _id and createdAt are not updated through req.body
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.createdAt;

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If there's an attachment, delete the file from the server first
    if (task.attachment && task.attachment.filePath) {
      const filePath = path.join(__dirname, '../', task.attachment.filePath);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete file: ${filePath}`, err);
          // Don't block task deletion if file deletion fails
        } else {
          console.log(`Successfully deleted file: ${filePath}`);
        }
      });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


const uploadTaskAttachment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // If an old attachment exists, delete the old file before saving the new one
    if (task.attachment && task.attachment.filePath) {
      const oldFilePath = path.join(__dirname, '../', task.attachment.filePath);
      fs.unlink(oldFilePath, (err) => {
        if (err) {
          console.error(`Failed to delete old file: ${oldFilePath}`, err);
        } else {
          console.log(`Successfully deleted old file: ${oldFilePath}`);
        }
      });
    }

    task.attachment = {
      fileName: req.file.originalname,
      filePath: req.file.path.replace(/\\/g, '/').split('/backend/')[1], // Store relative path from backend root
      fileType: req.file.mimetype,
    };

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    // Multer errors are caught here (e.g., file type, size limits)
    if (error.message.startsWith('Error:')) {
      return res.status(400).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


const getTaskAttachment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || !task.attachment || !task.attachment.filePath) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    // Construct the absolute path to the file
    const filePath = path.join(__dirname, '../', task.attachment.filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Set appropriate headers for file download
    res.set({
      'Content-Type': task.attachment.fileType,
      'Content-Disposition': `attachment; filename="${task.attachment.fileName}"`,
    });

    // Send the file
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


const deleteTaskAttachment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!task.attachment || !task.attachment.filePath) {
      return res.status(404).json({ message: 'No attachment found for this task' });
    }

    const filePathToDelete = path.join(__dirname, '../', task.attachment.filePath);

    // Delete the file from the server
    fs.unlink(filePathToDelete, async (err) => {
      if (err) {
        console.error(`Failed to delete file from disk: ${filePathToDelete}`, err);
        return res.status(500).json({ message: 'Failed to delete file from server storage' });
      }

      // Remove attachment information from the task document
      task.attachment = undefined; // Or set to an empty object {}
      await task.save();

      res.status(200).json({ message: 'Attachment deleted successfully', task });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getFilteredTasks = async (req, res) => {
  const { filterType } = req.params;
  const now = new Date();
  let query = {};

  // 1. Define the base query for each filter type
  switch (filterType) {
    case 'active':
      query = { isCompleted: false, deadline: { $gt: now } };
      break;
    case 'completed':
      query = { isCompleted: true };
      break;
    case 'urgent': // For urgent, we first find all active tasks
    case 'expired': // For expired, we find all incomplete tasks past their deadline
      query = { isCompleted: false };
      break;
    case 'total':
      query = {}; // Empty query means get all tasks
      break;
    default:
      return res.status(400).json({ message: 'Invalid filter type' });
  }

  try {
    // 2. Fetch tasks and join with course data to get the course code
    let tasks = await Task.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'courses', // The name of the courses collection in MongoDB
          localField: 'courseId',
          foreignField: '_id',
          as: 'courseDetails'
        }
      },
      { $unwind: '$courseDetails' }, // Deconstruct the array from the lookup
      {
        $addFields: { // Add the course code to the main task object
          courseCode: '$courseDetails.code'
        }
      },
      {
        $project: { // Remove the temporary courseDetails object
          courseDetails: 0
        }
      }
    ]);

    // 3. For 'urgent' and 'expired', we need to do a second filter in code
    if (filterType === 'urgent') {
      tasks = tasks.filter(task => {
        const deadline = new Date(task.deadline);
        if (deadline <= now) return false; // Not urgent if it's already past the deadline
        const totalDuration = deadline.getTime() - new Date(task.createdAt).getTime();
        const remaining = deadline.getTime() - now.getTime();
        return (remaining / totalDuration) * 100 < 30;
      });
    }
    
    if (filterType === 'expired') {
        tasks = tasks.filter(task => new Date(task.deadline) <= now);
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


module.exports = {
  createTask,
  getTasksByCourse,
  updateTask,
  deleteTask,
  uploadTaskAttachment,
  getTaskAttachment,
  deleteTaskAttachment,
  getTaskById,
  getFilteredTasks 
};
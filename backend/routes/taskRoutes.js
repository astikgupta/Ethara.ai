const express = require('express');
const { 
  createTask, 
  getTasksByProject, 
  updateTaskStatus, 
  updateTask, 
  deleteTask, 
  getDashboardStats,
  getMyTasks
} = require('../controllers/taskController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .post(protect, admin, createTask);

router.get('/project/:projectId', protect, getTasksByProject);
router.get('/my-tasks', protect, getMyTasks);
router.get('/stats', protect, getDashboardStats);

router.route('/:id')
  .put(protect, admin, updateTask)
  .delete(protect, admin, deleteTask);

router.put('/:id/status', protect, updateTaskStatus);

module.exports = router;
// Route registration check

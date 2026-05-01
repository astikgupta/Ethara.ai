const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const Project = require('../models/Project');

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, assignedTo, projectId, dueDate } = req.body;
  const task = await Task.create({
    title,
    description,
    status,
    assignedTo,
    projectId,
    dueDate,
  });
  res.status(201).json(task);
});

const getTasksByProject = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ projectId: req.params.projectId }).populate('assignedTo', 'name email');
  res.json(tasks);
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  
  task.status = req.body.status;
  await task.save();
  res.json(task);
});

const updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    res.json(task);
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

const getDashboardStats = asyncHandler(async (req, res) => {
  // Find projects where user is a member
  const projects = await Project.find({ members: req.user._id });
  const projectIds = projects.map(p => p._id);
  
  // Find tasks that are either in those projects OR assigned directly to the user
  const tasks = await Task.find({ 
    $or: [
      { projectId: { $in: projectIds } },
      { assignedTo: req.user._id }
    ]
  });
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const pendingTasks = tasks.filter(t => t.status !== 'Done').length;
  const overdueTasks = tasks.filter(t => t.status !== 'Done' && t.dueDate && new Date(t.dueDate) < new Date()).length;
  
  res.json({ totalTasks, completedTasks, pendingTasks, overdueTasks });
});

const getMyTasks = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching tasks for User ID:', req.user._id);
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${tasks.length} tasks for this user`);
    res.json(tasks || []);
  } catch (error) {
    console.error('Error in getMyTasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

module.exports = { createTask, getTasksByProject, updateTaskStatus, updateTask, deleteTask, getDashboardStats, getMyTasks };

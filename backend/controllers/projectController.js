const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');

const createProject = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const project = await Project.create({
    title,
    description,
    createdBy: req.user._id,
    members: [req.user._id],
  });
  res.status(201).json(project);
});

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ members: req.user._id })
    .populate('createdBy', 'name email')
    .populate('members', 'name email');
  res.json(projects);
});

const addMembers = asyncHandler(async (req, res) => {
  const { members } = req.body;
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  
  project.members = [...new Set([...project.members.map(m => m.toString()), ...members])];
  await project.save();
  res.json(project);
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (project) {
    // Delete all tasks associated with this project
    const Task = require('../models/Task');
    await Task.deleteMany({ projectId: req.params.id });
    
    await project.deleteOne();
    res.json({ message: 'Project and associated tasks removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

module.exports = { createProject, getProjects, addMembers, deleteProject };

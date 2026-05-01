const express = require('express');
const { createProject, getProjects, addMembers, deleteProject } = require('../controllers/projectController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.route('/').post(protect, admin, createProject).get(protect, getProjects);
router.route('/:id').delete(protect, admin, deleteProject);
router.put('/:id/members', protect, admin, addMembers);

module.exports = router;

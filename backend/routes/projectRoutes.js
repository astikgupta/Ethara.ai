const express = require('express');
const { createProject, getProjects, addMembers } = require('../controllers/projectController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.route('/').post(protect, admin, createProject).get(protect, getProjects);
router.put('/:id/members', protect, admin, addMembers);

module.exports = router;

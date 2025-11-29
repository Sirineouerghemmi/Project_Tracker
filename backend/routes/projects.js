// backend/routes/projects.js → VERSION FINALE 100% CORRECTE
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  submitProject
} = require('../controllers/projectController');

router.get('/', protect, getProjects);
router.post('/', protect, admin, createProject);
router.put('/:id', protect, admin, updateProject);
router.delete('/:id', protect, admin, deleteProject);
router.post('/:id/submit', protect, submitProject); // LIGNE PARFAITE

module.exports = router;
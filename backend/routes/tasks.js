// backend/routes/tasks.js → VERSION CORRIGÉE
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addStudentFile
} = require('../controllers/taskController');

// CORRIGÉ : cette route doit exister !
router.get('/project/:projectId', protect, getTasks);
router.post('/project/:projectId', protect, createTask);

router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);
router.post('/:id/files', protect, addStudentFile);

module.exports = router;
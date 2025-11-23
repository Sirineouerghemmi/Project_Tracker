// backend/controllers/taskController.js → VERSION FINALE 100% FONCTIONNELLE
const Task = require('../models/Task');
const Project = require('../models/Project');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'task-' + unique + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// GET toutes les tâches d'un projet
const getTasks = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ msg: 'Projet non trouvé' });

    const hasAccess = project.owner.toString() === req.user.id ||
                     project.collaborators?.some(id => id.toString() === req.user.id);

    if (!hasAccess) return res.status(403).json({ msg: 'Accès refusé' });

    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error('Erreur getTasks:', err);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
};

// POST créer une tâche
const createTask = [
  upload.single('pdf'),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId);
      if (!project) return res.status(404).json({ msg: 'Projet non trouvé' });

      if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Non autorisé' });
      }

      const { name, description, deadline, assignedTo } = req.body;
      if (!name || !deadline) {
        return res.status(400).json({ msg: 'Nom et deadline obligatoires' });
      }

      const pdf = req.file ? req.file.path.replace(/\\/g, '/') : null;

      const task = await Task.create({
        name,
        description,
        deadline,
        assignedTo: assignedTo || null,
        pdf,
        project: project._id,
        files: []
      });

      // Ajoute la tâche au projet (champ tasks doit exister dans le modèle Project !)
      project.tasks.push(task._id);
      await project.save();

      const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email');
      res.status(201).json(populatedTask);
    } catch (err) {
      console.error('Erreur création tâche:', err);
      res.status(500).json({ msg: 'Erreur création tâche' });
    }
  }
];

// PUT modifier une tâche
const updateTask = [
  upload.single('pdf'),
  async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ msg: 'Tâche non trouvée' });

      const project = await Project.findById(task.project);
      const isOwner = project.owner.toString() === req.user.id;
      const isAdmin = req.user.role === 'admin';
      const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user.id;

      if (!isOwner && !isAdmin && !isAssigned) {
        return res.status(403).json({ msg: 'Non autorisé' });
      }

      const { name, description, deadline, completed, assignedTo } = req.body;

      if (name) task.name = name;
      if (description !== undefined) task.description = description;
      if (deadline) task.deadline = deadline;
      if (assignedTo) task.assignedTo = assignedTo || null;
      if (completed !== undefined) task.completed = completed === 'true';

      if (req.file) {
        if (task.pdf && fs.existsSync(task.pdf)) {
          fs.unlinkSync(task.pdf);
        }
        task.pdf = req.file.path.replace(/\\/g, '/');
      }

      await task.save();
      const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email');
      res.json(populatedTask);
    } catch (err) {
      console.error('Erreur updateTask:', err);
      res.status(500).json({ msg: 'Erreur mise à jour' });
    }
  }
];

// POST ajouter un fichier exporté par l'étudiant
const addStudentFile = [
  upload.single('file'),
  async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ msg: 'Tâche non trouvée' });

      if (!task.assignedTo || task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Seul l\'étudiant assigné peut exporter' });
      }

      if (!req.file) return res.status(400).json({ msg: 'Aucun fichier' });

      const filePath = req.file.path.replace(/\\/g, '/');
      task.files.push(filePath);
      await task.save();

      res.json({ msg: 'Fichier ajouté avec succès', task });
    } catch (err) {
      console.error('Erreur addStudentFile:', err);
      res.status(500).json({ msg: 'Erreur upload fichier' });
    }
  }
];

// DELETE tâche
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Tâche non trouvée' });

    const project = await Project.findById(task.project);
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Non autorisé' });
    }

    // Supprime les fichiers associés
    if (task.pdf && fs.existsSync(task.pdf)) fs.unlinkSync(task.pdf);
    task.files.forEach(file => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });

    await Task.deleteOne({ _id: task._id });

    // Retire la tâche du projet
    project.tasks = project.tasks.filter(t => t.toString() !== req.params.id);
    await project.save();

    res.json({ msg: 'Tâche supprimée avec succès' });
  } catch (err) {
      console.error('Erreur deleteTask:', err);
      res.status(500).json({ msg: 'Erreur suppression' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addStudentFile
};
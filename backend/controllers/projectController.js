// backend/controllers/projectController.js → VERSION FINALE 100% FONCTIONNELLE (à copier-coller intégralement)
const Project = require('../models/Project');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Configuration Multer (uploads sécurisés)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 Mo max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|docx|zip|jpg|jpeg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) cb(null, true);
    else cb(new Error('Type de fichier non autorisé'));
  }
});

// GET tous les projets
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({})
      .populate('owner', 'name email')
      .populate('submissions.student', 'name email');
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
};

// POST créer un projet (prof uniquement)
const createProject = [
  upload.single('pdf'),
  async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Accès refusé' });

    try {
      const { name, description, deadline } = req.body;
      if (!name || !deadline) return res.status(400).json({ msg: 'Nom et deadline requis' });

      const pdfPath = req.file ? req.file.path.replace(/\\/g, '/') : null;

      const project = await Project.create({
        name,
        description,
        deadline,
        pdf: pdfPath,
        owner: req.user.id,
        submissions: []
      });

      const populated = await Project.findById(project._id)
        .populate('owner', 'name email')
        .populate('submissions.student', 'name email');

      res.status(201).json(populated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Erreur création projet' });
    }
  }
];

// PUT modifier un projet
const updateProject = [
  upload.single('pdf'),
  async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Accès refusé' });

    try {
      const project = await Project.findById(req.params.id);
      if (!project) return res.status(404).json({ msg: 'Projet non trouvé' });

      const { name, description, deadline } = req.body;
      if (name) project.name = name;
      if (description !== undefined) project.description = description;
      if (deadline) project.deadline = deadline;

      if (req.file) {
        if (project.pdf && fs.existsSync(project.pdf)) fs.unlinkSync(project.pdf);
        project.pdf = req.file.path.replace(/\\/g, '/');
      }

      await project.save();

      const populated = await Project.findById(project._id)
        .populate('owner', 'name email')
        .populate('submissions.student', 'name email');

      res.json(populated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Erreur mise à jour' });
    }
  }
];

// DELETE projet
const deleteProject = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Accès refusé' });

  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Projet non trouvé' });

    // Suppression des fichiers
    if (project.pdf && fs.existsSync(project.pdf)) fs.unlinkSync(project.pdf);
    project.submissions.forEach(sub => {
      if (sub.file && fs.existsSync(sub.file)) fs.unlinkSync(sub.file);
    });

    await project.deleteOne();
    res.json({ msg: 'Projet supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erreur suppression' });
  }
};

// POST soumission étudiant → LA SEULE ET UNIQUE VERSION QUI MARCHE À 100%
const submitProject = [
  upload.single('file'),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) return res.status(404).json({ msg: 'Projet non trouvé' });

      if (!req.file) return res.status(400).json({ msg: 'Fichier obligatoire' });

      const filePath = req.file.path.replace(/\\/g, '/');
      const customName = (req.body.customName || req.file.originalname).trim();

      const existingIdx = project.submissions.findIndex(
        s => s.student.toString() === req.user.id
      );

      if (existingIdx !== -1) {
        // Mise à jour
        const oldFile = project.submissions[existingIdx].file;
        if (oldFile && fs.existsSync(oldFile)) fs.unlinkSync(oldFile);

        project.submissions[existingIdx].file = filePath;
        project.submissions[existingIdx].customName = customName;
        project.submissions[existingIdx].submittedAt = Date.now();
      } else {
        // Nouveau rendu
        project.submissions.push({
          student: req.user.id,
          customName,
          file: filePath,
          submittedAt: Date.now()
        });
      }

      await project.save();

      const updatedProject = await Project.findById(req.params.id)
        .populate('owner', 'name email')
        .populate('submissions.student', 'name email');

      res.json({
        msg: 'Rendu déposé avec succès !',
        project: updatedProject
      });
    } catch (err) {
      console.error('Erreur submitProject:', err);
      res.status(500).json({ msg: 'Erreur lors du dépôt' });
    }
  }
];

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  submitProject
};
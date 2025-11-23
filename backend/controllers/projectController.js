// backend/controllers/projectController.js → VERSION FINALE ULTIME (customName + tout parfait)
const Project = require('../models/Project');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'rendu-' + unique + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// GET tous les projets
const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find({ owner: req.user.id })
        .populate('submissions.student', 'name email')
        .sort({ createdAt: -1 });
    } else {
      projects = await Project.find()
        .populate('submissions.student', 'name email')
        .sort({ createdAt: -1 });
    }
    res.json(projects);
  } catch (err) {
    console.error('Erreur getProjects:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST créer un projet (prof uniquement)
const createProject = [
  upload.single('pdf'),
  async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Accès refusé : professeur uniquement' });
      }

      const { name, description, deadline } = req.body;
      if (!name || !deadline) {
        return res.status(400).json({ msg: 'Nom et deadline obligatoires' });
      }

      const pdf = req.file ? req.file.path.replace(/\\/g, '/') : null;

      const project = await Project.create({
        name,
        description,
        deadline,
        pdf,
        owner: req.user.id,
        submissions: [],
        tasks: []
      });

      res.status(201).json(project);
    } catch (err) {
      console.error('Erreur création projet:', err);
      res.status(500).json({ message: 'Erreur création projet' });
    }
  }
];

// POST soumettre ou modifier un rendu (étudiant) → AVEC customName
const submitProject = [
  upload.single('file'),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) return res.status(404).json({ msg: 'Projet non trouvé' });

      if (!req.file) return res.status(400).json({ msg: 'Fichier requis' });

      const filePath = req.file.path.replace(/\\/g, '/');

      // NOM PERSONNALISÉ (l'étudiant l'envoie depuis le modal)
      const customName = req.body.customName?.trim() || req.file.originalname;

      const existingIndex = project.submissions.findIndex(
        s => s.student.toString() === req.user.id
      );

      if (existingIndex !== -1) {
        // MODIFICATION DU RENDEMENT EXISTANT
        const oldFile = project.submissions[existingIndex].file;
        if (oldFile && fs.existsSync(oldFile)) {
          fs.unlinkSync(oldFile);
        }
        project.submissions[existingIndex].file = filePath;
        project.submissions[existingIndex].customName = customName;
        project.submissions[existingIndex].submittedAt = Date.now();
      } else {
        // NOUVEAU RENDEMENT
        project.submissions.push({
          student: req.user.id,
          file: filePath,
          customName: customName,
          submittedAt: Date.now()
        });
      }

      await project.save();

      // On renvoie le projet mis à jour avec population
      const updatedProject = await Project.findById(req.params.id)
        .populate('submissions.student', 'name email');

      res.json({
        msg: 'Rendu enregistré avec succès',
        project: updatedProject
      });
    } catch (err) {
      console.error('Erreur soumission projet:', err);
      res.status(500).json({ msg: 'Erreur lors du dépôt du fichier' });
    }
  }
];

// PUT modifier un projet (prof uniquement)
const updateProject = [
  upload.single('pdf'),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) return res.status(404).json({ msg: 'Projet non trouvé' });

      if (project.owner.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Accès refusé' });
      }

      const { name, description, deadline } = req.body;

      if (name) project.name = name;
      if (description !== undefined) project.description = description;
      if (deadline) project.deadline = deadline;

      if (req.file) {
        if (project.pdf && fs.existsSync(project.pdf)) {
          fs.unlinkSync(project.pdf);
        }
        project.pdf = req.file.path.replace(/\\/g, '/');
      }

      await project.save();
      res.json(project);
    } catch (err) {
      console.error('Erreur updateProject:', err);
      res.status(500).json({ msg: 'Erreur mise à jour' });
    }
  }
];

// DELETE supprimer un projet (prof uniquement)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Projet non trouvé' });

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Accès refusé' });
    }

    // Suppression des fichiers
    if (project.pdf && fs.existsSync(project.pdf)) fs.unlinkSync(project.pdf);
    project.submissions.forEach(sub => {
      if (sub.file && fs.existsSync(sub.file)) fs.unlinkSync(sub.file);
    });

    await Project.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Projet supprimé avec succès' });
  } catch (err) {
    console.error('Erreur deleteProject:', err);
    res.status(500).json({ msg: 'Erreur suppression' });
  }
};

module.exports = {
  getProjects,
  createProject,
  submitProject,
  updateProject,
  deleteProject
};
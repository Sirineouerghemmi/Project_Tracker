// backend/routes/projects.js → VERSION FINALE 100% FONCTIONNELLE
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProjects,
  createProject,
  submitProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

// GET tous les projets
router.get('/', protect, getProjects);

// POST créer un projet (prof)
router.post('/', protect, createProject);

// PUT modifier un projet (prof)
router.put('/:id', protect, updateProject);

// DELETE supprimer un projet (prof)
router.delete('/:id', protect, deleteProject);

// POST soumettre un rendu étudiant → CETTE ROUTE MANQUAIT !
router.post('/:id/submit', protect, submitProject);

// DELETE supprimer SON PROPRE rendu → CETTE ROUTE MANQUAIT AUSSI !
router.delete('/:id/submission', protect, async (req, res) => {
  try {
    const project = await require('../models/Project').findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Projet non trouvé' });

    const index = project.submissions.findIndex(
      s => s.student.toString() === req.user.id
    );

    if (index === -1) return res.status(404).json({ msg: 'Aucun rendu trouvé' });

    const oldFile = project.submissions[index].file;
    if (oldFile && require('fs').existsSync(oldFile)) {
      require('fs').unlinkSync(oldFile);
    }

    project.submissions.splice(index, 1);
    await project.save();

    res.json({ msg: 'Rendu supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erreur suppression rendu' });
  }
});

module.exports = router;
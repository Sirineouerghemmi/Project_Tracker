// backend/routes/users.js → AJOUT D'UNE ROUTE POUR GET CURRENT USER
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// Inscription
router.post('/register', async (req, res) => {
  if (!req.body.role) req.body.role = 'etudiant';
  registerUser(req, res);
});

// Connexion
router.post('/login', loginUser);

// GET current user
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

module.exports = router;
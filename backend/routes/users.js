const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// Inscription – on autorise explicitement le rôle
router.post('/register', async (req, res) => {
  // Si le rôle n’est pas envoyé, on le met à "etudiant" par défaut
  if (!req.body.role) req.body.role = 'etudiant';
  registerUser(req, res);
});

// Connexion
router.post('/login', loginUser);

module.exports = router;
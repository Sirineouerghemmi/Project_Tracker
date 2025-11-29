# Gestion de Projets Academiques - ProjectTracker

Plateforme web complete permettant aux enseignants de gerer leurs projets pedagogiques et aux etudiants de deposer leurs comptes-rendus en toute simplicite.

## Fonctionnalites

### Espace Professeur (Admin)
- Creation de projets avec description et deadline
- Ajout de sujets PDF pour chaque projet
- Visualisation en temps reel des rendus etudiants
- Telechargement des comptes-rendus avec previsualisation
- Modification et suppression des projets

### Espace Etudiant
- Consultation de tous les projets et deadlines
- Telechargement des sujets PDF
- Depot de comptes-rendus (PDF, DOCX, ZIP, Images)
- Nom personnalise des fichiers (ex: "TP1 - DUPONT Jean.pdf")
- Modification a tout moment avant la deadline
- Interface responsive et intuitive

### Fonctionnalites Avancees
- Interface moderne avec design glassmorphism
- Systeme d'authentification securise JWT
- Gestion des erreurs complete et user-friendly

## Architecture Technique

### Frontend (React.js)
src/
components/
   ProjectList.js     # Liste et gestion des projets
   ProjectForm.js     # Formulaire creation/edition
   Navbar.js          # Navigation principale
   Dashboard.js       # Tableau de bord
pages/
   HomePage.js        # Page d'accueil
   Login.js           # Connexion
   Register.js        # Inscription
   DashboardPage.js   # Page dashboard
services/
   api.js            # Configuration Axios
App.js                # Routeur principal

### Backend (Node.js/Express)
backend/
controllers/
   projectController.js  # Gestion projets + uploads
   userController.js     # Authentification
models/
   Project.js           # Schema MongoDB Projets
   User.js              # Schema MongoDB Utilisateurs
middleware/
   auth.js              # JWT protection routes
routes/
   projects.js          # Routes API projets
   users.js             # Routes API utilisateurs
server.js                # Serveur Express

## Installation et Demarrage

### Prérequis
- Node.js 16.x ou superieur
- MongoDB 5.x ou superieur
- npm ou yarn

### 1. Cloner le projet
git clone https://github.com/Sirineouerghemmi/Project_Tracker.git
cd Project_Tracker

### 2. Configuration Backend
cd backend
npm install

# Creer le fichier .env
echo "PORT=5000
MONGO_URI=mongodb://localhost:27017/projecttracker
JWT_SECRET=votre_secret_jwt_super_securise" > .env

# Demarrer le serveur
npm run server

### 3. Configuration Frontend
cd frontend
npm install

# Demarrer l'application React
npm start

### 4. Acces a l'application
- Frontend : http://localhost:3000
- Backend API : http://localhost:5000
- Fichiers uploades : http://localhost:5000/uploads

## Configuration

### Variables d'environnement (.env)
# Backend
PORT=5000
MONGO_URI=mongodb://localhost:27017/projecttracker
JWT_SECRET=votre_secret_jwt_tres_securise

# Frontend (optionnel)
REACT_APP_API_URL=http://localhost:5000/api

### Structure de la Base de Donnees
// Collection: users
{
  name: "String",
  email: "String (unique)",
  password: "String (hashe)",
  role: "admin" | "etudiant"
}

// Collection: projects
{
  name: "String",
  description: "String",
  deadline: "Date",
  pdf: "String (chemin fichier)",
  owner: "ObjectId (ref: User)",
  submissions: [{
    student: "ObjectId (ref: User)",
    customName: "String",
    file: "String (chemin fichier)",
    submittedAt: "Date"
  }]
}

## Utilisation

### Premiere connexion
1. Creer un compte Professeur ou Etudiant
2. Se connecter avec email/mot de passe
3. Acceder au tableau de bord selon le role

### Pour les Professeurs
1. Cliquer sur "+ Creer un nouveau projet"
2. Remplir les informations (nom, description, deadline)
3. Optionnel : joindre un fichier PDF
4. Visualiser les rendus etudiants en temps reel

### Pour les Etudiants
1. Consulter la liste des projets
2. Telecharger les sujets PDF
3. Deposer son compte-rendu avant la deadline
4. Personnaliser le nom du fichier

## Structure des Uploads
uploads/
   projets/           # PDF des sujets
      123456789-sujet.pdf
   rendus/           # Comptes-rendus etudiants
      987654321-tp1-dupont.pdf

## Securite

- Authentification JWT avec expiration
- Hashage bcrypt des mots de passe
- Validation des fichiers (types, taille)
- Protection des routes par role
- Middleware d'authentification global

## Depannage

### Problemes courants
# Erreur de port deja utilise
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# Erreur MongoDB
sudo systemctl start mongod
# ou
mongod --dbpath /path/to/data

# Erreur de permissions uploads
chmod -R 755 uploads/

### Logs de debogage
// Backend - Activer les logs detailles
console.log('Requete recue:', req.method, req.url);
console.log('Donnees:', req.body);
console.log('Utilisateur:', req.user);



## Auteurs

- Sirine Ouerghemmi - Developpeur full-stack

## Remerciements

- React.js et la communaute
- Tailwind CSS pour le design
- MongoDB pour la base de donnees
- Tous les contributeurs

Pour toute question ou support : Ouvrir une issue sur GitHub
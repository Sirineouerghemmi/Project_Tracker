# Gestion de Projets Académiques

Application web full-stack permettant aux professeurs de créer et gérer des projets pédagogiques, et aux étudiants de déposer leurs comptes-rendus et de suivre leurs tâches assignées.

## Fonctionnalités principales

### Professeur (rôle « admin »)
- Créer, modifier et supprimer des projets
- Joindre un sujet au format PDF
- Voir le nombre de comptes-rendus reçus par projet
- Consulter et télécharger les fichiers remis par les étudiants

### Étudiant
- Consulter tous les projets et leurs deadlines
- Télécharger le sujet (PDF) fourni par le professeur
- Déposer son compte-rendu (PDF, DOCX, ZIP) avec un **nom personnalisé** (ex : « TP1 – DUPONT Jean.pdf »)
- Modifier ou supprimer son rendu à tout moment

### Page d’accueil (Home)
- Présentation claire du projet
- Boutons « Se connecter » et « S’inscrire »
- Design épuré et responsive

## Technologies utilisées

| Couche        | Technologie                              |
|---------------|------------------------------------------|
| Frontend      | React.js + React Router + Axios          |
| Stylisation   | Tailwind CSS + Modal (react-modal)       |
| Backend       | Node.js + Express.js                     |
| Base de données | MongoDB + Mongoose                     |
| Authentification | JWT (JSON Web Tokens) + bcrypt        |
| Upload de fichiers | Multer + stockage local (`uploads/`)|
| Gestion des requêtes | API REST complète                 |


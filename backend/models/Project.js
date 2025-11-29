// backend/models/Project.js → VERSION CORRECTE ET SÛRE
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  customName: { 
    type: String, 
    required: true 
  },     // ex: "TP1 - Sirine Ouerghemmi.pdf"
  file: { 
    type: String, 
    required: true 
  },           // chemin du fichier
  submittedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const projectSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: String,
  deadline: { 
    type: Date, 
    required: true 
  },
  pdf: String,                                      // sujet du prof (facultatif)
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  submissions: [submissionSchema]                   // ← SEULEMENT ÇA COMPTE
});

module.exports = mongoose.model('Project', projectSchema);
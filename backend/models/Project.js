// backend/models/Project.js → CORRIGÉ
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date, required: true },
  pdf: { type: String },
  status: { type: String, enum: ['en cours', 'fini'], default: 'en cours' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // AJOUTÉ : lien vers les tâches
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],

  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    file: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
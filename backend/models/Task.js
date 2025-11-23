// backend/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date, required: true },
  pdf: { type: String }, // PDF du prof
  completed: { type: Boolean, default: false },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  files: [{ type: String }], // Fichiers exportés par l'étudiant
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
// src/components/ProjectForm.js
import { useState, useEffect } from 'react';
import API from '../services/api';

const ProjectForm = ({ currentProject, closeModal, refreshProjects }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [pdf, setPdf] = useState(null);
  const [currentFileName, setCurrentFileName] = useState('');

  useEffect(() => {
    if (currentProject) {
      setName(currentProject.name || '');
      setDescription(currentProject.description || '');
      setDeadline(currentProject.deadline ? new Date(currentProject.deadline).toISOString().split('T')[0] : '');
      setCurrentFileName(currentProject.pdf ? currentProject.pdf.split('/').pop() : '');
    } else {
      setName('');
      setDescription('');
      setDeadline('');
      setPdf(null);
      setCurrentFileName('');
    }
  }, [currentProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('deadline', deadline);
    if (pdf) formData.append('pdf', pdf);

    try {
      if (currentProject) {
        await API.put(`/projects/${currentProject._id}`, formData);
      } else {
        await API.post('/projects', formData);
      }
      refreshProjects();
      closeModal();
    } catch (err) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-auto">
      <h2 className="text-3xl font-bold text-indigo-800 text-center mb-8">
        {currentProject ? 'Modifier le projet' : 'Nouveau projet'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Nom du projet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-lg"
        />

        <textarea
          placeholder="Description (facultatif)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-lg resize-none"
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
          className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-lg"
        />

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PDF du sujet (facultatif)
          </label>
          <label className="cursor-pointer inline-block">
            <span className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition">
              Choisir un fichier
            </span>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdf(e.target.files[0])}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-600 ml-2">
            {pdf ? pdf.name : currentFileName ? `Fichier actuel : ${currentFileName}` : 'Aucun fichier sélectionné'}
          </p>
        </div>

        <div className="flex justify-center gap-6 pt-6">
          <button
            type="button"
            onClick={closeModal}
            className="px-10 py-4 bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition"
          >
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
// src/components/ProjectForm.js → VERSION FINALE (modal parfait + bouton bien placé)
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
      setName(''); setDescription(''); setDeadline(''); setPdf(null); setCurrentFileName('');
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
      if (currentProject) await API.put(`/projects/${currentProject._id}`, formData);
      else await API.post('/projects', formData);
      refreshProjects();
      closeModal();
    } catch (err) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8">
      <h2 className="text-3xl font-bold text-center text-indigo-800 mb-8">
        {currentProject ? 'Modifier le projet' : 'Nouveau projet'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-7">

        <input
          type="text"
          placeholder="Nom du projet"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-600 outline-none text-lg"
        />

        <textarea
          placeholder="Description (facultatif)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows="3"
          className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-600 outline-none text-lg resize-none"
        />

        <input
          type="date"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          required
          className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-600 outline-none text-lg"
        />

        {/* PDF – Bouton bien en dessous */}
        <div className="space-y-5">
          <label className="block text-lg font-medium text-gray-700">
            PDF du sujet (facultatif)
          </label>

          <div>
            <label className="cursor-pointer">
              <span className="inline-block px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105">
                Choisir un PDF
              </span>
              <input
                type="file"
                accept=".pdf"
                onChange={e => setPdf(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          <p className="text-sm text-gray-600">
            {pdf ? pdf.name : currentFileName ? `Fichier actuel : ${currentFileName}` : 'Aucun fichier sélectionné'}
          </p>
        </div>

        {/* Boutons */}
        <div className="flex justify-center gap-6 pt-6">
          <button
            type="button"
            onClick={closeModal}
            className="px-10 py-4 bg-gradient-to-r from-gray-300 to-gray-500 text-white font-bold rounded-full shadow hover:shadow-lg transition"
          >
            Annuler
          </button>

          <button
            type="submit"
            className="px-12 py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            {currentProject ? 'Mettre à jour' : 'Créer le projet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
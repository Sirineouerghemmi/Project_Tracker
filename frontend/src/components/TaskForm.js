// src/components/TaskForm.js
import { useState, useEffect } from 'react';
import API from '../services/api';
import socket from '../socket';

const TaskForm = ({ 
  closeModal, 
  currentTask, 
  projectId, 
  setTasks, 
  tasks,
  refreshTasks // ← Ajouté pour forcer le rechargement (très important)
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [completed, setCompleted] = useState(false);
  const [pdf, setPdf] = useState(null);
  const [assignedTo, setAssignedTo] = useState('');

  // Pré-remplir si on modifie une tâche existante
  useEffect(() => {
    if (currentTask) {
      setName(currentTask.name || '');
      setDescription(currentTask.description || '');
      setDeadline(currentTask.deadline ? new Date(currentTask.deadline).toISOString().split('T')[0] : '');
      setCompleted(currentTask.completed || false);
      setAssignedTo(currentTask.assignedTo || '');
      setPdf(null);
    } else {
      // Réinitialiser pour une nouvelle tâche
      setName('');
      setDescription('');
      setDeadline('');
      setCompleted(false);
      setAssignedTo('');
      setPdf(null);
    }
  }, [currentTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('deadline', deadline);
    formData.append('completed', completed);
    if (assignedTo) formData.append('assignedTo', assignedTo);
    if (pdf) formData.append('pdf', pdf);

    try {
      let updatedTask;

      if (currentTask) {
        // === MODIFICATION ===
        const { data } = await API.put(`/tasks/${currentTask._id}`, formData);
        updatedTask = data;
        setTasks(prev => prev.map(t => t._id === currentTask._id ? updatedTask : t));
      } else {
        // === CRÉATION ===
        const { data } = await API.post(`/tasks/project/${projectId}`, formData);
        updatedTask = data;
        setTasks(prev => [...prev, updatedTask]); // Ajout en haut
      }

      // Notification en temps réel
      socket.emit('updateProject', { 
        projectId, 
        action: currentTask ? 'taskUpdated' : 'taskCreated',
        taskId: updatedTask._id 
      });

      // Force le rechargement complet (très important pour l'étudiant)
      if (refreshTasks) refreshTasks();

      closeModal();

    } catch (err) {
      console.error('Erreur sauvegarde tâche :', err.response || err);
      alert('Erreur lors de la sauvegarde de la tâche');
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {currentTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Nom de la tâche"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Description (facultatif)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        />

        <div className="flex items-center space-x-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="mr-2 w-5 h-5"
            />
            <span className="text-gray-700">Tâche terminée</span>
          </label>
        </div>

        <input
          type="text"
          placeholder="ID de l'étudiant assigné (facultatif)"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PDF (facultatif)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdf(e.target.files[0] || null)}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={closeModal}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition"
          >
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
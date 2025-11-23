// src/components/TaskList.js → VERSION FINALE 100% FONCTIONNELLE
import { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import Modal from 'react-modal';
import API from '../services/api';

Modal.setAppElement('#root');

const TaskList = ({ projectId, user }) => {
  const [tasks, setTasks] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [showExport, setShowExport] = useState(false);

  // CORRIGÉ : bonne route qui existe dans le backend
  const fetchTasks = async () => {
    try {
      const { data } = await API.get(`/tasks/project/${projectId}`);
      setTasks(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des tâches :', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  const openModal = (task = null) => {
    setCurrentTask(task);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentTask(null);
    setShowExport(false);
  };

  const toggleComplete = async (task) => {
    try {
      await API.put(`/tasks/${task._id}`, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      alert('Erreur lors de la mise à jour de la tâche');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentTask) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await API.post(`/tasks/${currentTask._id}/files`, formData);
      alert('Fichier exporté avec succès !');
      fetchTasks();
      closeModal();
    } catch (err) {
      alert('Erreur lors de l’upload du fichier');
    }
  };

  const isProf = user?.role === 'admin';
  const isAssigned = (task) => task.assignedTo?._id === user?._id || task.assignedTo === user?._id;

  return (
    <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-3xl font-bold text-indigo-900">Tâches du projet</h3>
        {isProf && (
          <button
            onClick={() => openModal()}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold text-lg rounded-full shadow-lg transform hover:scale-105 transition"
          >
            + Ajouter une tâche
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-xl">
          Aucune tâche pour le moment
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition"
            >
              <h4 className="text-2xl font-bold text-indigo-800 mb-2">{task.name}</h4>
              <p className="text-gray-600 mb-4">{task.description || 'Pas de description'}</p>
              <p className="text-sm text-gray-500 mb-4">
                Deadline : <span className="font-bold text-indigo-600">
                  {new Date(task.deadline).toLocaleDateString('fr-FR')}
                </span>
              </p>

              <div className="flex items-center gap-3 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${task.completed ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                  {task.completed ? 'Terminée' : 'En cours'}
                </span>
                {isAssigned(task) && (
                  <button
                    onClick={() => toggleComplete(task)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {task.completed ? 'Marquer non terminée' : 'Marquer terminée'}
                  </button>
                )}
              </div>

              {task.pdf && (
                <a
                  href={`http://localhost:5000/${task.pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mb-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm"
                >
                  Voir le sujet (PDF)
                </a>
              )}

              {task.files && task.files.length > 0 && (
                <div className="mb-4">
                  <p className="font-semibold text-gray-700 mb-2">Fichiers remis :</p>
                  {task.files.map((file, i) => (
                    <a
                      key={i}
                      href={`http://localhost:5000/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-green-600 hover:underline text-sm mb-1"
                    >
                      Fichier {i + 1} ({file.split('/').pop()})
                    </a>
                  ))}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                {(isProf || isAssigned(task)) && (
                  <button
                    onClick={() => openModal(task)}
                    className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-full transition"
                  >
                    Modifier
                  </button>
                )}
                {isAssigned(task) && (
                  <button
                    onClick={() => {
                      setCurrentTask(task);
                      setShowExport(true);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-full transition transform hover:scale-105"
                  >
                    Exporter mon travail
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL AJOUT/MODIF TÂCHE OU UPLOAD FICHIER */}
      <Modal
        isOpen={modalIsOpen || showExport}
        onRequestClose={closeModal}
        className="bg-white p-10 rounded-3xl shadow-3xl max-w-lg mx-auto outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      >
        {showExport ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-indigo-900 mb-8">Exporter votre travail</h2>
            <input
              type="file"
              onChange={handleFileUpload}
              className="block w-full text-lg text-gray-900 border border-gray-300 rounded-xl cursor-pointer bg-gray-50 p-4 mb-6"
            />
            <button
              onClick={closeModal}
              className="px-10 py-4 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-full"
            >
              Annuler
            </button>
          </div>
        ) : (
          <TaskForm
            closeModal={closeModal}
            currentTask={currentTask}
            projectId={projectId}
            refreshTasks={fetchTasks}
          />
        )}
      </Modal>
    </div>
  );
};

export default TaskList;
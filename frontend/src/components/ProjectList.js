// src/components/ProjectList.js → VERSION 100% SANS ERREUR + MODAL PARFAIT
import { useState } from 'react';
import Modal from 'react-modal';
import ProjectForm from './ProjectForm';
import API from '../services/api';

Modal.setAppElement('#root');

const ProjectList = ({ projects = [], user, refreshProjects }) => {
  const [profModalOpen, setProfModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const isProf = user?.role === 'admin';

  const openProfModal = (project = null) => {
    setCurrentProject(project);
    setProfModalOpen(true);
  };

  const closeProfModal = () => {
    setProfModalOpen(false);
    setCurrentProject(null);
  };

  const openStudentModal = (project) => {
    if (!project) return;
    setSelectedProject(project);
    const submission = getMySubmission(project);
    setFileName(submission?.customName || '');
    setSelectedFile(null);
    setStudentModalOpen(true);
  };

  const closeStudentModal = () => {
    setStudentModalOpen(false);
    setSelectedProject(null);
    setFileName('');
    setSelectedFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce projet ?')) return;
    await API.delete(`/projects/${id}`);
    refreshProjects();
  };

  const handleSubmitFile = async () => {
    if (!selectedFile) return alert('Veuillez sélectionner un fichier');
    if (!fileName.trim()) return alert('Veuillez donner un nom à votre rendu');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('customName', fileName.trim());

    try {
      await API.post(`/projects/${selectedProject._id}/submit`, formData);
      alert('Rendu déposé avec succès !');
      closeStudentModal();
      refreshProjects();
    } catch (err) {
      alert('Erreur lors du dépôt');
    }
  };

  const handleDeleteSubmission = async (projectId) => {
    if (!window.confirm('Supprimer définitivement ton rendu ?')) return;
    await API.delete(`/projects/${projectId}/submission`);
    refreshProjects();
  };

  // PROTECTION CONTRE NULL / UNDEFINED
  const hasSubmitted = (project) => {
    if (!project || !project.submissions || !Array.isArray(project.submissions)) return false;
    return project.submissions.some(sub => {
      if (!sub || !sub.student) return false;
      const studentId = sub.student._id || sub.student;
      return studentId && studentId.toString() === user?._id;
    });
  };

  const getMySubmission = (project) => {
    if (!project || !project.submissions || !Array.isArray(project.submissions)) return null;
    return project.submissions.find(sub => {
      if (!sub || !sub.student) return false;
      const studentId = sub.student._id || sub.student;
      return studentId && studentId.toString() === user?._id;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-8">
      {isProf && (
        <div className="text-center mb-12">
          <button
            onClick={() => openProfModal()}
            className="px-10 py-6 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold text-xl rounded-full shadow-2xl transition transform hover:scale-105"
          >
            + Ajouter un projet
          </button>
        </div>
      )}

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 hover:shadow-purple-400 transition-all duration-300"
          >
            <h3 className="text-3xl font-bold text-indigo-900 mb-4">{project.name || 'Sans titre'}</h3>
            <p className="text-gray-600 text-lg mb-6">{project.description || 'Pas de description'}</p>
            <p className="text-gray-700 font-semibold mb-8">
              Deadline : <span className="text-indigo-600 font-bold text-xl">
                {project.deadline ? new Date(project.deadline).toLocaleDateString('fr-FR') : 'Non définie'}
              </span>
            </p>

            {project.pdf && (
              <a
                href={`http://localhost:5000/${project.pdf}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mb-8 px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition"
              >
                Télécharger le sujet
              </a>
            )}

            {/* ÉTUDIANT */}
            {!isProf && (
              <div className="mt-8 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl border-2 border-indigo-300">
                {hasSubmitted(project) ? (
                  <div className="text-center space-y-6">
                    <p className="text-green-700 font-bold text-2xl">Rendu déposé !</p>

                    <div className="bg-white p-6 rounded-2xl shadow-inner border-2 border-green-300">
                      <p className="text-gray-700 font-medium mb-3">Ton fichier :</p>
                      <p className="text-lg font-bold text-indigo-800">
                        {getMySubmission(project)?.customName || 'Mon compte-rendu'}
                      </p>
                      <a
                        href={`http://localhost:5000/${getMySubmission(project)?.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-green-400 transition"
                      >
                        Voir mon compte-rendu
                      </a>
                    </div>

                    <div className="flex justify-center gap-6">
                      <button
                        onClick={() => openStudentModal(project)}
                        className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteSubmission(project._id)}
                        className="px-10 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      onClick={() => openStudentModal(project)}
                      className="inline-block px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold text-l rounded-full shadow-2xl hover:shadow-purple-600 transition transform hover:scale-110"
                    >
                      Déposer mon travail
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* PROF */}
            {isProf && (
              <div className="mt-10 text-center">
                <p className="text-purple-700 font-bold text-xl mb-6">
                  {project.submissions?.length || 0} rendu(s) reçu(s)
                </p>
                <div className="flex justify-center gap-8">
                  <button onClick={() => openProfModal(project)} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(project._id)} className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition">
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Prof */}
      <Modal isOpen={profModalOpen} onRequestClose={closeProfModal} className="bg-white p-10 rounded-3xl shadow-3xl max-w-lg mx-auto outline-none" overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <ProjectForm currentProject={currentProject} closeModal={closeProfModal} refreshProjects={refreshProjects} />
      </Modal>

      {/* Modal Étudiant */}
      <Modal isOpen={studentModalOpen} onRequestClose={closeStudentModal} className="bg-white p-10 rounded-3xl shadow-3xl max-w-lg mx-auto outline-none" overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div>
          <h2 className="text-3xl font-bold text-indigo-900 text-center mb-8">
            {hasSubmitted(selectedProject) ? 'Modifier votre rendu' : 'Déposer votre compte-rendu'}
          </h2>
          <input
            type="text"
            placeholder="Nom de votre rendu (ex: TP1 - NOM Prénom.pdf)"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full px-6 py-4 border-2 border-indigo-300 rounded-xl text-lg mb-6 focus:outline-none focus:border-indigo-600"
          />
          <input
            type="file"
            accept=".pdf,.zip,.docx"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="block w-full text-lg text-gray-900 border border-gray-300 rounded-xl cursor-pointer bg-gray-50 p-4 mb-8"
          />
          <div className="flex justify-center gap-6">
            <button onClick={handleSubmitFile} className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold text-xl rounded-full shadow-2xl transition transform hover:scale-105">
              {hasSubmitted(selectedProject) ? 'Mettre à jour' : 'Déposer'}
            </button>
            <button onClick={closeStudentModal} className="px-12 py-5 bg-gray-500 hover:bg-gray-600 text-white font-bold text-xl rounded-full">
              Annuler
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectList;
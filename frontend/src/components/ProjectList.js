// src/components/ProjectList.js → VERSION CORRIGÉE (sans erreur "project is null")
import { useState } from 'react';
import Modal from 'react-modal';
import ProjectForm from './ProjectForm';
import API from '../services/api';

Modal.setAppElement('#root');

const ProjectList = ({ projects = [], user, refreshProjects }) => {
  const [studentModal, setStudentModal] = useState(false);
  const [profModal, setProfModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const isProf = user?.role === 'admin';

  // CORRECTION : Vérification que project n'est pas null/undefined
  const mySubmission = (project) => {
    if (!project || !project.submissions || !user?._id) return null;
    return project.submissions.find(s => {
      const studentId = s?.student?._id || s?.student;
      return studentId?.toString() === user._id.toString();
    });
  };

  const openStudentModal = (project) => {
    if (!project) return; // CORRECTION : Vérification ajoutée
    setSelectedProject(project);
    const submission = mySubmission(project);
    setFileName(submission?.customName || '');
    setFile(null);
    setStudentModal(true);
  };

  const submitStudentFile = async () => {
    if (!file) return alert('Choisissez un fichier');
    if (!fileName.trim()) return alert('Donnez un nom au fichier');
    if (!selectedProject) return alert('Erreur: projet non sélectionné');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('customName', fileName.trim());

    try {
      await API.post(`/projects/${selectedProject._id}/submit`, formData);
      alert('Rendu déposé avec succès !');
      setStudentModal(false);
      setSelectedProject(null);
      refreshProjects();
    } catch (err) {
      console.error('Erreur dépôt:', err.response?.data || err);
      alert(err.response?.data?.msg || 'Erreur lors du dépôt');
    }
  };

  const openProfModal = (project = null) => {
    setEditProject(project);
    setProfModal(true);
  };

  const deleteProject = async (projectId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await API.delete(`/projects/${projectId}`);
        refreshProjects();
      } catch (err) {
        console.error('Erreur suppression:', err);
        alert('Erreur lors de la suppression');
      }
    }
  };

  // CORRECTION : Vérification que projects est un tableau valide
  if (!Array.isArray(projects)) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Aucun projet disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Bouton Créer (prof) */}
      {isProf && (
        <div className="text-center">
          <button
            onClick={() => openProfModal()}
            className="px-12 py-5 bg-white text-indigo-600 font-bold text-xl rounded-full shadow-2xl hover:shadow-purple-500/50 transition transform hover:scale-105"
          >
            + Créer un nouveau projet
          </button>
        </div>
      )}

      {/* Cartes */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.map((project) => {
          // CORRECTION : Vérification que project existe avant de l'utiliser
          if (!project) return null;
          
          const submission = mySubmission(project);
          const isDeadlinePassed = new Date(project.deadline) < new Date();

          return (
            <div key={project._id} className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300">
              <div className={`p-8 text-white ${isDeadlinePassed ? 'bg-gradient-to-r from-red-500 to-pink-600' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}>
                <h3 className="text-2xl font-bold">{project.name}</h3>
                <p className="text-lg mt-2 opacity-90">
                  Deadline : {new Date(project.deadline).toLocaleDateString('fr-FR')}
                </p>
                {isDeadlinePassed && (
                  <p className="text-sm mt-2 font-semibold">⚠️ Deadline dépassée</p>
                )}
              </div>

              <div className="p-8 space-y-6">
                <p className="text-gray-700 text-lg">
                  {project.description || 'Aucune description'}
                </p>

                {project.pdf && (
                  <a 
                    href={`http://localhost:5000/${project.pdf}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-indigo-600 font-semibold hover:underline"
                  >
                    📄 Télécharger le sujet PDF
                  </a>
                )}

                {/* Étudiant */}
                {!isProf && (
                  <div className="pt-6 border-t">
                    {submission ? (
                      <div className="bg-green-50 rounded-2xl p-6 text-center border-2 border-green-200">
                        <p className="font-bold text-green-800 text-lg">✅ Rendu déposé</p>
                        <p className="text-gray-700 mt-2 font-medium">{submission.customName}</p>
                        <a 
                          href={`http://localhost:5000/${submission.file}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block mt-2 text-blue-600 underline text-sm"
                        >
                          Télécharger mon rendu
                        </a>
                        {!isDeadlinePassed && (
                          <button 
                            onClick={() => openStudentModal(project)} 
                            className="mt-4 text-indigo-600 underline font-semibold"
                          >
                            Modifier le rendu
                          </button>
                        )}
                      </div>
                    ) : (
                      <button 
                        onClick={() => openStudentModal(project)}
                        disabled={isDeadlinePassed}
                        className={`w-full py-5 text-white font-bold text-xl rounded-2xl shadow-xl transition ${
                          isDeadlinePassed 
                            ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-2xl'
                        }`}
                      >
                        {isDeadlinePassed ? 'Deadline dépassée' : 'Déposer mon rendu'}
                      </button>
                    )}
                  </div>
                )}

                {/* Professeur */}
                {isProf && (
                  <div className="pt-6 border-t space-y-5">
                    <p className="text-center font-bold text-purple-700 text-xl">
                      {project.submissions?.length || 0} rendu(s)
                    </p>

                    {/* Liste des rendus étudiants */}
                    {project.submissions && project.submissions.length > 0 && (
                      <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-200">
                        <h4 className="font-bold text-purple-800 text-lg mb-3">📥 Rendus des étudiants :</h4>
                        <div className="space-y-3 max-h-40 overflow-y-auto">
                          {project.submissions.map((sub, index) => (
                            <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg border">
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 text-sm">
                                  {sub.customName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Par: {sub.student?.name || 'Étudiant'} • 
                                  Le: {new Date(sub.submittedAt).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                              <a 
                                href={`http://localhost:5000/${sub.file}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition ml-2"
                              >
                                Télécharger
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        onClick={() => openProfModal(project)}
                        className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() => deleteProject(project._id)}
                        className="flex-1 py-4 bg-gradient-to-r from-gray-700 to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:from-gray-800 hover:to-purple-900 transition transform hover:scale-105"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message si aucun projet */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-xl">Aucun projet disponible pour le moment</p>
          {isProf && (
            <p className="text-gray-500 mt-2">Créez votre premier projet en cliquant sur le bouton ci-dessus</p>
          )}
        </div>
      )}

      {/* MODAL ÉTUDIANT */}
      <Modal
        isOpen={studentModal}
        onRequestClose={() => {
          setStudentModal(false);
          setSelectedProject(null);
        }}
        className="bg-white p-12 rounded-3xl shadow-3xl max-w-lg mx-auto outline-none"
        overlayClassName="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      >
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center text-indigo-800">Déposer mon rendu</h2>
          
          {selectedProject && (
            <div className="bg-indigo-50 p-4 rounded-xl border-2 border-indigo-200">
              <p className="font-semibold text-indigo-800">Projet: {selectedProject.name}</p>
              <p className="text-sm text-indigo-600">
                Deadline: {new Date(selectedProject.deadline).toLocaleDateString('fr-FR')}
              </p>
            </div>
          )}
          
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Nom du fichier :
            </label>
            <input
              type="text"
              placeholder="Ex: TP1 - Votre Nom.pdf"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-lg focus:border-indigo-600 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Fichier :
            </label>
            <input
              type="file"
              accept=".pdf,.docx,.zip,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-lg"
            />
            {file && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Fichier sélectionné: {file.name}
              </p>
            )}
          </div>
          
          <div className="flex gap-6">
            <button
              onClick={submitStudentFile}
              className="flex-1 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xl rounded-xl shadow-xl hover:shadow-2xl transition transform hover:scale-105"
            >
              {selectedProject && mySubmission(selectedProject) ? 'Mettre à jour' : 'Déposer'}
            </button>
            <button
              onClick={() => {
                setStudentModal(false);
                setSelectedProject(null);
              }}
              className="flex-1 py-5 bg-gray-600 text-white font-bold text-xl rounded-xl hover:bg-gray-700 transition"
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL PROF */}
      <Modal
        isOpen={profModal}
        onRequestClose={() => {
          setProfModal(false);
          setEditProject(null);
        }}
        className="bg-white p-8 rounded-3xl shadow-3xl max-w-lg mx-auto outline-none"
        overlayClassName="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        closeTimeoutMS={200}
      >
        <ProjectForm
          currentProject={editProject}
          closeModal={() => {
            setProfModal(false);
            setEditProject(null);
          }}
          refreshProjects={refreshProjects}
        />
      </Modal>
    </div>
  );
};

export default ProjectList;
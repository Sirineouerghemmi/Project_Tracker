// src/components/ProjectCard.js → VERSION CORRIGÉE AVEC DÉPÔT FONCTIONNEL
import { useState } from 'react';
import Modal from 'react-modal';
import API from '../services/api';

Modal.setAppElement('#root');

const ProjectCard = ({ project, user, refreshProjects }) => {
  const [studentModal, setStudentModal] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  
  const isProf = user?.role === 'admin';

  const getMySubmission = () => {
    if (!project.submissions) return null;
    return project.submissions.find(sub => {
      const studentId = sub.student._id || sub.student;
      return studentId?.toString() === user?._id;
    });
  };

  const mySubmission = getMySubmission();
  const hasSubmitted = !!mySubmission;

  const openStudentModal = () => {
    setFileName(mySubmission?.customName || '');
    setFile(null);
    setStudentModal(true);
  };

  const submitStudentFile = async () => {
    if (!file) return alert('Choisissez un fichier');
    if (!fileName.trim()) return alert('Donnez un nom au fichier');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('customName', fileName.trim());

    try {
      await API.post(`/projects/${project._id}/submit`, formData);
      alert('Rendu déposé avec succès !');
      setStudentModal(false);
      refreshProjects();
    } catch (err) {
      console.error(err.response || err);
      alert('Erreur lors du dépôt');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 hover:shadow-purple-400 transition-all duration-300">
      <h3 className="text-3xl font-bold text-indigo-900 mb-4">{project.name}</h3>
      <p className="text-gray-600 text-lg mb-6">{project.description || 'Pas de description'}</p>
      <p className="text-gray-700 font-semibold mb-8">
        Deadline : <span className="text-indigo-600 font-bold text-xl">
          {new Date(project.deadline).toLocaleDateString('fr-FR')}
        </span>
      </p>
      {project.pdf && (
        <a href={`http://localhost:5000/${project.pdf}`} target="_blank" rel="noopener noreferrer"
          className="inline-block mb-8 px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition">
          Télécharger le sujet
        </a>
      )}
      
      {/* ÉTUDIANT : rendu */}
      {!isProf && (
        <>
          {/* Section rendu */}
          <div className="mt-8 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl border-2 border-indigo-300">
            {hasSubmitted ? (
              <div className="text-center space-y-6">
                <p className="text-green-700 font-bold text-2xl">Rendu déposé !</p>
                <div className="bg-white p-6 rounded-2xl shadow-inner border-2 border-green-300">
                  <p className="text-lg font-bold text-indigo-800">
                    {mySubmission?.customName || 'Mon compte-rendu'}
                  </p>
                  <a href={`http://localhost:5000/${mySubmission?.file}`} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-4 px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-full shadow-xl hover:shadow-green-400 transition">
                    Voir mon compte-rendu
                  </a>
                </div>
                <button onClick={openStudentModal} className="text-indigo-600 underline font-semibold">
                  Modifier mon rendu
                </button>
              </div>
            ) : (
              <div className="text-center">
                <button 
                  onClick={openStudentModal}
                  className="inline-block px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold text-l rounded-full shadow-2xl hover:shadow-purple-600 transition transform hover:scale-110">
                  Déposer mon travail
                </button>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* PROF : boutons + compteur */}
      {isProf && (
        <div className="mt-10 text-center">
          <p className="text-purple-700 font-bold text-xl mb-6">
            {project.submissions?.length || 0} rendu(s) reçu(s)
          </p>
          {project.submissions?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-inner border-2 border-purple-300">
              <h4 className="font-bold text-lg text-indigo-800 mb-4">Rendus des étudiants :</h4>
              {project.submissions.map((submission, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                  <span className="text-gray-700 font-medium">
                    {submission.customName}
                  </span>
                  <a 
                    href={`http://localhost:5000/${submission.file}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Télécharger
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL ÉTUDIANT POUR DÉPÔT */}
      <Modal
        isOpen={studentModal}
        onRequestClose={() => setStudentModal(false)}
        className="bg-white p-12 rounded-3xl shadow-3xl max-w-lg mx-auto outline-none"
        overlayClassName="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      >
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center text-indigo-800">Déposer mon rendu</h2>
          <input
            type="text"
            placeholder="Ex: TP1 - Votre Nom.pdf"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full px-6 py-5 border-2 border-gray-300 rounded-xl text-lg focus:border-indigo-600 outline-none"
          />
          <input
            type="file"
            accept=".pdf,.docx,.zip,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-lg"
          />
          <div className="flex gap-6">
            <button
              onClick={submitStudentFile}
              className="flex-1 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xl rounded-xl shadow-xl hover:shadow-2xl"
            >
              {hasSubmitted ? 'Mettre à jour' : 'Déposer'}
            </button>
            <button
              onClick={() => setStudentModal(false)}
              className="flex-1 py-5 bg-gray-600 text-white font-bold text-xl rounded-xl hover:bg-gray-700"
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectCard;
// src/components/ProjectCard.js → CARTE PROJET + TÂCHES AFFICHÉES
import { useState } from 'react';
import TaskList from './TaskList';

const ProjectCard = ({ project, user, refreshProjects }) => {
  const isProf = user?.role === 'admin';
  const hasSubmitted = () => {
    if (!project.submissions) return false;
    return project.submissions.some(sub => {
      const studentId = sub.student._id || sub.student;
      return studentId?.toString() === user?._id;
    });
  };

  const getMySubmission = () => {
    if (!project.submissions) return null;
    return project.submissions.find(sub => {
      const studentId = sub.student._id || sub.student;
      return studentId?.toString() === user?._id;
    });
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

      {/* ÉTUDIANT : rendu + tâches */}
      {!isProf && (
        <>
          {/* Section rendu */}
          <div className="mt-8 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl border-2 border-indigo-300">
            {hasSubmitted() ? (
              <div className="text-center space-y-6">
                <p className="text-green-700 font-bold text-2xl">Rendu déposé !</p>
                <div className="bg-white p-6 rounded-2xl shadow-inner border-2 border-green-300">
                  <p className="text-lg font-bold text-indigo-800">
                    {getMySubmission()?.customName || 'Mon compte-rendu'}
                  </p>
                  <a href={`http://localhost:5000/${getMySubmission()?.file}`} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-4 px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-full shadow-xl hover:shadow-green-400 transition">
                    Voir mon compte-rendu
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <button className="inline-block px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold text-l rounded-full shadow-2xl hover:shadow-purple-600 transition transform hover:scale-110">
                  Déposer mon travail
                </button>
              </div>
            )}
          </div>

          {/* TÂCHES ASSIGNÉES À L'ÉTUDIANT */}
          <div className="mt-10">
            <h4 className="text-2xl font-bold text-indigo-800 mb-6">Mes tâches assignées</h4>
            <TaskList projectId={project._id} user={user} />
          </div>
        </>
      )}

      {/* PROF : boutons + compteur */}
      {isProf && (
        <div className="mt-10 text-center">
          <p className="text-purple-700 font-bold text-xl mb-6">
            {project.submissions?.length || 0} rendu(s) reçu(s)
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
// src/components/Dashboard.js → VERSION CORRIGÉE
import { useState, useEffect } from 'react';
import ProjectList from './ProjectList';
import API from '../services/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // Récupérer les données utilisateur complètes depuis l'API
      const userRes = await API.get('/users/me');
      const projectsRes = await API.get('/projects');

      setUser(userRes.data);
      setProjects(projectsRes.data || []);
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
        <div className="text-white text-4xl font-bold animate-pulse">Chargement...</div>
      </div>
    );
  }

  const isProf = user?.role === 'admin';
  const userName = user?.name || 'Étudiant';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      {/* HERO SECTION */}
      <div className="pt-32 pb-20 text-center text-white px-6">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl">
          {isProf ? 'Espace Professeur' : `Bonjour, ${userName}`}
        </h1>
        <p className="text-2xl md:text-3xl opacity-95 max-w-4xl mx-auto">
          {isProf
            ? 'Gérez vos projets et suivez les rendus en temps réel'
            : 'Déposez vos comptes-rendus avant la date limite'}
        </p>
      </div>

      {/* CARTES PROJETS */}
      <div className="max-w-7xl mx-auto px-6 pb-32 -mt-16">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/30">
          <ProjectList 
            projects={projects} 
            user={user} 
            refreshProjects={fetchData} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
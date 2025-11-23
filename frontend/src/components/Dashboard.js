// src/components/Dashboard.js
import { useState, useEffect } from 'react';
import ProjectList from './ProjectList';
import API from '../services/api';

const Dashboard = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const isProf = user?.role === 'admin';
  const userName = user?.name || user?.username || 'Étudiant';

  if (loading) return <div className="text-center p-20 text-2xl">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-indigo-800 mb-4">
          {isProf ? 'Espace Professeur' : `Bienvenue, ${userName}`}
        </h1>
        <p className="text-center text-xl text-gray-700 mb-12">
          {isProf 
            ? 'Gérez vos projets et suivez les rendus de vos étudiants' 
            : 'Consultez les projets et déposez vos comptes-rendus'}
        </p>

        <ProjectList 
          projects={projects} 
          user={user} 
          refreshProjects={fetchProjects} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
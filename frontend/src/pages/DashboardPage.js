// src/pages/DashboardPage.js
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../services/api';
import Dashboard from '../components/Dashboard';

const DashboardPage = () => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour charger les projets (on l'appelle au départ + après chaque sauvegarde)
  const loadProjects = async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data || []);
    } catch (err) {
      console.error('Erreur chargement projets', err);
      setProjects([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    } catch (err) {
      localStorage.removeItem('token');
      history.push('/login');
      return;
    }

    loadProjects().finally(() => setLoading(false));
  }, [history]);

  // ← NOUVEAU : recharge les projets quand on reçoit un événement Socket.io
  useEffect(() => {
    const socket = (window.socket || require('../socket').default);
    socket.on('projectUpdated', () => {
      loadProjects();
    });

    return () => socket.off('projectUpdated');
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-2xl">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard 
        user={user} 
        projects={projects} 
        setProjects={setProjects}   // ← on passe setProjects pour le formulaire
        refreshProjects={loadProjects}  // ← on passe la fonction de refresh
      />
    </div>
  );
};

export default DashboardPage;
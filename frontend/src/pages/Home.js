import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';   // ← v5
import Dashboard from '../components/Dashboard';

const Home = () => {
  const history = useHistory();                     // ← v5
  const token = localStorage.getItem('token');

  // Décodage simple du payload JWT pour récupérer les infos user
  const user = token
    ? JSON.parse(atob(token.split('.')[1]))
    : null;

  useEffect(() => {
    if (!token) {
      history.push('/login');                     // ← v5
    }
  }, [token, history]);

  // Si pas connecté → petit message + redirection automatique
  if (!token || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl text-gray-700">
          Redirection vers la page de connexion...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Bienvenue, {user.name || user.email}{' '}
          <span className="text-lg font-normal text-gray-500">
            ({user.role === 'admin' ? 'Professeur' : 'Étudiant'})
          </span>
        </h1>
        <Dashboard user={user} />
      </div>
    </div>
  );
};

export default Home;
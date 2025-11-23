// src/components/Navbar.js
import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const history = useHistory();

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);  // ← Mise à jour immédiate de l'état
    history.push('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">ProjetTracker</Link>
        <div className="space-x-6">
          <Link to="/" className="hover:text-gray-200">Accueil</Link>
          {!token ? (
            <>
              <Link to="/login" className="hover:text-gray-200">Connexion</Link>
              <Link to="/register" className="bg-white text-blue-600 px-5 py-2 rounded-lg hover:bg-gray-100">Inscription</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:text-gray-200">Tableau de bord</Link>
              <button onClick={handleLogout} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 px-5 py-2 rounded-lg">
                Déconnexion
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
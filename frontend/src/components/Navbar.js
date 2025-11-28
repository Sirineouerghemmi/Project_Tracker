// src/components/Navbar.js → STYLE DASHBOARD (BLANC + GRADIENT + BOUTON MAGNIFIQUE)
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
    setToken(null);
    history.push('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        {/* Logo avec gradient comme dans le Dashboard */}
        <Link to="/" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          ProjetTracker
        </Link>

        <div className="flex items-center gap-8">
          <Link to="/" className="text-gray-700 font-medium hover:text-indigo-600 transition">
            Accueil
          </Link>

          {!token ? (
            <>
              <Link to="/login" className="text-gray-700 font-medium hover:text-indigo-600 transition">
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105"
              >
                Inscription
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-gray-700 font-medium hover:text-indigo-600 transition">
                Tableau de bord
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-7 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105"
              >
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
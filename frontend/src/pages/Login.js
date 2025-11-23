// src/pages/Login.js
import { useState } from 'react';
import API from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Tentative de connexion...');
      const response = await API.post('/users/login', { email, password });
      console.log('Connexion réussie !', response.data);

      localStorage.setItem('token', response.data.token);
      alert('Connexion réussie !');

      // Redirection forcée (marche à tous les coups)
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Erreur login :', err.response?.data || err.message);
      alert('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-96">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Connexion</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg text-lg transition duration-200"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Pas de compte ?{' '}
          <a href="/register" className="text-blue-600 hover:underline font-semibold">
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
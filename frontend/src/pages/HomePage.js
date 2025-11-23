const HomePage = () => {
  return (
    <div className="container mx-auto px-6 py-16 text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-8">
        Bienvenue sur <span className="text-indigo-600">ProjetTracker</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
        La plateforme idéale pour suivre vos projets universitaires en temps réel. 
        Créez, assignez, suivez l’avancement et exportez vos rapports en un clic.
      </p>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-12">
        Professeurs : créez les projets officiels et suivez chaque groupe.<br />
        Étudiants : rendez vos livrables, marquez vos tâches et collaborez facilement.
      </p>
      <div className="space-x-6">
        <a href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 shadow-lg">
          Commencer gratuitement
        </a>
        <a href="/login" className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-50">
          J’ai déjà un compte
        </a>
      </div>
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow">
          <h3 className="text-2xl font-bold text-indigo-600 mb-3">Suivi en temps réel</h3>
          <p>Notifications instantanées avec Socket.io</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow">
          <h3 className="text-2xl font-bold text-indigo-600 mb-3">Export PDF & CSV</h3>
          <p>Rapports prêts pour la soutenance</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow">
          <h3 className="text-2xl font-bold text-indigo-600 mb-3">Rôles sécurisés</h3>
          <p>Professeur vs Étudiant – tout est contrôlé</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
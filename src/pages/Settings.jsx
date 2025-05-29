import React, { useState } from 'react';
import { FiUser, FiBell, FiLock, FiGlobe, FiMoon, FiSun } from 'react-icons/fi';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('fr');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Paramètres</h1>
      
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {/* Section Compte */}
        <div className="px-6 py-5">
          <div className="flex items-center">
            <FiUser className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-lg font-medium text-gray-900">Compte</h2>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Adresse email</h3>
                <p className="text-sm text-gray-500">user@example.com</p>
              </div>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Modifier
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Mot de passe</h3>
                <p className="text-sm text-gray-500">••••••••</p>
              </div>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Modifier
              </button>
            </div>
          </div>
        </div>

        {/* Section Notifications */}
        <div className="px-6 py-5">
          <div className="flex items-center">
            <FiBell className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Notifications par email</h3>
                <p className="text-sm text-gray-500">Recevoir des alertes et rapports</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${notifications ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Section Apparence */}
        <div className="px-6 py-5">
          <div className="flex items-center">
            <div className="flex items-center">
              {darkMode ? (
                <FiMoon className="h-6 w-6 text-blue-500 mr-3" />
              ) : (
                <FiSun className="h-6 w-6 text-blue-500 mr-3" />
              )}
              <h2 className="text-lg font-medium text-gray-900">Apparence</h2>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Mode sombre</h3>
                <p className="text-sm text-gray-500">Réduit la fatigue oculaire en conditions de faible luminosité</p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Section Langue */}
        <div className="px-6 py-5">
          <div className="flex items-center">
            <FiGlobe className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-lg font-medium text-gray-900">Langue</h2>
          </div>
          <div className="mt-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>

        {/* Section Confidentialité */}
        <div className="px-6 py-5">
          <div className="flex items-center">
            <FiLock className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-lg font-medium text-gray-900">Confidentialité</h2>
          </div>
          <div className="mt-4 space-y-3">
            <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Politique de confidentialité
            </button>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-500 block">
              Exporter mes données
            </button>
            <button className="text-sm font-medium text-red-600 hover:text-red-500 block">
              Supprimer mon compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
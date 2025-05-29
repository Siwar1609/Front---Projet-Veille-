import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiClock, FiSettings, FiInfo } from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: <FiHome className="mr-3" />, name: "Nouvelle conversation", path: "/new-chat" },
    { icon: <FiClock className="mr-3" />, name: "Historique", path: "/history" },
    { icon: <FiSettings className="mr-3" />, name: "Pramétres", path: "/settings" },
    { icon: <FiInfo className="mr-3" />, name: "A propos", path: "/about" },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-350 text-white p-4 hidden md:block fixed h-full border-r border-blue-250 shadow-xl">
      <div className="flex items-center mb-8 mt-4 px-2">
        <div className="bg-white/20 p-2 rounded-lg mr-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold">Your Bias Analyzer</h2>
      </div>
      
      <nav>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center w-full p-3 rounded-lg transition-all ${
                  location.pathname === item.path
                    ? 'bg-white/10 backdrop-blur-sm shadow-md border border-white/20'
                    : 'hover:bg-white/5 hover:border-white/10 hover:border'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <div className="text-sm text-white/70">Version 1.0.0</div>
      </div>
    </div>
  );
};

export default Sidebar;
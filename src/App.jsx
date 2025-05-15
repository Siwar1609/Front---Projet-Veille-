import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import NewChat from './pages/NewChat';
import History from './pages/History';
import Settings from './pages/Settings';
import About from './pages/About';

// Création d'un contexte pour partager l'état
export const AppContext = React.createContext();

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Charger l'historique au démarrage
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      setConversations(JSON.parse(savedHistory));
    }
  }, []);

  // Sauvegarder l'historique quand il change
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(conversations));
  }, [conversations]);

  const saveConversation = (messages) => {
    if (messages.length === 0) return;

    const newConversation = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      messages: [...messages],
      title: messages[0]?.text?.slice(0, 30) || 'Nouvelle conversation'
    };

    setConversations(prev => [newConversation, ...prev]);
    return newConversation;
  };

  const deleteConversation = (id) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
    }
  };

  const value = {
    conversations,
    currentConversation,
    saveConversation,
    deleteConversation,
    setCurrentConversation,
    sidebarOpen,
    setSidebarOpen
  };

  return (
    <AppContext.Provider value={value}>
      <Router>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
            <div className="h-full overflow-y-auto">
              <Routes>
                <Route path="/" element={<NewChat />} />
                <Route path="/new-chat" element={<NewChat />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import NewChat from './pages/NewChat';
import History from './pages/History';
import Settings from './pages/Settings';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 md:ml-64"> {/* Margin pour compenser la sidebar fixe */}
          <Routes>
            <Route path="/" element={<NewChat />} />
            <Route path="/new-chat" element={<NewChat />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
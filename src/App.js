import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FilePage from './pages/FilePage';

function App() {
  const [encryptionKey, setEncryptionKey] = useState(null);

  // Save key to localStorage and retrieve on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('encryptionKey');
    if (savedKey) {
      setEncryptionKey(savedKey);
    }
  }, []);

  const handleSetEncryptionKey = (key) => {
    setEncryptionKey(key);
    localStorage.setItem('encryptionKey', key); // Persist key to localStorage
  };

  const handleLogout = () => {
    setEncryptionKey(null);
    localStorage.removeItem('encryptionKey'); // Remove key from localStorage
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* HomePage: User can create a new encryption key or use an existing one */}
          <Route 
            path="/" 
            element={<HomePage setEncryptionKey={handleSetEncryptionKey} />} 
          />

          {/* FilePage: User can upload/view files if encryption key is provided */}
          <Route 
            path="/files" 
            element={encryptionKey ? (
              <FilePage encryptionKey={encryptionKey} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />  // Redirect to HomePage if no key
            )} 
          />
          
          {/* Fallback for non-existing routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

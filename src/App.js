import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import SessionList from './components/Session/SessionList';
import WaitingRoom from './components/Session/WaitingRoom';
import GameSession from './components/Session/GameSession';

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Exemple d'initialisation ou redirection automatique selon l'état utilisateur
    if (!user) {
      localStorage.setItem('user', JSON.stringify(null));
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={user ? <SessionList /> : <Navigate to="/login" />}
        />
        <Route
          path="/:sessionId/waitingroom"
          element={user ? <WaitingRoom /> : <Navigate to="/login" />}
        />
        <Route
          path="/:sessionId/game"
          element={user ? <GameSession /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

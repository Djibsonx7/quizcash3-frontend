import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSessions, createSession, joinSession } from '../../services/sessionService';

const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllSessions();
      setSessions(data.data || []);
    } catch (err) {
      setError(`Erreur lors du chargement des sessions : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    setLoading(true);
    setError('');
    try {
      await createSession({ userId: user.id });
      fetchSessions();
    } catch (err) {
      setError(`Erreur lors de la création de la session : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async (sessionId) => {
    setLoading(true);
    setError('');
    try {
      await joinSession(sessionId, { userId: user.id, username: user.username });
      navigate(`/${sessionId}/waitingroom`);
    } catch (err) {
      setError(`Erreur lors de la connexion à la session : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Liste des sessions</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleCreateSession} disabled={loading}>
        {loading ? 'Création...' : 'Créer une session'}
      </button>
      <ul>
        {sessions.map((session) => (
          <li key={session._id}>
            {session.name} - {session.players.length}/2 joueurs
            {session.players.length < 2 && (
              <button
                onClick={() => handleJoinSession(session._id)}
                disabled={loading}
              >
                Rejoindre
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionList;

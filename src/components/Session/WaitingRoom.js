import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../../utils/socket';

const WaitingRoom = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [statusMessage, setStatusMessage] = useState('En attente de joueurs...');

  useEffect(() => {
    // Rejoindre la salle
    socket.emit('joinRoom', { sessionId });

    // Mettre à jour les joueurs en temps réel
    socket.on('updatePlayers', (updatedPlayers) => {
      setPlayers(updatedPlayers);
      setStatusMessage(updatedPlayers.length < 2 ? 'En attente d’un joueur...' : 'Session prête à démarrer !');
    });

    // Démarrage de la session
    socket.on('session_started', () => {
      navigate(`/${sessionId}/game`); // Redirige vers la page du jeu
    });

    // Nettoyage des écouteurs
    return () => {
      socket.off('updatePlayers');
      socket.off('session_started');
    };
  }, [sessionId, navigate]);

  return (
    <div>
      <h2>Salle d'attente</h2>
      <p>{statusMessage}</p>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player.username || `Joueur ${index + 1}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default WaitingRoom;

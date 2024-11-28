import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../../utils/socket';

const WaitingRoom = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]); // Liste des joueurs connectés
  const [statusMessage, setStatusMessage] = useState('En attente de joueurs...');
  const [timer, setTimer] = useState(null); // État pour gérer le compte à rebours

  useEffect(() => {
    // Récupérer les informations de l'utilisateur actuel
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    // Rejoindre la salle avec les informations de l'utilisateur actuel
    socket.emit('joinRoom', { sessionId, userId: user.id, username: user.username });

    // Écouter les mises à jour des joueurs
    socket.on('updatePlayers', (updatedPlayers) => {
      console.log('Mise à jour des joueurs :', updatedPlayers);
      setPlayers(updatedPlayers);

      if (updatedPlayers.length === 2) {
        setStatusMessage('Session prête à démarrer !');
        startCountdown();
      } else {
        setStatusMessage('En attente d’un joueur...');
        setTimer(null); // Réinitialise le compte à rebours
      }
    });

    // Redirection vers le jeu une fois la session démarrée
    socket.on('session_started', () => {
      navigate(`/${sessionId}/game`);
    });

    // Nettoyage des écouteurs
    return () => {
      socket.off('updatePlayers');
      socket.off('session_started');
    };
  }, [sessionId, navigate]);

  const startCountdown = () => {
    if (timer !== null) return; // Empêche le démarrage multiple du compte à rebours

    let countdown = 5;
    setTimer(countdown);

    const interval = setInterval(() => {
      countdown -= 1;
      setTimer(countdown);

      if (countdown === 0) {
        clearInterval(interval); // Stoppe le compte à rebours
        socket.emit('startSession', { sessionId }); // Informe le backend de démarrer la session
      }
    }, 1000);
  };

  return (
    <div>
      <h2>Salle d'attente</h2>
      <p>{statusMessage}</p>
      {timer !== null && <p>Démarrage dans {timer} secondes...</p>}
      <ul>
        {players.map((player) => (
          <li key={player.userId}>{player.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default WaitingRoom;

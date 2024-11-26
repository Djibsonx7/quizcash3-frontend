import React, { useEffect, useState } from 'react';
import socket from '../../utils/socket';

const SessionLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    socket.on('updateLeaderboard', (updatedLeaderboard) => {
      setLeaderboard(updatedLeaderboard);
    });

    return () => {
      socket.off('updateLeaderboard');
    };
  }, []);

  return (
    <div>
      <h2>Classement des joueurs</h2>
      <ol>
        {leaderboard.map((player, index) => (
          <li key={index}>
            {player.name}: {player.score} points
          </li>
        ))}
      </ol>
    </div>
  );
};

export default SessionLeaderboard;

import React, { useEffect, useState } from 'react';
import Question from '../Question';
import socket from '../../utils/socket';

const GameSession = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Ajout d'un état de chargement

  useEffect(() => {
    // Écouter les questions envoyées par le backend
    socket.on('receiveQuestions', (receivedQuestions) => {
      if (Array.isArray(receivedQuestions) && receivedQuestions.length > 0) {
        setQuestions(receivedQuestions);
        setLoading(false); // Désactiver le chargement lorsque les questions sont reçues
      } else {
        console.error('Aucune question reçue ou format incorrect.');
        setLoading(false);
      }
    });

    // Émettre l'événement de démarrage du jeu
    socket.emit('startGame');

    return () => {
      socket.off('receiveQuestions');
    };
  }, []);

  const handleAnswer = (answer) => {
    socket.emit('answerQuestion', { answer });
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  if (loading) return <p>Chargement des questions...</p>; // Afficher un message pendant le chargement
  if (questions.length === 0) return <p>Aucune question disponible.</p>; // Message si aucune question n'est reçue

  return (
    <div>
      <h2>Session en cours</h2>
      {currentQuestionIndex < questions.length ? (
        <Question
          question={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
        />
      ) : (
        <p>Session terminée !</p>
      )}
    </div>
  );
};

export default GameSession;

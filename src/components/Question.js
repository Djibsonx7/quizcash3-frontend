import React, { useState } from 'react';

const Question = ({ question, onAnswer }) => {
  const [selectedChoice, setSelectedChoice] = useState(null);

  const handleChoice = (choice) => {
    setSelectedChoice(choice);
    onAnswer(choice);
  };

  return (
    <div>
      <h3>{question.text}</h3>
      <ul>
        {question.choices.map((choice, index) => (
          <li
            key={index}
            style={{
              cursor: 'pointer',
              backgroundColor: selectedChoice === choice ? 'lightblue' : 'transparent',
            }}
            onClick={() => handleChoice(choice)}
          >
            {choice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;

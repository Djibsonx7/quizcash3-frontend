import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ObjectId from 'bson-objectid'; // Importer pour générer un ObjectId valide

const Login = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username.trim()) {
      const user = { id: ObjectId().toHexString(), username }; // Génère un ObjectId valide
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/'); // Redirige vers la liste des sessions
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <input
        type="text"
        placeholder="Entrez votre nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleLogin}>Se connecter</button>
    </div>
  );
};

export default Login;

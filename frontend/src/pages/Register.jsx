import React, { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import '../components/common/InputButton.css';


const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(formData);
      navigate('/'); // Redirection vers l'accueil après inscription réussie
    } catch (err) {
      setError("Erreur lors de l'inscription. Vérifiez vos données.");
    }
  };

  return (
    <div className="auth-form">
      <h2>Inscription</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="nom"
          placeholder="Votre Nom" 
          value={formData.nom} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="email" 
          name="email"
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password"
          placeholder="Mot de passe" 
          value={formData.password} 
          onChange={handleChange} 
          required 
        />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
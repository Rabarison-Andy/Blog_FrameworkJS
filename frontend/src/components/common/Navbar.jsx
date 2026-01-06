import React, { useState, useEffect, useContext, createContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import '../common/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">AnimaBlog</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Accueil</Link>
        
        {user ? (
          <>
            <Link to="/write">Écrire un article</Link>
            <Link to="/profile">Bonjour, {user.nom}</Link>
            <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
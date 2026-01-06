import React from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import '../components/common/InputButton.css';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) return <p>Vous devez être connecté.</p>;

  return (
    <div className="profile-page">
      <h1>Mon Profil</h1>
      <div className="profile-card">
        <p><strong>Nom :</strong> {user.nom}</p>
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>ID :</strong> {user._id}</p>
        
        <button onClick={logout} className="btn-logout">
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default Profile;
import React, { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleService } from '../services/articleService';
import '../components/common/InputButton.css';


const CreateArticle = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categorie, setCategorie] = useState('3D');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // On doit utiliser FormData car on envoie un fichier
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('categorie', categorie);
    if (image) formData.append('image', image);

    try {
      const res = await articleService.create(formData);
      // Après création, on publie direct (optionnel) ou on redirige
      // Note: L'article est créé en "Brouillon" par défaut
      await articleService.publish(res.data._id); 
      navigate('/');
    } catch (error) {
      alert("Erreur lors de la création");
    }
  };

  return (
    <div className="create-page">
      <h2>Écrire un nouvel article</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Titre" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
        />
        
        <select value={categorie} onChange={e => setCategorie(e.target.value)}>
          <option value="3D">3D</option>
          <option value="2D">2D</option>
          <option value="Stop Motion">Stop Motion</option>
        </select>

        <textarea 
          placeholder="Contenu de votre article..." 
          value={content} 
          onChange={e => setContent(e.target.value)}
          rows="10"
          required 
        />

        <input 
          type="file" 
          onChange={e => setImage(e.target.files[0])} 
          accept="image/*"
        />

        <button type="submit">Publier l'article</button>
      </form>
    </div>
  );
};

export default CreateArticle;
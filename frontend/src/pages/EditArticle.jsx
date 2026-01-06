import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { articleService } from '../services/articleService';
import '../components/common/InputButton.css';


const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categorie: ''
  });

  useEffect(() => {
    // 1. On charge les données actuelles de l'article
    const fetchArticle = async () => {
      try {
        const res = await articleService.getById(id);
        setFormData({
            title: res.data.title,
            content: res.data.content,
            categorie: res.data.categorie
        });
      } catch (error) {
        console.error("Erreur chargement", error);
      }
    };
    fetchArticle();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 2. On envoie les modifications (PUT)
      await articleService.update(id, formData);
      navigate(`/article/${id}`); // Retour au détail
    } catch (error) {
      alert("Erreur lors de la modification");
    }
  };

  return (
    <div className="create-page">
      <h2>Modifier l'article</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={formData.title} 
          onChange={e => setFormData({...formData, title: e.target.value})} 
          required 
        />
        
        <select 
            value={formData.categorie} 
            onChange={e => setFormData({...formData, categorie: e.target.value})}
        >
          <option value="3D">3D</option>
          <option value="2D">2D</option>
          <option value="Stop Motion">Stop Motion</option>
        </select>

        <textarea 
          value={formData.content} 
          onChange={e => setFormData({...formData, content: e.target.value})}
          rows="10"
          required 
        />

        <button type="submit">Sauvegarder les modifications</button>
      </form>
    </div>
  );
};

export default EditArticle;
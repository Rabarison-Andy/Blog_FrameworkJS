import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { articleService } from '../services/articleService';
import { commentService } from '../services/commentService';
import { useAuth } from '../hooks/useAuth.jsx';
import '../components/common/InputButton.css';
import '../components/articles/ArticleDetail.css';

const ArticleDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const art = await articleService.getById(id);
        setArticle(art.data);
        const coms = await commentService.getByArticle(id);
        setComments(coms.data);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();
  }, [id]);


  // 1. Publier l'article
  const handlePublish = async () => {
    try {
      await articleService.publish(id);
      setArticle({ ...article, isPublished: true });
      alert("Article publié avec succès !");
    } catch (error) {
      alert("Erreur lors de la publication");
    }
  };

  // 2. Supprimer l'article
  const handleDeleteArticle = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;
    try {
      await articleService.delete(id);
      navigate('/');
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };


  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await commentService.create(id, newComment);
      setNewComment('');
      const coms = await commentService.getByArticle(id);
      setComments(coms.data);
    } catch (error) {
      alert("Erreur commentaire (Article non publié ?)");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if(!window.confirm("Supprimer ce commentaire ?")) return;
    try {
      await commentService.delete(commentId);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      alert("Impossible de supprimer");
    }
  };

  // 3. Approuver un commentaire
  const handleApproveComment = async (commentId) => {
    try {
      await commentService.approve(commentId);
      setComments(comments.map(c => 
        c._id === commentId ? { ...c, approuve: true } : c
      ));
    } catch (error) {
      alert("Erreur approbation");
    }
  };

  if (loading) return <div style={{padding:'50px', textAlign:'center'}}>Chargement...</div>;
  if (!article) return <div style={{padding:'50px', textAlign:'center'}}>Article introuvable</div>;

  // Vérifier si je suis l'auteur de l'article
  const isAuthor = user && (article.author._id === user._id || article.author === user._id);

  return (
    <div className="article-page-layout">
      
      {/* --- COLONNE 1 : INFOS (GAUCHE) --- */}
      <aside className="left-sidebar">
        <div className="meta-block">
            <span className="meta-label">Auteur</span>
            <span className="meta-value">{article.author?.nom || 'Inconnu'}</span>
        </div>
        <div className="meta-block">
            <span className="meta-label">Catégorie</span>
            <span className="meta-value" style={{color: 'var(--c-violet)'}}>{article.categorie}</span>
        </div>
        <div className="meta-block">
            <span className="meta-label">Vues</span>
            <span className="meta-value">{article.views} lectures</span>
        </div>
        <div className="meta-block">
            <span className="meta-label">Date</span>
            <span className="meta-value">
                {new Date(article.createdAt).toLocaleDateString()}
            </span>
        </div>
        {/* Tu peux ajouter des boutons d'action ici (Edit/Delete) si c'est l'auteur */}
      </aside>


      {/* --- COLONNE 2 : CONTENU (CENTRE) --- */}
      <main className="main-content">
        <header className="article-header">
            <h1>{article.title}</h1>
        </header>

        {article.image && (
            <img 
                src={`http://localhost:3000/${article.image}`} 
                alt={article.title} 
                className="article-cover"
            />
        )}

        <div className="article-body">
            {/* Affichage avec sauts de ligne */}
            {article.content.split('\n').map((p, i) => (
                <p key={i} style={{marginBottom: '1em'}}>{p}</p>
            ))}
        </div>
      </main>


      {/* --- COLONNE 3 : COMMENTAIRES (DROITE) --- */}
      <aside className="right-sidebar">
        <h3>Discussion ({comments.length})</h3>
        
        {/* Formulaire */}
        {user ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea 
                    placeholder="Votre avis sur l'animation..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                />
                <button type="submit" className="btn-action">Envoyer</button>
            </form>
        ) : (
            <p style={{fontStyle:'italic', marginBottom:'20px'}}>
                <a href="/login" style={{textDecoration:'underline'}}>Connectez-vous</a> pour participer.
            </p>
        )}

        {/* Liste */}
        <div className="comments-list">
            {comments.map(c => (
                <div key={c._id} className="comment-bubble">
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                        <span className="comment-author">{c.author?.nom}</span>
                        <span className="comment-date">
                            {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="comment-text">{c.content}</p>
                </div>
            ))}
            {comments.length === 0 && <p>Soyez le premier à commenter !</p>}
        </div>
      </aside>

    </div>
  );
};

export default ArticleDetail;
import React, { useState, useEffect, useContext, createContext } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../services/articleService';
import '../components/common/Home.css';
import '../components/common/InputButton.css';
import '../components/articles/ArticleCard.css';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');
  const limit = 5;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await articleService.getAll({ page, limit, search });
        setArticles(data.data || []);
      } catch (error) {
        console.error("Erreur chargement articles", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [page, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Retour à la page 1 quand on cherche
    setSearch(inputValue);
  };

  const handleNext = () => {
    if (articles.length === limit) {
      setPage(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

    return (
    <div className="home-page">
      <h1>Derniers Articles</h1>

      <div className="search-container">
    <input 
      type="text" 
      className="search-input"
      placeholder="Rechercher un article..." 
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
    <button type="button" onClick={handleSearch} className="search-btn">
      GO !
    </button>
</div>

      {loading ? <p>Chargement...</p> : (
        <>
            <div className="articles-grid">
                {articles.length > 0 ? (
                    articles.map((article) => (
                    <div key={article._id} className="article-card">
                        {article.image && (
                        <img 
                            src={`http://localhost:3000/${article.image}`} 
                            alt={article.title} 
                            className="article-thumb"
                        />
                        )}
                        <h3>{article.title}</h3>
                        <p>{article.resume}</p>
                        <div className="card-footer">
                        <span className="cat-tag">{article.categorie}</span>
                        <Link to={`/article/${article._id}`} className="read-more">Lire la suite</Link>
                        </div>
                    </div>
                    ))
                ) : (
                    <p>Aucun article trouvé.</p>
                )}
            </div>

            <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
                <button 
                    onClick={handlePrev} 
                    disabled={page === 1}
                    style={{ opacity: page === 1 ? 0.5 : 1 }}
                >
                    &laquo; Précédent
                </button>
                <span>Page {page}</span>
                <button 
                    onClick={handleNext} 
                    disabled={articles.length < limit}
                    style={{ opacity: articles.length < limit ? 0.5 : 1 }}
                >
                    Suivant &raquo;
                </button>
            </div>
        </>
      )}
    </div>
  );
};

export default Home;
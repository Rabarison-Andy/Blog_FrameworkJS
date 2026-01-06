import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/common/Navbar.jsx';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateArticle from './pages/CreateArticle';
import EditArticle from './pages/EditArticle';
import ArticleDetail from './pages/ArticleDetail';
import Profile from './pages/Profile';
import { useAuth } from './hooks/useAuth.jsx';

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          
          {/* Routes Protégées */}
          {user && (
            <>
              <Route path="/write" element={<CreateArticle />} />
              <Route path="/edit/:id" element={<EditArticle />} />
              <Route path="/profile" element={<Profile />} />
            </>
          )}

          <Route path="*" element={<div style={{textAlign:'center', marginTop:'50px'}}><h2>404 - Page non trouvée</h2><p>Retournez à l'accueil</p></div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
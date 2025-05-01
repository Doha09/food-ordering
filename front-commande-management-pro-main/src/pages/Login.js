import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifiant: '',
    motDePasse: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', formData);
      const user = await auth.login(formData);
      console.log('Login successful, user:', user);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect based on user role
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/restaurants');
      }
    } catch (err) {
      console.error('Login error details:', err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.status === 401) {
          setError('Identifiant ou mot de passe incorrect');
        } else if (err.response.status === 404) {
          setError('Service d\'authentification non disponible');
        } else {
          setError('Une erreur est survenue lors de la connexion');
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError('Impossible de se connecter au serveur');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Une erreur est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Bienvenue</h1>
          <p>Veuillez vous connecter à votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="identifiant">Identifiant</label>
            <input
              type="text"
              id="identifiant"
              name="identifiant"
              value={formData.identifiant}
              onChange={handleChange}
              required
              placeholder="Entrez votre identifiant"
              autoComplete="username"
            />
          {/* </div> */}

          {/* <div className="form-group"> */}
            <label htmlFor="motDePasse">Mot de passe</label>
            <input
              type="password"
              id="motDePasse"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleChange}
              required
              placeholder="Entrez votre mot de passe"
              autoComplete="current-password"
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Se souvenir de moi</label>
            </div>
            <a href="/forgot-password" className="forgot-password">
              Mot de passe oublié?
            </a>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
              </span>
            ) : (
              'Se connecter'
            )}
          </button>

          <div className="register-link">
            Vous n'avez pas de compte? <a href="/register">S'inscrire</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 
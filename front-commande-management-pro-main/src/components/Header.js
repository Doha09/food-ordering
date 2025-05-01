import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  if (!user) {
    return (
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo">
            <i className="fas fa-utensils"></i>
            <span>Food Delivery</span>
          </Link>
          
          <nav className="main-nav">
            <Link 
              to="/restaurants" 
              className={`nav-item ${isActive('/restaurants') ? 'active' : ''}`}
              data-title="Restaurants"
            >
              <i className="fas fa-utensils"></i>
              <span>Restaurants</span>
            </Link>
          </nav>

          <div className="auth-buttons">
            <Link to="/login" className="login-button">Se connecter</Link>
            <Link to="/register" className="register-button">S'inscrire</Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <i className="fas fa-utensils"></i>
          <span>Food Delivery</span>
        </Link>

        <nav className="main-nav">
          {user.role === 'ADMIN' ? (
            <>
              <Link 
                to="/admin" 
                className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
                data-title="Dashboard"
              >
                <i className="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/admin/restaurants" 
                className={`nav-item ${isActive('/admin/restaurants') ? 'active' : ''}`}
                data-title="Restaurants"
              >
                <i className="fas fa-utensils"></i>
                <span>Restaurants</span>
              </Link>
              <Link 
                to="/admin/products" 
                className={`nav-item ${isActive('/admin/products') ? 'active' : ''}`}
                data-title="Products"
              >
                <i className="fas fa-hamburger"></i>
                <span>Products</span>
              </Link>
              <Link 
                to="/admin/orders" 
                className={`nav-item ${isActive('/admin/orders') ? 'active' : ''}`}
                data-title="Orders"
              >
                <i className="fas fa-shopping-cart"></i>
                <span>Orders</span>
              </Link>
              <Link 
                to="/admin/livreurs" 
                className={`nav-item ${isActive('/admin/livreurs') ? 'active' : ''}`}
                data-title="Delivery"
              >
                <i className="fas fa-motorcycle"></i>
                <span>Delivery</span>
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/restaurants" 
                className={`nav-item ${isActive('/restaurants') ? 'active' : ''}`}
                data-title="Restaurants"
              >
                <i className="fas fa-utensils"></i>
                <span>Restaurants</span>
              </Link>
              <Link 
                to="/commandes" 
                className={`nav-item ${isActive('/commandes') ? 'active' : ''}`}
                data-title="My Orders"
              >
                <i className="fas fa-shopping-cart"></i>
                <span>Mes Commandes</span>
              </Link>
            </>
          )}
        </nav>

        <div className="user-dropdown">
          <button 
            className="user-dropdown-toggle"
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
          >
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <span className="user-name">{user.fullName || user.identifiant}</span>
            <i className={`fas fa-chevron-${isUserDropdownOpen ? 'up' : 'down'}`}></i>
          </button>
          {isUserDropdownOpen && (
            <div className="user-dropdown-menu">
              <div className="user-info">
                <div className="user-avatar large">
                  <i className="fas fa-user"></i>
                </div>
                <div className="user-details">
                  <span className="user-name">{user.fullName || user.identifiant}</span>
                  <span className="user-role">{user.role}</span>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <Link to="/profile" className="dropdown-item">
                <i className="fas fa-user-cog"></i> Profile
              </Link>
              <Link to="/settings" className="dropdown-item">
                <i className="fas fa-cog"></i> Settings
              </Link>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 
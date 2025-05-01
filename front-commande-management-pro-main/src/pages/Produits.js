import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './Produits.css';

function Produits() {
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    API.get('/produits')
      .then(res => {
        setProduits(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x200?text=Produit';
  };

  return (
    <div className="produits-container">
      <h1 className="produits-title">Nos Produits</h1>
      <div className="produits-grid">
        {produits.map((produit, index) => (
          <div key={index} className="produit-card">
            <div className="produit-image">
              <img 
                src={produit.imageUrl || 'https://via.placeholder.com/300x200?text=Produit'} 
                alt={produit.nom}
                onError={handleImageError}
                loading="lazy"
              />
            </div>
            <div className="produit-info">
              <h2 className="produit-name">{produit.nom}</h2>
              <p className="produit-description">{produit.description}</p>
              <div className="produit-details">
                <span className="produit-price">{produit.prix} €</span>
                <span className="produit-category">
                  <i className="fas fa-tag"></i> {produit.categorie}
                </span>
              </div>
              <div className="produit-actions">
                <button className="add-to-cart-btn">
                  <i className="fas fa-cart-plus"></i> Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Produits; 
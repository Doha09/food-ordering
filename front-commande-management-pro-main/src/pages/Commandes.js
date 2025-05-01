import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './Commandes.css';

function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [activeTab, setActiveTab] = useState('current'); // 'current' or 'history'

  useEffect(() => {
    API.get('/commandes')
      .then(res => {
        setCommandes(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'en_attente': { text: 'En attente', class: 'status-pending' },
      'en_cours': { text: 'En cours', class: 'status-processing' },
      'terminee': { text: 'Terminée', class: 'status-completed' },
      'annulee': { text: 'Annulée', class: 'status-cancelled' }
    };

    const config = statusConfig[status] || { text: status, class: 'status-default' };
    return (
      <span className={`status-badge ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const filteredCommandes = commandes.filter(commande => 
    activeTab === 'current' 
      ? ['en_attente', 'en_cours'].includes(commande.statut)
      : ['terminee', 'annulee'].includes(commande.statut)
  );

  return (
    <div className="commandes-container">
      <h1 className="commandes-title">Mes Commandes</h1>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          <i className="fas fa-clock"></i> Commandes en cours
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <i className="fas fa-history"></i> Historique
        </button>
      </div>

      <div className="commandes-list">
        {filteredCommandes.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-clipboard-list"></i>
            <p>Aucune commande {activeTab === 'current' ? 'en cours' : 'dans l\'historique'}</p>
          </div>
        ) : (
          filteredCommandes.map((commande, index) => (
            <div key={index} className="commande-card">
              <div className="commande-header">
                <div className="commande-info">
                  <h3 className="commande-number">Commande #{commande.id}</h3>
                  <span className="commande-date">
                    <i className="fas fa-calendar-alt"></i> {formatDate(commande.date)}
                  </span>
                </div>
                {getStatusBadge(commande.statut)}
              </div>

              <div className="commande-restaurant">
                <i className="fas fa-utensils"></i>
                <span>{commande.restaurant}</span>
              </div>

              <div className="commande-items">
                {commande.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="commande-item">
                    <span className="item-quantity">{item.quantite}x</span>
                    <span className="item-name">{item.nom}</span>
                    <span className="item-price">{item.prix} €</span>
                  </div>
                ))}
              </div>

              <div className="commande-footer">
                <div className="commande-total">
                  <span>Total</span>
                  <span className="total-amount">{commande.total} €</span>
                </div>
                {commande.statut === 'en_attente' && (
                  <button className="cancel-btn">
                    <i className="fas fa-times"></i> Annuler
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Commandes; 
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './AdminLivreurs.css';

const AdminLivreurs = () => {
  const [livreurs, setLivreurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLivreur, setNewLivreur] = useState({
    fullName: '',
    email: '',
    phone: '',
    vehicleType: '',
    vehicleNumber: '',
    status: 'AVAILABLE'
  });

  useEffect(() => {
    fetchLivreurs();
  }, []);

  const fetchLivreurs = async () => {
    try {
      const response = await api.get('/livreurs');
      setLivreurs(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch delivery personnel');
      setLoading(false);
    }
  };

  const handleAddLivreur = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/livreurs', newLivreur);
      setLivreurs([...livreurs, response.data]);
      setShowAddModal(false);
      setNewLivreur({
        fullName: '',
        email: '',
        phone: '',
        vehicleType: '',
        vehicleNumber: '',
        status: 'AVAILABLE'
      });
    } catch (err) {
      setError('Failed to add delivery personnel');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/livreurs/${id}/status`, { status: newStatus });
      setLivreurs(livreurs.map(livreur => 
        livreur.id === id ? { ...livreur, status: newStatus } : livreur
      ));
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleDeleteLivreur = async (id) => {
    if (window.confirm('Are you sure you want to delete this delivery personnel?')) {
      try {
        await api.delete(`/livreurs/${id}`);
        setLivreurs(livreurs.filter(livreur => livreur.id !== id));
      } catch (err) {
        setError('Failed to delete delivery personnel');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return '#2ecc71';
      case 'BUSY':
        return '#e74c3c';
      case 'OFFLINE':
        return '#95a5a6';
      default:
        return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Available';
      case 'BUSY':
        return 'Busy';
      case 'OFFLINE':
        return 'Offline';
      default:
        return status;
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-livreurs">
      <div className="admin-header">
        <div className="header-content">
          <h1>Manage Delivery Personnel</h1>
          <p>Add, edit, and manage your delivery personnel</p>
        </div>
        <button 
          className="add-button"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus"></i> Add New Delivery Personnel
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon available">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <h3>Available</h3>
            <p>{livreurs.filter(l => l.status === 'AVAILABLE').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon busy">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-info">
            <h3>Busy</h3>
            <p>{livreurs.filter(l => l.status === 'BUSY').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon offline">
            <i className="fas fa-power-off"></i>
          </div>
          <div className="stat-info">
            <h3>Offline</h3>
            <p>{livreurs.filter(l => l.status === 'OFFLINE').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon total">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>Total</h3>
            <p>{livreurs.length}</p>
          </div>
        </div>
      </div>

      <div className="livreurs-grid">
        {livreurs.map(livreur => (
          <div key={livreur.id} className="livreur-card">
            <div className="livreur-header">
              <div className="livreur-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="livreur-status" style={{ backgroundColor: getStatusColor(livreur.disponible) }}>
                {getStatusText(livreur.disponible)}
              </div>
            </div>
            <div className="livreur-info">
              <h2>{livreur.nom} {livreur.prenom}</h2>
              <div className="info-group">
                <i className="fas fa-envelope"></i>
                <span>{livreur.email}</span>
              </div>
              <div className="info-group">
                <i className="fas fa-phone"></i>
                <span>{livreur.telephone}</span>
              </div>
              <div className="info-group">
                <i className="fas fa-motorcycle"></i>
                <span>{livreur.vehicleType}</span>
              </div>
              <div className="info-group">
                <i className="fas fa-hashtag"></i>
                <span>{livreur.vehicleNumber}</span>
              </div>
            </div>
            <div className="livreur-actions">
              <select
                value={livreur.status}
                onChange={(e) => handleStatusChange(livreur.id, e.target.value)}
                className="status-select"
                style={{ backgroundColor: getStatusColor(livreur.status) }}
              >
                <option value="AVAILABLE">Available</option>
                <option value="BUSY">Busy</option>
                <option value="OFFLINE">Offline</option>
              </select>
              <button 
                className="delete-button"
                onClick={() => handleDeleteLivreur(livreur.id)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Delivery Personnel</h2>
              <button 
                className="close-button"
                onClick={() => setShowAddModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleAddLivreur}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={newLivreur.fullName}
                  onChange={(e) => setNewLivreur({...newLivreur, fullName: e.target.value})}
                  required
                  placeholder="Enter full name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newLivreur.email}
                  onChange={(e) => setNewLivreur({...newLivreur, email: e.target.value})}
                  required
                  placeholder="Enter email address"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={newLivreur.phone}
                  onChange={(e) => setNewLivreur({...newLivreur, phone: e.target.value})}
                  required
                  placeholder="Enter phone number"
                />
              </div>
              <div className="form-group">
                <label>Vehicle Type</label>
                <select
                  value={newLivreur.vehicleType}
                  onChange={(e) => setNewLivreur({...newLivreur, vehicleType: e.target.value})}
                  required
                >
                  <option value="">Select vehicle type</option>
                  <option value="MOTORCYCLE">Motorcycle</option>
                  <option value="BICYCLE">Bicycle</option>
                  <option value="CAR">Car</option>
                </select>
              </div>
              <div className="form-group">
                <label>Vehicle Number</label>
                <input
                  type="text"
                  value={newLivreur.vehicleNumber}
                  onChange={(e) => setNewLivreur({...newLivreur, vehicleNumber: e.target.value})}
                  required
                  placeholder="Enter vehicle number"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-button">
                  <i className="fas fa-plus"></i> Add Delivery Personnel
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLivreurs; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import './AdminRestaurants.css';

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const [newRestaurant, setNewRestaurant] = useState({
    nom: '',
    adresse: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/restaurants');
      setRestaurants(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch restaurants');
      setLoading(false);
    }
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/restaurants', newRestaurant);
      setRestaurants([...restaurants, response.data]);
      setShowAddModal(false);
      setNewRestaurant({
        nom: '',
        adresse: '',
        description: '',
        imageUrl: ''
      });
    } catch (err) {
      setError('Failed to add restaurant');
    }
  };

  const handleEditRestaurant = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/restaurants/${selectedRestaurant.id}`, selectedRestaurant);
      setRestaurants(restaurants.map(restaurant => 
        restaurant.id === selectedRestaurant.id ? response.data : restaurant
      ));
      setShowEditModal(false);
      setSelectedRestaurant(null);
    } catch (err) {
      setError('Failed to update restaurant');
    }
  };

  const handleDeleteRestaurant = async () => {
    try {
      await api.delete(`/restaurants/${restaurantToDelete.id}`);
      setRestaurants(restaurants.filter(restaurant => restaurant.id !== restaurantToDelete.id));
      setShowDeleteModal(false);
      setRestaurantToDelete(null);
    } catch (err) {
      setError('Failed to delete restaurant');
    }
  };

  const openEditModal = (restaurant) => {
    setSelectedRestaurant({...restaurant});
    setShowEditModal(true);
  };

  const openDeleteModal = (restaurant) => {
    setRestaurantToDelete(restaurant);
    setShowDeleteModal(true);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-restaurants">
      <div className="admin-header">
        <h1>Manage Restaurants</h1>
        <button 
          className="add-button"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus"></i> Add New Restaurant
        </button>
      </div>

      <div className="restaurants-grid">
        {restaurants.map(restaurant => (
          <div key={restaurant.id} className="restaurant-card">
            <div className="restaurant-image">
              <img src={restaurant.imageUrl || 'https://via.placeholder.com/300x200'} alt={restaurant.nom} />
            </div>
            <div className="restaurant-info">
              <h2>{restaurant.nom}</h2>
              <p>{restaurant.description}</p>
              <p className="address"><i className="fas fa-map-marker-alt"></i> {restaurant.adresse}</p>
            </div>
            <div className="restaurant-actions">
              <button 
                className="edit-button"
                onClick={() => openEditModal(restaurant)}
              >
                <i className="fas fa-edit"></i>
              </button>
              <button 
                className="delete-button"
                onClick={() => openDeleteModal(restaurant)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="modal">
          <div className="modal-content add-modal">
            <h2>Add New Restaurant</h2>
            <form onSubmit={handleAddRestaurant}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newRestaurant.nom}
                  onChange={(e) => setNewRestaurant({...newRestaurant, nom: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={newRestaurant.adresse}
                  onChange={(e) => setNewRestaurant({...newRestaurant, adresse: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newRestaurant.description}
                  onChange={(e) => setNewRestaurant({...newRestaurant, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={newRestaurant.imageUrl}
                  onChange={(e) => setNewRestaurant({...newRestaurant, imageUrl: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-button">Add</button>
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

      {showEditModal && selectedRestaurant && (
        <div className="modal">
          <div className="modal-content edit-modal">
            <h2>Edit Restaurant</h2>
            <form onSubmit={handleEditRestaurant}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={selectedRestaurant.nom}
                  onChange={(e) => setSelectedRestaurant({...selectedRestaurant, nom: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={selectedRestaurant.adresse}
                  onChange={(e) => setSelectedRestaurant({...selectedRestaurant, adresse: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={selectedRestaurant.description}
                  onChange={(e) => setSelectedRestaurant({...selectedRestaurant, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={selectedRestaurant.imageUrl}
                  onChange={(e) => setSelectedRestaurant({...selectedRestaurant, imageUrl: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-button">Update</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedRestaurant(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && restaurantToDelete && (
        <div className="modal">
          <div className="modal-content delete-confirmation small-modal">
            <h3>Delete Restaurant</h3>
            <p>Delete "{restaurantToDelete.nom}"?</p>
            <div className="modal-actions">
              <button 
                className="delete-button"
                onClick={handleDeleteRestaurant}
              >
                Delete
              </button>
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setRestaurantToDelete(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRestaurants; 
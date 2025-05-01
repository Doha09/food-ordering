import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import './Restaurants.css';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await API.get('/restaurants');
        console.log(response.data);
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleViewMenu = (restaurantId) => {
    navigate(`/restaurants/${restaurantId}/menu`);
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x200?text=Restaurant';
  };

  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading restaurants...</p>
      </div>
    );
  }

  return (
    <div className="restaurants-container">
      <h1 className="restaurants-title">Restaurants</h1>
      <div className="restaurants-grid">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-card">
            <div className="restaurant-image">
              <img
                src={restaurant.imageUrl || 'https://placehold.co/300x200?text=Restaurant'}
                alt={restaurant.nom}
                onError={handleImageError}
              />
            </div>
            <div className="restaurant-info">
              <h2 className="restaurant-name">{restaurant.nom}</h2>
              <p className="restaurant-address">
                <i className="fas fa-map-marker-alt"></i>
                {restaurant.adresse}
              </p>
              <div className="restaurant-rating">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
                <span className="rating-text">{restaurant.note}</span>
              </div>
              <button
                className="view-menu-btn"
                onClick={() => handleViewMenu(restaurant.id)}
              >
                View Menu
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurants;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Menu.css';

const Menu = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        const [restaurantResponse, menuResponse] = await Promise.all([
          api.get(`/restaurants/${restaurantId}`),
          api.get(`/restaurants/${restaurantId}/menu`)
        ]);
        setRestaurant(restaurantResponse.data);
        setMenuItems(menuResponse.data);
      } catch (error) {
        console.error('Error fetching restaurant and menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantAndMenu();
  }, [restaurantId]);

  const handleBack = () => {
    navigate('/restaurants');
  };

  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading menu...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="error">
        <p>Restaurant not found</p>
        <button onClick={handleBack}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="menu-container">
      <div className="menu-header">
        <button className="back-button" onClick={handleBack}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <h1 className="restaurant-name">{restaurant.nom}</h1>
        <p className="restaurant-address">
          <i className="fas fa-map-marker-alt"></i>
          {restaurant.adresse}
        </p>
      </div>

      <div className="menu-categories">
        {menuItems.map((category) => (
          <div key={category.id} className="menu-category">
            <h2 className="category-name">{category.nom}</h2>
            <div className="menu-items">
              {category.items.map((item) => (
                <div key={item.id} className="menu-item">
                  <div className="item-info">
                    <h3 className="item-name">{item.nom}</h3>
                    <p className="item-description">{item.description}</p>
                    <p className="item-price">${item.prix.toFixed(2)}</p>
                  </div>
                  {item.imageUrl && (
                    <div className="item-image">
                      <img
                        src={item.imageUrl}
                        alt={item.nom}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100?text=Food';
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu; 
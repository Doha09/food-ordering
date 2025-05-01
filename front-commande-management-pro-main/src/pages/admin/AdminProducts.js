import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import './AdminProducts.css';

const AdminProducts = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantProducts, setRestaurantProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    nom: '',
    description: '',
    prix: '',
    imageUrl: '',
    restaurantId: '',
    categorie: ''
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/restaurants');
      setRestaurants(response.data);
      // Fetch products for each restaurant
      response.data.forEach(restaurant => {
        fetchProductsForRestaurant(restaurant.id);
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch restaurants');
      setLoading(false);
    }
  };

  const fetchProductsForRestaurant = async (restaurantId) => {
    try {
      const response = await api.get(`/produits/restaurant/${restaurantId}`);
      setRestaurantProducts(prev => ({
        ...prev,
        [restaurantId]: response.data
      }));
    } catch (err) {
      console.error(`Failed to fetch products for restaurant ${restaurantId}:`, err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/produits', newProduct);
      setRestaurantProducts(prev => ({
        ...prev,
        [newProduct.restaurantId]: [...(prev[newProduct.restaurantId] || []), response.data]
      }));
      setShowAddModal(false);
      setNewProduct({
        nom: '',
        description: '',
        prix: '',
        imageUrl: '',
        restaurantId: '',
        categorie: ''
      });
    } catch (err) {
      setError('Failed to add product');
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/produits/${selectedProduct.id}`, selectedProduct);
      setRestaurantProducts(prev => ({
        ...prev,
        [selectedProduct.restaurantId]: prev[selectedProduct.restaurantId].map(product =>
          product.id === selectedProduct.id ? response.data : product
        )
      }));
      setShowEditModal(false);
      setSelectedProduct(null);
    } catch (err) {
      setError('Failed to update product');
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await api.delete(`/produits/${productToDelete.id}`);
      setRestaurantProducts(prev => ({
        ...prev,
        [productToDelete.restaurantId]: prev[productToDelete.restaurantId].filter(
          product => product.id !== productToDelete.id
        )
      }));
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const openEditModal = (product, restaurantId) => {
    setSelectedProduct({ ...product, restaurantId });
    setShowEditModal(true);
  };

  const openDeleteModal = (product, restaurantId) => {
    setProductToDelete({ ...product, restaurantId });
    setShowDeleteModal(true);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-products">
      <div className="admin-header">
        <h1>Manage Products</h1>
        <button 
          className="add-button"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus"></i> Add New Product
        </button>
      </div>

      <div className="restaurants-products-container">
        {restaurants.map(restaurant => (
          <div key={restaurant.id} className="restaurant-section">
            <div className="restaurant-header">
              <h2>{restaurant.nom}</h2>
              <p className="restaurant-address">
                <i className="fas fa-map-marker-alt"></i> {restaurant.adresse}
              </p>
            </div>
            
            <div className="products-grid">
              {restaurantProducts[restaurant.id]?.length > 0 ? (
                restaurantProducts[restaurant.id].map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <img src={product.imageUrl || 'https://via.placeholder.com/300x200'} alt={product.nom} />
                    </div>
                    <div className="product-info">
                      <h3>{product.nom}</h3>
                      <p>{product.description}</p>
                      <p className="price"><i className="fas fa-tag"></i> {product.prix} €</p>
                      <p className="category"><i className="fas fa-tags"></i> {product.categorie}</p>
                    </div>
                    <div className="product-actions">
                      <button 
                        className="edit-button"
                        onClick={() => openEditModal(product, restaurant.id)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => openDeleteModal(product, restaurant.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-products">
                  <p>No products available for this restaurant</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="modal">
          <div className="modal-content add-modal">
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newProduct.nom}
                  onChange={(e) => setNewProduct({...newProduct, nom: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.prix}
                  onChange={(e) => setNewProduct({...newProduct, prix: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={newProduct.categorie}
                  onChange={(e) => setNewProduct({...newProduct, categorie: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Restaurant</label>
                <select
                  value={newProduct.restaurantId}
                  onChange={(e) => setNewProduct({...newProduct, restaurantId: e.target.value})}
                  required
                >
                  <option value="">Select a restaurant</option>
                  {restaurants.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
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

      {showEditModal && selectedProduct && (
        <div className="modal">
          <div className="modal-content edit-modal">
            <h2>Edit Product</h2>
            <form onSubmit={handleEditProduct}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={selectedProduct.nom}
                  onChange={(e) => setSelectedProduct({...selectedProduct, nom: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={selectedProduct.description}
                  onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={selectedProduct.prix}
                  onChange={(e) => setSelectedProduct({...selectedProduct, prix: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={selectedProduct.categorie}
                  onChange={(e) => setSelectedProduct({...selectedProduct, categorie: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Restaurant</label>
                <select
                  value={selectedProduct.restaurantId}
                  onChange={(e) => setSelectedProduct({...selectedProduct, restaurantId: e.target.value})}
                  required
                >
                  {restaurants.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={selectedProduct.imageUrl}
                  onChange={(e) => setSelectedProduct({...selectedProduct, imageUrl: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-button">Update</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && productToDelete && (
        <div className="modal">
          <div className="modal-content delete-confirmation small-modal">
            <h3>Delete Product</h3>
            <p>Delete "{productToDelete.nom}"?</p>
            <div className="modal-actions">
              <button 
                className="delete-button"
                onClick={handleDeleteProduct}
              >
                Delete
              </button>
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
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

export default AdminProducts; 
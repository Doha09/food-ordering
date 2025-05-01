import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the admin panel. Manage your restaurants, products, orders, and delivery personnel.</p>
      </div>

      <div className="admin-grid">
        <Link to="/admin/restaurants" className="admin-card">
          <div className="card-icon">
            <i className="fas fa-utensils"></i>
          </div>
          <div className="card-content">
            <h2>Restaurants</h2>
            <p>Manage restaurants, add new ones, and update existing ones</p>
          </div>
        </Link>

        <Link to="/admin/products" className="admin-card">
          <div className="card-icon">
            <i className="fas fa-hamburger"></i>
          </div>
          <div className="card-content">
            <h2>Products</h2>
            <p>Add and manage products for your restaurants</p>
          </div>
        </Link>

        <Link to="/admin/orders" className="admin-card">
          <div className="card-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="card-content">
            <h2>Orders</h2>
            <p>View and manage customer orders</p>
          </div>
        </Link>

        <Link to="/admin/livreurs" className="admin-card">
          <div className="card-icon">
            <i className="fas fa-motorcycle"></i>
          </div>
          <div className="card-content">
            <h2>Delivery Personnel</h2>
            <p>Manage delivery personnel and their assignments</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard; 
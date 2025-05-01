import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/commandes');
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/commandes/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#f1c40f';
      case 'CONFIRMED':
        return '#3498db';
      case 'PREPARING':
        return '#9b59b6';
      case 'READY':
        return '#2ecc71';
      case 'DELIVERED':
        return '#27ae60';
      case 'CANCELLED':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-orders">
      <div className="admin-header">
        <h1>Manage Orders</h1>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Restaurant</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.utilisateur?.fullName || 'Unknown'}</td>
                <td>{order.restaurant?.nom || 'Unknown'}</td>
                <td>{order.total} €</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{ backgroundColor: getStatusColor(order.status) }}
                    className="status-select"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PREPARING">Preparing</option>
                    <option value="READY">Ready</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
                <td>{new Date(order.dateCommande).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="view-button"
                    onClick={() => handleViewOrder(order)}
                  >
                    <i className="fas fa-eye"></i> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showOrderModal && selectedOrder && (
        <div className="modal">
          <div className="modal-content">
            <h2>Order Details</h2>
            <div className="order-details">
              <div className="detail-group">
                <h3>Order Information</h3>
                <p><strong>Order ID:</strong> #{selectedOrder.id}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.dateCommande).toLocaleString()}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Total:</strong> {selectedOrder.total} €</p>
              </div>

              <div className="detail-group">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> {selectedOrder.utilisateur?.fullName || 'Unknown'}</p>
                <p><strong>Email:</strong> {selectedOrder.utilisateur?.email || 'Unknown'}</p>
                <p><strong>Phone:</strong> {selectedOrder.utilisateur?.phone || 'Unknown'}</p>
              </div>

              <div className="detail-group">
                <h3>Restaurant Information</h3>
                <p><strong>Name:</strong> {selectedOrder.restaurant?.nom || 'Unknown'}</p>
                <p><strong>Address:</strong> {selectedOrder.restaurant?.adresse || 'Unknown'}</p>
              </div>

              <div className="detail-group">
                <h3>Order Items</h3>
                <div className="order-items">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-name">{item.produit?.nom || 'Unknown Product'}</span>
                      <span className="item-quantity">x{item.quantite}</span>
                      <span className="item-price">{item.prix} €</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="close-button"
                onClick={() => setShowOrderModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders; 
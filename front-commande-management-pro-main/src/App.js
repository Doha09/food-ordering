import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Restaurants from './pages/Restaurants';
import Produits from './pages/Produits';
import Commandes from './pages/Commandes';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRestaurants from './pages/admin/AdminRestaurants';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminLivreurs from './pages/admin/AdminLivreurs';
import PageTransition from './components/PageTransition';
import './App.css';

const PrivateRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const user = JSON.parse(localStorage.getItem('user'));

  // Redirect admin users to admin dashboard if they're on the root path
  if (user?.role === 'ADMIN' && location.pathname === '/') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="App">
      {!isAuthPage && <Header />}
      <main className={`main-content ${isAuthPage ? 'auth-page' : ''}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/restaurants" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <PageTransition>
                    <AdminDashboard />
                  </PageTransition>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/restaurants" 
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <PageTransition>
                    <AdminRestaurants />
                  </PageTransition>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <PageTransition>
                    <AdminProducts />
                  </PageTransition>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/orders" 
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <PageTransition>
                    <AdminOrders />
                  </PageTransition>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/livreurs" 
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <PageTransition>
                    <AdminLivreurs />
                  </PageTransition>
                </PrivateRoute>
              } 
            />
            
            {/* Client Routes */}
            <Route 
              path="/restaurants" 
              element={
                <PrivateRoute>
                  <PageTransition>
                    <Restaurants />
                  </PageTransition>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/restaurants/:restaurantId/menu" 
              element={
                <PrivateRoute>
                  <PageTransition>
                    <Menu />
                  </PageTransition>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/produits" 
              element={
                <PrivateRoute>
                  <PageTransition>
                    <Produits />
                  </PageTransition>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/commandes" 
              element={
                <PrivateRoute>
                  <PageTransition>
                    <Commandes />
                  </PageTransition>
                </PrivateRoute>
              } 
            />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

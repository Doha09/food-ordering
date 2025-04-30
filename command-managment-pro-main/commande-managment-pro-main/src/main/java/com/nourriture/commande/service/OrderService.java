package com.nourriture.commande.service;

import com.nourriture.commande.entity.Order;
import java.util.List;

public interface OrderService {
    List<Order> getAllOrders();
    List<Order> getOrdersByRestaurantId(Long restaurantId);
    List<Order> getOrdersByClientId(Long clientId);
    Order getOrderById(Long id);
    Order createOrder(Order order);
    Order updateOrder(Long id, Order order);
    void deleteOrder(Long id);
} 
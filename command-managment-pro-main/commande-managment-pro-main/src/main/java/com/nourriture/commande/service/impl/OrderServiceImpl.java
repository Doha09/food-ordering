package com.nourriture.commande.service.impl;

import com.nourriture.auth.entity.Client;
import com.nourriture.auth.entity.Livreur;
import com.nourriture.auth.repository.ClientRepository;
import com.nourriture.auth.repository.LivreurRepository;
import com.nourriture.commande.entity.Order;
import com.nourriture.commande.entity.OrderStatus;
import com.nourriture.commande.repository.OrderRepository;
import com.nourriture.commande.service.OrderService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ClientRepository clientRepository;
    private final LivreurRepository livreurRepository;

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> getOrdersByRestaurantId(Long restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public List<Order> getOrdersByClientId(Long clientId) {
        return orderRepository.findByClientId(clientId);
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));
    }

    @Override
    public Order createOrder(Order order) {
        if (order.getTotalPrice() == null) {
            throw new IllegalArgumentException("Total price cannot be null");
        }
        if (order.getRestaurantId() == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        if (order.getClientId() == null) {
            throw new IllegalArgumentException("Client ID cannot be null");
        }

        // Fetch the client entity
        Client client = clientRepository.findById(order.getClientId())
                .orElseThrow(() -> new EntityNotFoundException("Client not found with id: " + order.getClientId()));
        order.setClient(client);

        // Fetch and set livreur if provided
        if (order.getLivreurId() != null) {
            Livreur livreur = livreurRepository.findById(order.getLivreurId())
                    .orElseThrow(() -> new EntityNotFoundException("Livreur not found with id: " + order.getLivreurId()));
            order.setLivreur(livreur);
        }
        
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        return orderRepository.save(order);
    }

    @Override
    public Order updateOrder(Long id, Order order) {
        Order existingOrder = getOrderById(id);
        if (order.getTotalPrice() != null) {
            existingOrder.setTotalPrice(order.getTotalPrice());
        }
        if (order.getStatus() != null) {
            existingOrder.setStatus(order.getStatus());
        }
        if (order.getLivreurId() != null) {
            Livreur livreur = livreurRepository.findById(order.getLivreurId())
                    .orElseThrow(() -> new EntityNotFoundException("Livreur not found with id: " + order.getLivreurId()));
            existingOrder.setLivreur(livreur);
        }
        return orderRepository.save(existingOrder);
    }

    @Override
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new EntityNotFoundException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
    }
} 
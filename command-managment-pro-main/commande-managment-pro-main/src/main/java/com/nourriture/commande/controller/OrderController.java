package com.nourriture.commande.controller;

import com.nourriture.commande.dto.OrderDTO;
import com.nourriture.commande.entity.Order;
import com.nourriture.commande.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByRestaurantId(@PathVariable Long restaurantId) {
        List<OrderDTO> orders = orderService.getOrdersByRestaurantId(restaurantId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByClientId(@PathVariable Long clientId) {
        List<OrderDTO> orders = orderService.getOrdersByClientId(clientId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(convertToDTO(order));
    }

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO orderDTO) {
        Order order = new Order();
        order.setTotalPrice(orderDTO.getTotalPrice());
        order.setRestaurantId(orderDTO.getRestaurantId());
        order.setClientId(orderDTO.getClientId());
        order.setLivreurId(orderDTO.getLivreurId());
        
        Order createdOrder = orderService.createOrder(order);
        return ResponseEntity.ok(convertToDTO(createdOrder));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable Long id, @RequestBody OrderDTO orderDTO) {
        Order order = new Order();
        order.setTotalPrice(orderDTO.getTotalPrice());
        order.setStatus(orderDTO.getStatus());
        order.setLivreurId(orderDTO.getLivreurId());
        
        Order updatedOrder = orderService.updateOrder(id, order);
        return ResponseEntity.ok(convertToDTO(updatedOrder));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setStatus(order.getStatus());
        dto.setRestaurantId(order.getRestaurantId());
        dto.setClientId(order.getClientId());
        dto.setLivreurId(order.getLivreurId());
        return dto;
    }
} 
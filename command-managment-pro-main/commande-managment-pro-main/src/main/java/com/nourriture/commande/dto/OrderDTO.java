package com.nourriture.commande.dto;

import com.nourriture.commande.entity.OrderStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderDTO {
    private Long id;
    private LocalDateTime orderDate;
    private Double totalPrice;
    private OrderStatus status;
    private Long restaurantId;
    private Long clientId;
    private Long livreurId;
} 
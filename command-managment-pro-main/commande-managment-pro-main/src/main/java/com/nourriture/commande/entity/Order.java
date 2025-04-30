package com.nourriture.commande.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nourriture.auth.entity.Client;
import com.nourriture.auth.entity.Livreur;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(name = "restaurant_id", nullable = false)
    private Long restaurantId;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @JsonProperty("client_id")
    @Column(name = "client_id", insertable = false, updatable = false)
    private Long clientId;

    @ManyToOne
    @JoinColumn(name = "livreur_id")
    private Livreur livreur;

    @JsonProperty("livreur_id")
    @Column(name = "livreur_id", insertable = false, updatable = false)
    private Long livreurId;
} 
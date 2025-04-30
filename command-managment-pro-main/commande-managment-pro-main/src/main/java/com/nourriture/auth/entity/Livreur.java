package com.nourriture.auth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "livreurs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Livreur {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String telephone;

    @Column(nullable = false)
    private String ville;

    @Column(nullable = false)
    private String vehicule;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LivreurStatut statut;
} 
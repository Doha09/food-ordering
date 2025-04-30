package com.nourriture.auth.dto;

import com.nourriture.auth.entity.LivreurStatut;
import lombok.Data;

@Data
public class LivreurDTO {
    private Long id;
    private String fullName;
    private String telephone;
    private String ville;
    private String vehicule;
    private LivreurStatut statut;
    private String email;
    private String username;
} 
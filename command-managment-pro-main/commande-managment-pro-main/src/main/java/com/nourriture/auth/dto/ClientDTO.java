package com.nourriture.auth.dto;

import lombok.Data;

@Data
public class ClientDTO {
    private Long id;
    private String fullName;
    private String telephone;
    private String address;
    private String email;
    private String username;
} 
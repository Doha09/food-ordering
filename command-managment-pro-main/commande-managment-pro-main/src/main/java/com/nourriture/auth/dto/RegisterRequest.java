package com.nourriture.auth.dto;

import com.nourriture.auth.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private Role role;
} 
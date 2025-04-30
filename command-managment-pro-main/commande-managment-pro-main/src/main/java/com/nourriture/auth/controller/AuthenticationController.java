package com.nourriture.auth.controller;

import com.nourriture.auth.dto.LoginRequest;
import com.nourriture.auth.dto.RegisterRequest;
import com.nourriture.auth.entity.User;
import com.nourriture.auth.repository.UserRepository;
import com.nourriture.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final UserRepository userRepository;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Check if username exists
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword()); // In a real application, you should hash the password
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());

        // Save user using service
        User savedUser = userService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        var userOpt = userRepository.findByUsername(request.getUsername());
        
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(request.getPassword())) {
            return ResponseEntity.ok(userOpt.get());
        }
        
        return ResponseEntity.badRequest().body("Invalid username or password");
    }
} 
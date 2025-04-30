package com.nourriture.auth.controller;

import com.nourriture.auth.dto.LivreurDTO;
import com.nourriture.auth.entity.Livreur;
import com.nourriture.auth.entity.User;
import com.nourriture.auth.repository.LivreurRepository;
import com.nourriture.auth.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/livreurs")
@RequiredArgsConstructor
public class LivreurController {

    private final LivreurRepository livreurRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<LivreurDTO>> getAllLivreurs() {
        List<LivreurDTO> livreurs = livreurRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(livreurs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LivreurDTO> getLivreurById(@PathVariable Long id) {
        Livreur livreur = livreurRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Livreur not found with id: " + id));
        return ResponseEntity.ok(convertToDTO(livreur));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LivreurDTO> updateLivreur(@PathVariable Long id, @RequestBody LivreurDTO livreurDTO) {
        Livreur livreur = livreurRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Livreur not found with id: " + id));

        // Update livreur information only if the fields are not null
        if (livreurDTO.getFullName() != null) {
            livreur.setFullName(livreurDTO.getFullName());
        }
        if (livreurDTO.getTelephone() != null) {
            livreur.setTelephone(livreurDTO.getTelephone());
        }
        if (livreurDTO.getVille() != null) {
            livreur.setVille(livreurDTO.getVille());
        }
        if (livreurDTO.getVehicule() != null) {
            livreur.setVehicule(livreurDTO.getVehicule());
        }
        if (livreurDTO.getStatut() != null) {
            livreur.setStatut(livreurDTO.getStatut());
        }

        // Update user information if provided
        if (livreurDTO.getEmail() != null) {
            User user = livreur.getUser();
            user.setEmail(livreurDTO.getEmail());
            userRepository.save(user);
        }

        Livreur updatedLivreur = livreurRepository.save(livreur);
        return ResponseEntity.ok(convertToDTO(updatedLivreur));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLivreur(@PathVariable Long id) {
        if (!livreurRepository.existsById(id)) {
            throw new EntityNotFoundException("Livreur not found with id: " + id);
        }
        livreurRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private LivreurDTO convertToDTO(Livreur livreur) {
        LivreurDTO dto = new LivreurDTO();
        dto.setId(livreur.getId());
        dto.setFullName(livreur.getFullName());
        dto.setTelephone(livreur.getTelephone());
        dto.setVille(livreur.getVille());
        dto.setVehicule(livreur.getVehicule());
        dto.setStatut(livreur.getStatut());
        
        // Add user information
        User user = livreur.getUser();
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getUsername());
        
        return dto;
    }
} 
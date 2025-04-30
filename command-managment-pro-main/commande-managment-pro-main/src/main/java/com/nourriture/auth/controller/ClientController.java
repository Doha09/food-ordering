package com.nourriture.auth.controller;

import com.nourriture.auth.dto.ClientDTO;
import com.nourriture.auth.entity.Client;
import com.nourriture.auth.entity.User;
import com.nourriture.auth.repository.ClientRepository;
import com.nourriture.auth.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        List<ClientDTO> clients = clientRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(clients);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientDTO> getClientById(@PathVariable Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client not found with id: " + id));
        return ResponseEntity.ok(convertToDTO(client));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientDTO> updateClient(@PathVariable Long id, @RequestBody ClientDTO clientDTO) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client not found with id: " + id));

        // Update client information only if the fields are not null
        if (clientDTO.getFullName() != null) {
            client.setFullName(clientDTO.getFullName());
        }
        if (clientDTO.getTelephone() != null) {
            client.setTelephone(clientDTO.getTelephone());
        }
        if (clientDTO.getAddress() != null) {
            client.setAddress(clientDTO.getAddress());
        }

        // Update user information if provided
        if (clientDTO.getEmail() != null) {
            User user = client.getUser();
            user.setEmail(clientDTO.getEmail());
            userRepository.save(user);
        }

        Client updatedClient = clientRepository.save(client);
        return ResponseEntity.ok(convertToDTO(updatedClient));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        if (!clientRepository.existsById(id)) {
            throw new EntityNotFoundException("Client not found with id: " + id);
        }
        clientRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private ClientDTO convertToDTO(Client client) {
        ClientDTO dto = new ClientDTO();
        dto.setId(client.getId());
        dto.setFullName(client.getFullName());
        dto.setTelephone(client.getTelephone());
        dto.setAddress(client.getAddress());
        
        // Add user information
        User user = client.getUser();
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getUsername());
        
        return dto;
    }
} 
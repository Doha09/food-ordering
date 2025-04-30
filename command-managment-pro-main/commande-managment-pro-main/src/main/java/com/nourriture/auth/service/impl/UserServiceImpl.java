package com.nourriture.auth.service.impl;

import com.nourriture.auth.entity.Client;
import com.nourriture.auth.entity.Livreur;
import com.nourriture.auth.entity.LivreurStatut;
import com.nourriture.auth.entity.Role;
import com.nourriture.auth.entity.User;
import com.nourriture.auth.repository.ClientRepository;
import com.nourriture.auth.repository.LivreurRepository;
import com.nourriture.auth.repository.UserRepository;
import com.nourriture.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final LivreurRepository livreurRepository;
    private final ClientRepository clientRepository;

    @Override
    @Transactional
    public User registerUser(User user) {
        User savedUser = userRepository.save(user);
        
        if (savedUser.getRole() == Role.LIVREUR) {
            Livreur livreur = new Livreur();
            livreur.setUser(savedUser);
            livreur.setFullName(savedUser.getUsername());
            livreur.setTelephone("");
            livreur.setVille("");
            livreur.setVehicule("");
            livreur.setStatut(LivreurStatut.INACTIF);
            livreurRepository.save(livreur);
        } else if (savedUser.getRole() == Role.CLIENT) {
            Client client = new Client();
            client.setUser(savedUser);
            client.setFullName(savedUser.getUsername());
            client.setTelephone("");
            client.setAddress("");
            clientRepository.save(client);
        }
        
        return savedUser;
    }
} 
package com.nourriture.restaurant.service.impl;

import com.nourriture.restaurant.entity.Menu;
import com.nourriture.restaurant.entity.Restaurant;
import com.nourriture.restaurant.repository.MenuRepository;
import com.nourriture.restaurant.repository.RestaurantRepository;
import com.nourriture.restaurant.service.MenuService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {

    private final MenuRepository menuRepository;
    private final RestaurantRepository restaurantRepository;

    @Override
    public List<Menu> getAllMenus() {
        return menuRepository.findAll();
    }

    @Override
    public List<Menu> getMenusByRestaurantId(Long restaurantId) {
        return menuRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public Menu getMenuById(Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Menu not found with id: " + id));
    }

    @Override
    public Menu createMenu(Menu menu) {
        Restaurant restaurant = restaurantRepository.findById(menu.getRestaurant().getId())
                .orElseThrow(() -> new EntityNotFoundException("Restaurant not found with id: " + menu.getRestaurant().getId()));
        menu.setRestaurant(restaurant);
        menu.setRestaurantId(restaurant.getId());
        return menuRepository.save(menu);
    }

    @Override
    public Menu updateMenu(Long id, Menu menu) {
        Menu existingMenu = getMenuById(id);
        existingMenu.setName(menu.getName());
        existingMenu.setPrice(menu.getPrice());
        existingMenu.setCategory(menu.getCategory());
        return menuRepository.save(existingMenu);
    }

    @Override
    public void deleteMenu(Long id) {
        if (!menuRepository.existsById(id)) {
            throw new EntityNotFoundException("Menu not found with id: " + id);
        }
        menuRepository.deleteById(id);
    }
} 
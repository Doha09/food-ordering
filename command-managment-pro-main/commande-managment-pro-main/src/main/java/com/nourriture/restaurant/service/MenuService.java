package com.nourriture.restaurant.service;

import com.nourriture.restaurant.entity.Menu;
import java.util.List;

public interface MenuService {
    List<Menu> getAllMenus();
    List<Menu> getMenusByRestaurantId(Long restaurantId);
    Menu getMenuById(Long id);
    Menu createMenu(Menu menu);
    Menu updateMenu(Long id, Menu menu);
    void deleteMenu(Long id);
} 
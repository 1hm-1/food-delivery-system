package com.example.food_delivery.controller;

import com.example.food_delivery.entity.MenuItem;
import com.example.food_delivery.mapper.MenuItemMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private MenuItemMapper menuItemMapper;

    // 获取某家餐厅的菜单
    // 网址: http://localhost:8080/api/menu?restaurantId=1
    @GetMapping
    public List<MenuItem> getMenu(@RequestParam Integer restaurantId) {
        return menuItemMapper.findByRestaurantId(restaurantId);
    }
}
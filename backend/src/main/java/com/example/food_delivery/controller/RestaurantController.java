package com.example.food_delivery.controller;

import com.example.food_delivery.entity.Restaurant;
import com.example.food_delivery.mapper.RestaurantMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantMapper restaurantMapper;

    // 获取餐厅列表接口
    // 网址: GET http://localhost:8080/api/restaurants
    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return restaurantMapper.findAll();
    }
}
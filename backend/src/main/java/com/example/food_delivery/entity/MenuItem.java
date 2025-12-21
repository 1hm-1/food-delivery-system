package com.example.food_delivery.entity;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class MenuItem {
    private Integer id;
    private Integer restaurantId;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
}
package com.example.food_delivery.entity;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class Restaurant {
    private Integer id;
    private String name;
    private Double rating;
    private Integer deliveryTime;
    private BigDecimal deliveryFee;
    private String imageUrl;
}
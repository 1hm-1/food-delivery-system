package com.example.food_delivery.entity;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartItem {
    private Integer id;
    private Integer userId;

    private Integer restaurantId; // 必须记录是哪家店的

    private Integer foodId; // 对应 OrderItem 里的 menuItemId
    private String foodName;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;
}
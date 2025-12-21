package com.example.food_delivery.entity;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItem {
    private Integer id;
    private Integer orderId;
    private Integer menuItemId;
    private String name;
    private Integer quantity;
    private BigDecimal price;
}
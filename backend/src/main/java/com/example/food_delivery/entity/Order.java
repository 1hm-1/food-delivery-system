package com.example.food_delivery.entity;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class Order {
    private Integer id;
    private Integer userId;
    private Integer restaurantId;
    private BigDecimal totalAmount;
    private String status;
    private String address;
    private LocalDateTime createdAt;

    // 这个字段数据库里没有，但为了方便前端传参，我们放在这里
    // 一个订单包含多个详情项
    private List<OrderItem> items;
    // 添加订单历史
    private String restaurantName;
    private String restaurantImage;
}
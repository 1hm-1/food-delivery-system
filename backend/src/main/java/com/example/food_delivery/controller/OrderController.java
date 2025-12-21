package com.example.food_delivery.controller;

import com.example.food_delivery.entity.Order;
import com.example.food_delivery.mapper.OrderMapper;
import com.example.food_delivery.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    // 注入 Service：用于处理复杂的“下单”逻辑（事务控制）
    @Autowired
    private OrderService orderService;

    // 注入 Mapper：用于简单的“查询”逻辑
    @Autowired
    private OrderMapper orderMapper;

    // 1. 下单接口 (之前的代码)
    // POST http://localhost:8080/api/orders
    @PostMapping
    public String createOrder(@RequestBody Order order) {
        orderService.createOrder(order);
        return "下单成功";
    }

    // 2. 获取我的订单列表 (新增的代码)
    // GET http://localhost:8080/api/orders?userId=1
    @GetMapping
    public List<Order> getMyOrders(@RequestParam Integer userId) {
        return orderMapper.findByUserId(userId);
    }
}
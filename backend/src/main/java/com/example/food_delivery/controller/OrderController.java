package com.example.food_delivery.controller;

import com.example.food_delivery.entity.Order;
import com.example.food_delivery.mapper.OrderMapper;
import com.example.food_delivery.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PathVariable;
import com.example.food_delivery.entity.OrderItem;
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

    // 2. 获取我的订单列表 、
    // GET http://localhost:8080/api/orders?userId=1
    @GetMapping
    public List<Order> getMyOrders(@RequestParam Integer userId) {
        return orderMapper.findByUserId(userId);
    }
    // ... 前面的代码保持不变 ...

    //  新增：获取单笔订单详情
    // GET http://localhost:8080/api/orders/123
    @GetMapping("/{orderId}")
    public Order getOrder(@PathVariable Integer orderId) {
        // 1. 先查主单
        Order order = orderMapper.findById(orderId);
        // 2. 再查里面的菜
        if (order != null) {
            List<OrderItem> items = orderMapper.findItemsByOrderId(orderId);
            order.setItems(items); // 组装在一起
        }
        return order;
    }
    //  1. 获取所有订单 (商家/平台端)
    // GET http://localhost:8080/api/orders/merchant/all
    @GetMapping("/merchant/all")
    public List<Order> getAllOrders() {
        return orderMapper.findAllOrders();
    }

    //  2. 更新订单状态 (接单/配送)
    // POST http://localhost:8080/api/orders/status?orderId=1&status=DELIVERED
    @PostMapping("/status")
    public String updateStatus(@RequestParam Integer orderId, @RequestParam String status) {
        orderMapper.updateStatus(orderId, status);
        return "状态更新成功";
    }
}
package com.example.food_delivery.service;

import com.example.food_delivery.entity.Order;
import com.example.food_delivery.entity.OrderItem;
import com.example.food_delivery.mapper.OrderMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    @Autowired
    private OrderMapper orderMapper;

    // @Transactional 是核心：保证了“保存订单主表”和“保存订单详情”这两步
    // 要么同时成功，要么同时失败（回滚），防止数据不一致。
    @Transactional
    public void createOrder(Order order) {
        // 1. 先保存订单主表
        // 执行完这行 SQL 后，数据库生成的自增 ID 会自动填回 order 对象的 id 属性里
        orderMapper.insertOrder(order);

        // 2. 获取刚才生成的订单 ID
        Integer orderId = order.getId();

        // 3. 循环保存订单里的每一道菜
        // 前端传过来的 items 列表里只有菜品信息，没有 orderId，需要我们手动填进去
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setOrderId(orderId); // 关键：把菜品绑定到这张订单上
                orderMapper.insertOrderItem(item);
            }
        }
    }
}
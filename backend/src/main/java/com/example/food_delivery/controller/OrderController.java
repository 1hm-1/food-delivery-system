package com.example.food_delivery.controller;

import com.example.food_delivery.entity.CartItem;
import com.example.food_delivery.entity.Order;
import com.example.food_delivery.entity.OrderItem;
import com.example.food_delivery.mapper.CartMapper;
import com.example.food_delivery.mapper.OrderMapper;
import com.example.food_delivery.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private OrderMapper orderMapper;

    // 注入购物车Mapper，用于结算时读取数据
    @Autowired
    private CartMapper cartMapper;

    // 1. 原有的直接下单接口 (保持不变，兼容旧逻辑)
    @PostMapping
    public String createOrder(@RequestBody Order order) {
        orderService.createOrder(order);
        return "下单成功";
    }

    // ==========================================
    //  2. 新增：购物车结算接口
    // ==========================================
    @PostMapping("/checkout")
    @Transactional // 开启事务
    public String checkoutFromCart(@RequestBody Map<String, Object> payload) {
        Integer userId = (Integer) payload.get("userId");
        String address = (String) payload.get("address");

        if (userId == null || address == null) return "参数缺失";

        // A. 查购物车
        List<CartItem> cartItems = cartMapper.findByUserId(userId);
        if (cartItems.isEmpty()) return "购物车为空";

        // B. 组装主订单 Order 对象
        Order order = new Order();
        order.setUserId(userId);
        order.setAddress(address);
        order.setStatus("PENDING");

        // C. 计算总价 & 获取餐厅ID
        // (假设购物车里的商品都属于同一家餐厅，或者我们只取第一件商品的餐厅ID作为主订单的餐厅)
        BigDecimal totalAmount = BigDecimal.ZERO;
        Integer restaurantId = null;

        for (CartItem item : cartItems) {
            BigDecimal itemTotal = item.getPrice().multiply(new BigDecimal(item.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            // 抓取餐厅ID
            if (restaurantId == null) {
                restaurantId = item.getRestaurantId();
            }
        }

        order.setTotalAmount(totalAmount);
        order.setRestaurantId(restaurantId); // 填入数据库必须的 restaurant_id

        // D. 保存主订单 (生成 orderId)
        // 注意：这里我们直接用 orderMapper，或者你可以封装到 Service 里
        orderMapper.insertOrder(order);

        // E. 保存订单详情 (把 CartItem 转成 OrderItem)
        for (CartItem c : cartItems) {
            OrderItem oi = new OrderItem();
            oi.setOrderId(order.getId());
            oi.setMenuItemId(c.getFoodId()); //  CartItem的foodId 就是 OrderItem的menuItemId
            oi.setName(c.getFoodName());
            oi.setPrice(c.getPrice());
            oi.setQuantity(c.getQuantity());

            orderMapper.insertOrderItem(oi);
        }

        // F. 清空购物车
        cartMapper.clearCart(userId);

        return "下单成功";
    }

    // 3. 获取我的订单列表 (保持不变)
    @GetMapping
    public List<Order> getMyOrders(@RequestParam Integer userId) {
        return orderMapper.findByUserId(userId);
    }

    // 4. 获取单笔订单详情 (保持不变)
    @GetMapping("/{orderId}")
    public Order getOrder(@PathVariable Integer orderId) {
        Order order = orderMapper.findById(orderId);
        if (order != null) {
            List<OrderItem> items = orderMapper.findItemsByOrderId(orderId);
            order.setItems(items);
        }
        return order;
    }

    // 5. 商家接口 (保持不变)
    @GetMapping("/merchant/all")
    public List<Order> getAllOrders() {
        return orderMapper.findAllOrders();
    }

    @PostMapping("/status")
    public String updateStatus(@RequestParam Integer orderId, @RequestParam String status) {
        orderMapper.updateStatus(orderId, status);
        return "状态更新成功";
    }
}
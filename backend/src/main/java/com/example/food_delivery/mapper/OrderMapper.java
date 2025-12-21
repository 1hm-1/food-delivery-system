package com.example.food_delivery.mapper;

import com.example.food_delivery.entity.Order;
import com.example.food_delivery.entity.OrderItem;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface OrderMapper {

    // 1. 插入订单主表
    // useGeneratedKeys=true 意思是：插入成功后，把生成的订单ID (id) 填回到 order 对象里
    // 这一点至关重要！因为下面插入详情表时需要用到这个ID
    @Insert("INSERT INTO tbl_orders(user_id, restaurant_id, total_amount, status, address) " +
            "VALUES(#{userId}, #{restaurantId}, #{totalAmount}, 'PENDING', #{address})")
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "id")
    void insertOrder(Order order);

    // 2. 插入订单详情项
    @Insert("INSERT INTO tbl_order_items(order_id, menu_item_id, name, quantity, price) " +
            "VALUES(#{orderId}, #{menuItemId}, #{name}, #{quantity}, #{price})")
    void insertOrderItem(OrderItem item);

    @Select("SELECT o.*, r.name as restaurantName, r.image_url as restaurantImage " +
            "FROM tbl_orders o " +
            "JOIN tbl_restaurants r ON o.restaurant_id = r.id " +
            "WHERE o.user_id = #{userId} " +
            "ORDER BY o.created_at DESC")
    List<Order> findByUserId(Integer userId);
}


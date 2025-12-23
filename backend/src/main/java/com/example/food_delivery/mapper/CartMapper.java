package com.example.food_delivery.mapper;

import com.example.food_delivery.entity.CartItem;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface CartMapper {

    @Select("SELECT * FROM tbl_cart WHERE user_id = #{userId}")
    List<CartItem> findByUserId(Integer userId);

    // 修改：插入时带上 restaurant_id
    @Insert("INSERT INTO tbl_cart(user_id, restaurant_id, food_id, food_name, price, quantity, image_url) " +
            "VALUES(#{userId}, #{restaurantId}, #{foodId}, #{foodName}, #{price}, #{quantity}, #{imageUrl})")
    void addToCart(CartItem item);

    @Delete("DELETE FROM tbl_cart WHERE id = #{id}")
    void deleteById(Integer id);

    @Delete("DELETE FROM tbl_cart WHERE user_id = #{userId}")
    void clearCart(Integer userId);
}
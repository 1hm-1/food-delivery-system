package com.example.food_delivery.controller;

import com.example.food_delivery.entity.CartItem;
import com.example.food_delivery.mapper.CartMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {

    @Autowired
    private CartMapper cartMapper;

    // 获取购物车列表
    @GetMapping("/list")
    public List<CartItem> getCartList(@RequestParam Integer userId) {
        return cartMapper.findByUserId(userId);
    }

    // 添加商品到购物车
    @PostMapping("/add")
    public String addToCart(@RequestBody CartItem item) {
        cartMapper.addToCart(item);
        return "添加成功";
    }

    // 删除商品
    @DeleteMapping("/delete/{id}")
    public String deleteItem(@PathVariable Integer id) {
        cartMapper.deleteById(id);
        return "删除成功";
    }
}
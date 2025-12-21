package com.example.food_delivery.controller;

import com.example.food_delivery.entity.User;
import com.example.food_delivery.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController // 告诉 Spring Boot 这是一个提供 Web 接口的类
@RequestMapping("/api/users") // 基础网址
public class UserController {

    @Autowired
    private UserService userService;

    // 注册接口
    // 完整网址是: POST http://localhost:8080/api/users/register
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return userService.register(user);
    }
    // 新增：登录接口
    // POST http://localhost:8080/api/users/login
    @PostMapping("/login")
    public Object login(@RequestBody User loginRequest) {
        // loginRequest 里只有 phone 和 passwordHash (前端传过来的密码)
        User user = userService.login(loginRequest.getPhone(), loginRequest.getPasswordHash());

        if (user != null) {
            // 登录成功，为了安全，把密码抹掉再返回给前端
            user.setPasswordHash(null);
            return user; // 返回 JSON 格式的用户信息
        } else {
            // 登录失败，返回 401 状态码或错误信息
            return "登录失败：账号或密码错误";
        }
    }
}
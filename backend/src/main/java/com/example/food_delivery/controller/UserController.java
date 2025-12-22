package com.example.food_delivery.controller;

import com.example.food_delivery.entity.User;
import com.example.food_delivery.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin // 允许前端跨域访问
public class UserController {

    @Autowired
    private UserService userService;

    // ================== 注册接口 ==================
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        // 前端传来的 password 会因为字段名不匹配(password vs passwordHash)而丢失
        // 但前端传来的 user 对象如果是基于我们之前的修改，应该尽量保持字段一致
        // 如果注册也报错，请告诉我，我们需要微调前端
        return userService.register(user);
    }

    // ================== 登录接口 (修复版) ==================
    @PostMapping("/login")
    // 使用 Map<String, String> 而不是 User 对象，
    // 这样可以不管前端传的是 "password" 还是 "passwordHash"，我们都能拿到
    public Object login(@RequestBody Map<String, String> payload) {

        // 1. 获取手机号 (兼容 phone 和 username)
        String phone = payload.get("phone");
        if (phone == null || phone.isEmpty()) {
            phone = payload.get("username");
        }

        // 2. 获取密码 (前端 Login.jsx 传的是 "password")
        String password = payload.get("password");
        //以此防备万一前端改回了 passwordHash
        if (password == null) {
            password = payload.get("passwordHash");
        }

        // 3. 打印日志，看看后端到底收到了什么 (调试用)
        System.out.println("收到登录请求 - 手机号: " + phone + ", 密码(MD5): " + password);

        if (phone == null || password == null) {
            return "登录失败：请求参数缺失";
        }

        User user = userService.login(phone, password);

        if (user != null) {
            // 登录成功，把密码抹掉再返回，保护安全
            user.setPasswordHash(null);
            return user;
        } else {
            return "登录失败：账号或密码错误";
        }
    }
}
package com.example.food_delivery.service;

import com.example.food_delivery.entity.User;
import com.example.food_delivery.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service // 告诉 Spring Boot 这是一个处理业务逻辑的类
public class UserService {

    @Autowired
    private UserMapper userMapper;

    public String register(User user) {
        // 1. 先检查手机号是否已经被注册
        User existingUser = userMapper.findByPhone(user.getPhone());
        if (existingUser != null) {
            return "注册失败：该手机号已存在";
        }

        // 2. 如果没注册过，就插入数据库
        // 这里暂时不加密密码，先把流程跑通，后续再加加密
        userMapper.insert(user);
        return "注册成功";
    }

    // 添加登录接口
    public User login(String phone, String password) {
        // 1. 去数据库根据手机号查用户
        User user = userMapper.findByPhone(phone);

        // 2. 检查用户是否存在，以及密码是否对得上
        // (注意：这里直接比对字符串，实际开发中应该比对加密后的哈希值)
        if (user != null && user.getPasswordHash().equals(password)) {
            // 登录成功！返回用户对象
            return user;
        }
        // 登录失败
        return null;
    }
}
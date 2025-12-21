package com.example.food_delivery.entity;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 用户实体类
 * 对应数据库表: tbl_users
 */
@Data // Lombok 注解：自动帮我们生成 Getter/Setter，省得手写
public class User {
    // 对应 user_id 字段
    private Integer userId;

    // 对应 username 字段
    private String username;

    // 对应 password_hash 字段
    private String passwordHash;

    // 对应 phone 字段
    private String phone;

    // 对应 role 字段 (CUSTOMER 或 MERCHANT)
    private String role;

    // 对应 created_at 字段
    private LocalDateTime createdAt;
}

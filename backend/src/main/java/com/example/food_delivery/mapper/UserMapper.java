package com.example.food_delivery.mapper;

import com.example.food_delivery.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

@Mapper // 告诉 Spring Boot 这是一个操作数据库的工具
public interface UserMapper {

    // 1. 根据手机号查询用户 (登录时要用)
    @Select("SELECT * FROM tbl_users WHERE phone = #{phone}")
    User findByPhone(String phone);

    // 2. 插入新用户 (注册时要用)
    // Options 里的意思是：插入成功后，把数据库自动生成的 id 拿回来填到 user 对象里
    @Insert("INSERT INTO tbl_users(username, password_hash, phone, role) " +
            "VALUES(#{username}, #{passwordHash}, #{phone}, #{role})")
    @Options(useGeneratedKeys = true, keyProperty = "userId", keyColumn = "user_id")
    int insert(User user);
}
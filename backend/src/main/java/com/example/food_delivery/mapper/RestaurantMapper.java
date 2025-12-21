package com.example.food_delivery.mapper;

import com.example.food_delivery.entity.Restaurant;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface RestaurantMapper {
    // 查询所有餐厅，没有任何筛选条件，直接一把梭
    @Select("SELECT * FROM tbl_restaurants")
    List<Restaurant> findAll();
}
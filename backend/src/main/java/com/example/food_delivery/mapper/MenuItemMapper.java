package com.example.food_delivery.mapper;
import com.example.food_delivery.entity.MenuItem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface MenuItemMapper {
    // 根据餐厅ID查菜单
    @Select("SELECT * FROM tbl_menu_items WHERE restaurant_id = #{restaurantId}")
    List<MenuItem> findByRestaurantId(Integer restaurantId);
}
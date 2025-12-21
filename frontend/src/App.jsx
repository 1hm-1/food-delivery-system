import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login"; // 添加Login页面
import Home from "./pages/Home";
import RestaurantDetail from "./pages/RestaurantDetail";
import OrderList from './pages/OrderList';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 默认访问根路径 / 时，重定向到注册页 (方便我们测试) */}
        <Route path="/" element={<Navigate to="/register" replace />} />

        {/* 注册页路由 */}
        <Route path="/register" element={<Register />} />
        {/* 登录页路由 */}
        <Route path="/login" element={<Login />} />

        <Route path="/home" element={<Home />} />

        <Route path="/restaurant" element={<RestaurantDetail />} />

        <Route path="/orders" element={<OrderList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login"; // 添加Login页面
import Home from "./pages/Home";
import RestaurantDetail from "./pages/RestaurantDetail";
import OrderList from './pages/OrderList';
import OrderDetail from "./pages/OrderDetail";
import MerchantDashboard from "./pages/MerchantDashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 默认访问根路径 / 时，重定向到注册页 (方便我们测试) */}
        <Route path="/" element={<Navigate to="/register" replace />} />

        {/* 注册页 */}
        <Route path="/register" element={<Register />} />
        {/* 登录页 */}
        <Route path="/login" element={<Login />} />

        <Route path="/home" element={<Home />} />

        <Route path="/restaurant" element={<RestaurantDetail />} />

        <Route path="/orders" element={<OrderList />} />
        {/* 动态参数所以用id */}
        <Route path="/orders/:id" element={<OrderDetail />} />
        
        <Route path="/merchant" element={<MerchantDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

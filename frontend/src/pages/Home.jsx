import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Typography, Skeleton, Button, Input } from "antd";
import {
  ClockCircleOutlined,
  SearchOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { motion } from "framer-motion";
// 1. 确保引入了跳转工具
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. 确保定义了 navigate
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("/api/restaurants");
        setRestaurants(response.data);
      } catch (error) {
        console.error("获取餐厅失败", error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <Layout style={{ background: "#F5F5F7", minHeight: "100vh" }}>
      <Header
        style={{
          position: "fixed",
          zIndex: 100,
          width: "100%",
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
        }}
      >
        <div style={{ fontSize: "20px", fontWeight: 600, color: "#1d1d1f" }}>
          FoodDelivery<span style={{ color: "#0071e3" }}>.Pro</span>
        </div>

        <div style={{ flex: 1, maxWidth: "400px", margin: "0 20px" }}>
          <Input
            prefix={<SearchOutlined style={{ color: "#86868b" }} />}
            placeholder="搜索美食..."
            style={{
              borderRadius: "20px",
              background: "#e5e5e5",
              border: "none",
              padding: "8px 15px",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <Button
            shape="circle"
            icon={<ShoppingCartOutlined />}
            style={{
              border: "none",
              background: "transparent",
              color: "#1d1d1f",
            }}
          />

          {/* 3. 确保这里的 onClick 是正确的 */}
          <Button
            shape="circle"
            icon={<UserOutlined />}
            onClick={() => navigate("/orders")}
            style={{
              border: "none",
              background: "transparent",
              color: "#1d1d1f",
            }}
          />
        </div>
      </Header>

      <Content
        style={{
          paddingTop: "80px",
          paddingBottom: "50px",
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "30px" }}
        >
          <Title level={2} style={{ color: "#1d1d1f", margin: 0 }}>
            附近的精选餐厅
          </Title>
          <Text style={{ color: "#86868b" }}>发现您身边的绝佳美味</Text>
        </motion.div>

        <Row gutter={[24, 24]}>
          {loading
            ? [1, 2, 3, 4].map((i) => (
                <Col xs={24} sm={12} md={8} lg={6} key={i}>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "16px",
                      padding: "20px",
                      height: "300px",
                    }}
                  >
                    <Skeleton active avatar paragraph={{ rows: 3 }} />
                  </div>
                </Col>
              ))
            : restaurants.map((item, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -10 }}
                    // 点击卡片去详情页
                    onClick={() =>
                      navigate(`/restaurant?id=${item.id}`, {
                        state: { restaurant: item },
                      })
                    }
                  >
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: "20px",
                        overflow: "hidden",
                        cursor: "pointer",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div
                        style={{
                          height: "200px",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 10,
                            right: 10,
                            background: "rgba(255,255,255,0.9)",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#1d1d1f",
                          }}
                        >
                          <ClockCircleOutlined /> {item.deliveryTime} 分钟
                        </div>
                      </div>

                      <div style={{ padding: "20px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "8px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "18px",
                              fontWeight: "bold",
                              color: "#1d1d1f",
                            }}
                          >
                            {item.name}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "#ff9500",
                              fontWeight: "bold",
                            }}
                          >
                            ★ {item.rating}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            color: "#86868b",
                            fontSize: "14px",
                          }}
                        >
                          <span>起送 ¥0</span>
                          <span>配送费 ¥{item.deliveryFee}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Col>
              ))}
        </Row>
      </Content>

      <Footer
        style={{ textAlign: "center", background: "#F5F5F7", color: "#86868b" }}
      >
        FoodDelivery.Pro ©2025 Created by LiHaomin
      </Footer>
    </Layout>
  );
};

export default Home;

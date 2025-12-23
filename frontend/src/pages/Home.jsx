import React, { useEffect, useState } from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Skeleton,
  Button,
  Input,
  Empty,
} from "antd"; // 引入 Empty 组件
import {
  ClockCircleOutlined,
  SearchOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  // 🔥 1. 新增：搜索关键词状态
  const [searchText, setSearchText] = useState("");

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

  // 🔥 2. 核心逻辑：根据搜索词过滤餐厅
  // 如果搜索词为空，就显示所有；否则匹配名字
  const filteredRestaurants = restaurants.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

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
          {/* 🔥 3. 绑定输入框 */}
          <Input
            prefix={<SearchOutlined style={{ color: "#86868b" }} />}
            placeholder="搜索美食..."
            allowClear
            onChange={(e) => setSearchText(e.target.value)} // 实时更新搜索词
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
            onClick={() => navigate("/cart")} //添加跳转
            style={{
              border: "none",
              background: "transparent",
              color: "#1d1d1f",
              cursor: "pointer", // 鼠标变手型
            }}
          />
          <Button
            shape="circle"
            icon={<UserOutlined />}
            onClick={() => navigate("/orders")} // 添加跳转
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
            {searchText ? `搜索 "${searchText}" 的结果` : "附近的精选餐厅"}
          </Title>
          <Text style={{ color: "#86868b" }}>发现您身边的绝佳美味</Text>
        </motion.div>

        {/* 🔥 4. 处理搜索结果为空的情况 */}
        {!loading && filteredRestaurants.length === 0 ? (
          <Empty
            description="没找到这家餐厅，换个词试试？"
            style={{ marginTop: "100px" }}
          />
        ) : (
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
              : // 🔥 5. 这里 map 的是 filteredRestaurants 而不是 restaurants
                filteredRestaurants.map((item, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                    <motion.div
                      layout // 添加 layout 属性，让过滤时的动画更平滑
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -10 }}
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
        )}
      </Content>

      <Footer
        style={{ textAlign: "center", background: "#F5F5F7", color: "#86868b" }}
      >
        FoodDelivery.Pro ©2025 Created by Lihaomin
      </Footer>
    </Layout>
  );
};

export default Home;

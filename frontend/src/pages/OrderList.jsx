import React, { useEffect, useState } from "react";
import { Layout, List, Typography, Tag, Button, Spin, Empty } from "antd";
import { ArrowLeftOutlined, ClockCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Header, Content } = Layout;
const { Title } = Typography;

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 这里的 userId 暂时写死为 1
  const userId = 1;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/orders?userId=${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("获取订单失败", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Layout style={{ background: "#F5F5F7", minHeight: "100vh" }}>
      {/* 顶部导航 */}
      <Header
        style={{
          position: "fixed",
          zIndex: 100,
          width: "100%",
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          onClick={() => navigate("/home")}
          style={{ marginRight: "10px" }}
        >
          返回首页
        </Button>
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>我的订单</div>
      </Header>

      <Content style={{ marginTop: 80, padding: "0 20px 40px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Title level={3} style={{ marginBottom: 20 }}>
            历史订单
          </Title>

          {loading ? (
            <Spin
              size="large"
              style={{ display: "block", margin: "50px auto" }}
            />
          ) : orders.length === 0 ? (
            <Empty description="暂无订单，快去点餐吧" />
          ) : (
            <List
              dataSource={orders}
              renderItem={(item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "16px",
                      padding: "20px",
                      marginBottom: "20px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    {/* 餐厅图片 */}
                    <img
                      src={item.restaurantImage}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "12px",
                        objectFit: "cover",
                      }}
                      alt="餐厅"
                    />

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "5px",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: "16px",
                            color: "#1d1d1f",
                          }}
                        >
                          {item.restaurantName}
                        </div>
                        <div style={{ fontWeight: "bold", color: "#1d1d1f" }}>
                          ¥{item.totalAmount}
                        </div>
                      </div>

                      <div
                        style={{
                          color: "#86868b",
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <ClockCircleOutlined />{" "}
                        {new Date(item.createdAt).toLocaleString()}
                      </div>

                      <div style={{ marginTop: "10px" }}>
                        <Tag
                          color={item.status === "PENDING" ? "blue" : "green"}
                          style={{ borderRadius: "10px" }}
                        >
                          {item.status === "PENDING" ? "准备中" : "已送达"}
                        </Tag>
                        <span style={{ fontSize: "12px", color: "#86868b" }}>
                          配送至: {item.address}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            />
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default OrderList;

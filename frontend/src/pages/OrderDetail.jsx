import React, { useEffect, useState } from "react";
import { Layout, List, Typography, Divider, Button, Spin, Result } from "antd";
import {
  ArrowLeftOutlined,
  ShopOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 获取 URL 里的 ID (例如 /orders/5 中的 5)
  const { id } = useParams();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`/api/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error("获取详情失败", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
    );
  if (!order)
    return (
      <Result status="404" title="订单不存在" subTitle="可能已经被删除了" />
    );

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
          onClick={() => navigate(-1)}
        >
          返回
        </Button>
        <div
          style={{ marginLeft: "10px", fontSize: "18px", fontWeight: "bold" }}
        >
          订单详情
        </div>
      </Header>

      <Content style={{ marginTop: 80, padding: "0 20px 40px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          {/* 1. 状态卡片 */}
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "30px",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <Title level={2} style={{ margin: 0 }}>
              {order.status === "PENDING" ? "准备中" : "已送达"}
            </Title>
            <Text type="secondary">感谢您使用 FoodDelivery.Pro</Text>
          </div>

          {/* 2. 餐厅与菜品 */}
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px",
                paddingBottom: "15px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <ShopOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                {order.restaurantName}
              </span>
            </div>

            <List
              itemLayout="horizontal"
              dataSource={order.items}
              renderItem={(item) => (
                <List.Item>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{item.name}</span>
                    <div style={{ minWidth: "80px", textAlign: "right" }}>
                      <span style={{ color: "#999", marginRight: "10px" }}>
                        x{item.quantity}
                      </span>
                      <span style={{ fontWeight: "bold" }}>¥{item.price}</span>
                    </div>
                  </div>
                </List.Item>
              )}
            />

            <Divider style={{ margin: "15px 0" }} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              <span>实付金额</span>
              <span style={{ fontSize: "20px" }}>¥{order.totalAmount}</span>
            </div>
          </div>

          {/* 3. 配送信息 */}
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "20px",
            }}
          >
            <Title level={5}>配送信息</Title>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
                color: "#666",
              }}
            >
              <EnvironmentOutlined style={{ marginRight: "10px" }} />
              {order.address}
            </div>
            <div style={{ marginTop: "10px", color: "#999", fontSize: "12px" }}>
              下单时间: {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default OrderDetail;

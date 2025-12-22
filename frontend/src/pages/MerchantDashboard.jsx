import React, { useEffect, useState } from "react";
import {
  Layout,
  List,
  Button,
  Tag,
  message,
  Typography,
  Card,
  Badge,
} from "antd";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CarOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const MerchantDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 获取所有订单数据
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/orders/merchant/all");
      setOrders(response.data);
    } catch (error) {
      console.error(error);
      message.error("获取订单失败");
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchOrders();
  }, []);

  // 核心功能：点击"立即配送"
  const handleDeliver = async (orderId) => {
    try {
      // 发送请求给后端修改状态
      await axios.post(
        `/api/orders/status?orderId=${orderId}&status=DELIVERED`
      );
      message.success("订单已发货！");
      // 成功后，立刻刷新列表，让用户看到状态变了
      fetchOrders();
    } catch (error) {
      message.error("操作失败，请检查后端");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* 顶部深色导航栏 */}
      <Header
        style={{
          background: "#001529",
          display: "flex",
          alignItems: "center",
          padding: "0 30px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <ShopOutlined /> 商家管理后台
        </div>
        <div style={{ flex: 1 }} />
        <Button
          type="link"
          onClick={() => navigate("/home")}
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          返回客户端 App
        </Button>
      </Header>

      <Content style={{ padding: "40px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/* 标题栏 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <div>
              <Title level={3} style={{ margin: 0 }}>
                订单监控台
              </Title>
              <Text type="secondary">实时处理来自客户端的订单请求</Text>
            </div>
            <Button
              type="primary"
              icon={<SyncOutlined />}
              onClick={fetchOrders}
            >
              刷新列表
            </Button>
          </div>

          {/* 订单列表 */}
          <List
            loading={loading}
            grid={{ gutter: 16, column: 1 }} // 单列显示
            dataSource={orders}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  style={{
                    borderRadius: "10px",
                    borderLeft:
                      item.status === "PENDING"
                        ? "5px solid #1890ff"
                        : "5px solid #52c41a",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    {/* 左侧：餐厅图 */}
                    <img
                      src={item.restaurantImage}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                      alt="店铺"
                    />

                    {/* 中间：信息 */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text strong style={{ fontSize: 16 }}>
                          #{item.id} - {item.restaurantName}
                        </Text>
                        <Text strong style={{ fontSize: 18, color: "#faad14" }}>
                          ¥{item.totalAmount}
                        </Text>
                      </div>
                      <div style={{ color: "#8c8c8c", margin: "5px 0" }}>
                        下单时间：{new Date(item.createdAt).toLocaleString()}
                      </div>
                      <div style={{ color: "#595959" }}>
                        配送地址：{item.address}
                      </div>
                    </div>

                    {/* 右侧：操作按钮 */}
                    <div style={{ minWidth: "120px", textAlign: "right" }}>
                      {item.status === "PENDING" ? (
                        <Button
                          type="primary"
                          size="large"
                          icon={<CarOutlined />}
                          onClick={() => handleDeliver(item.id)}
                          style={{ borderRadius: "20px", padding: "0 25px" }}
                        >
                          发货
                        </Button>
                      ) : (
                        <Tag
                          icon={<CheckCircleOutlined />}
                          color="success"
                          style={{ padding: "5px 10px", fontSize: "14px" }}
                        >
                          已送达
                        </Tag>
                      )}
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default MerchantDashboard;

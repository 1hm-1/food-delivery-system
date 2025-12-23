import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  List,
  Button,
  Avatar,
  message,
  Empty,
  Card,
  Modal,
  Input,
} from "antd";
import {
  DeleteOutlined,
  LeftOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 新增：弹窗和地址状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [address, setAddress] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const navigate = useNavigate();

  // 1. 获取 userId (解析 user 对象)
  const getUserID = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) return JSON.parse(userStr).userId;
    } catch (e) {
      return null;
    }
    return null;
  };
  const userId = getUserID();

  // 2. 加载购物车
  useEffect(() => {
    if (!userId) {
      message.warning("请先登录");
      navigate("/login");
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/cart/list?userId=${userId}`);
      setCartItems(res.data);
    } catch (error) {
      message.error("获取购物车失败");
    } finally {
      setLoading(false);
    }
  };

  // 3. 删除商品
  const removeItem = async (id) => {
    try {
      await axios.delete(`/api/cart/delete/${id}`);
      message.success("已移除");
      fetchCart();
    } catch (error) {
      message.error("移除失败");
    }
  };

  // 🔥 4. 点击“去结算”按钮 -> 打开弹窗
  const handleCheckoutClick = () => {
    setIsModalVisible(true);
  };

  // 🔥 5. 确认下单 (调用后端 /checkout 接口)
  const handleConfirmOrder = async () => {
    if (!address.trim()) {
      message.error("请填写收货地址");
      return;
    }

    setCheckoutLoading(true);
    try {
      const payload = {
        userId: userId,
        address: address,
      };

      // 调用我们在 OrderController 里写的 checkout 接口
      const res = await axios.post("/api/orders/checkout", payload);

      if (res.data === "下单成功") {
        message.success("下单成功！美味即将送达");
        setIsModalVisible(false); // 关弹窗
        setCartItems([]); // 清空前端列表

        // 自动跳转到订单列表页
        setTimeout(() => navigate("/orders"), 1500);
      } else {
        message.error(res.data);
      }
    } catch (error) {
      console.error(error);
      message.error("下单失败，请稍后重试");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Layout style={{ minHeight: "100vh", background: "#F5F5F7" }}>
      <Header
        style={{
          background: "#fff",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <LeftOutlined
          style={{ fontSize: "20px", cursor: "pointer", marginRight: "20px" }}
          onClick={() => navigate("/home")}
        />
        <Title level={4} style={{ margin: 0, flex: 1 }}>
          我的购物车
        </Title>
      </Header>

      <Content
        style={{
          padding: "20px",
          maxWidth: "800px",
          margin: "0 auto",
          width: "100%",
          paddingBottom: "100px",
        }}
      >
        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <Empty description="购物车空空如也" />
            <Button
              type="primary"
              shape="round"
              style={{ marginTop: "20px", background: "#1d1d1f" }}
              onClick={() => navigate("/home")}
            >
              去逛逛
            </Button>
          </div>
        ) : (
          <>
            <Card
              style={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
            >
              <List
                loading={loading}
                itemLayout="horizontal"
                dataSource={cartItems}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeItem(item.id)}
                      >
                        删除
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          shape="square"
                          size={64}
                          src={
                            item.imageUrl || "https://via.placeholder.com/100"
                          }
                        />
                      }
                      title={
                        <span style={{ fontSize: "16px", fontWeight: 600 }}>
                          {item.foodName}
                        </span>
                      }
                      description={
                        <div>
                          <Text
                            style={{ color: "#ff4d4f", fontWeight: "bold" }}
                          >
                            ¥ {item.price}
                          </Text>
                          <span style={{ marginLeft: "10px", color: "#999" }}>
                            x {item.quantity}
                          </span>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>

            {/* 底部结算栏 */}
            <div
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                background: "#fff",
                padding: "15px 30px",
                boxShadow: "0 -4px 12px rgba(0,0,0,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 100,
              }}
            >
              <div>
                <Text style={{ fontSize: "16px" }}>合计: </Text>
                <Text
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#ff4d4f",
                  }}
                >
                  ¥ {totalPrice.toFixed(2)}
                </Text>
              </div>

              {/* 🔥 这里修改了：绑定了 handleCheckoutClick 事件 */}
              <Button
                type="primary"
                size="large"
                shape="round"
                style={{
                  background: "#0071e3",
                  border: "none",
                  width: "120px",
                  fontWeight: "bold",
                }}
                onClick={handleCheckoutClick}
              >
                去结算
              </Button>
            </div>
          </>
        )}

        {/* 🔥 新增：下单输入地址的弹窗 */}
        <Modal
          title="确认订单信息"
          open={isModalVisible}
          onOk={handleConfirmOrder}
          onCancel={() => setIsModalVisible(false)}
          confirmLoading={checkoutLoading}
          okText="确认支付"
          cancelText="取消"
        >
          <div style={{ marginBottom: "15px" }}>
            <Text type="secondary">订单总额：</Text>
            <Text
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#ff4d4f",
                marginLeft: "10px",
              }}
            >
              ¥ {totalPrice.toFixed(2)}
            </Text>
          </div>

          <div style={{ marginBottom: "10px" }}>收货地址：</div>
          <Input.TextArea
            rows={3}
            placeholder="请输入详细收货地址 (例如：宿舍楼A-505)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            prefix={<EnvironmentOutlined />}
          />
        </Modal>
      </Content>
    </Layout>
  );
};

export default Cart;

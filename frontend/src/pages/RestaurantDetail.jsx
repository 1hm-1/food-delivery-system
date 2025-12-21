import React, { useEffect, useState } from "react";
import {
  Layout,
  Button,
  List,
  Typography,
  Badge,
  message,
  Spin,
  Card,
  Row,
  Col,
} from "antd";
import {
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const RestaurantDetail = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});
  const [submitting, setSubmitting] = useState(false); // 新增：提交中的状态

  const navigate = useNavigate();
  const location = useLocation();
  const restaurant = location.state?.restaurant;
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get("id");

  // 1. 加载菜单
  useEffect(() => {
    if (!restaurantId) return;
    const fetchMenu = async () => {
      try {
        const response = await axios.get(
          `/api/menu?restaurantId=${restaurantId}`
        );
        setMenu(response.data);
      } catch (error) {
        message.error("获取菜单失败");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [restaurantId]);

  // 购物车加减逻辑
  const addToCart = (item) => {
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
  };

  const removeFromCart = (item) => {
    setCart((prev) => {
      const newCount = (prev[item.id] || 0) - 1;
      if (newCount <= 0) {
        const newCart = { ...prev };
        delete newCart[item.id];
        return newCart;
      }
      return { ...prev, [item.id]: newCount };
    });
  };

  const totalPrice = Object.keys(cart).reduce((sum, itemId) => {
    const item = menu.find((m) => m.id === parseInt(itemId));
    return sum + (item ? item.price * cart[itemId] : 0);
  }, 0);

  const totalCount = Object.values(cart).reduce((a, b) => a + b, 0);

  // 🔥 核心新增：处理下单逻辑
  const handleCheckout = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      // 1. 组装后端需要的 "Items" 列表
      const orderItems = Object.keys(cart).map((itemId) => {
        const item = menu.find((m) => m.id === parseInt(itemId));
        return {
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: cart[itemId],
        };
      });

      // 2. 组装主订单数据
      const payload = {
        userId: 1, // ⚠️ 为了测试方便，暂时写死用户ID=1 (以后从登录信息取)
        restaurantId: parseInt(restaurantId),
        totalAmount: totalPrice,
        address: "学校南门快递柜", // 暂时写死地址
        items: orderItems,
      };

      // 3. 发送给后端
      console.log("正在发送订单:", payload);
      const response = await axios.post("/api/orders", payload);

      // 4. 成功后的处理
      if (response.data === "下单成功") {
        message.success({
          content: "下单成功！正在为您准备美食...",
          duration: 2,
        });
        setCart({}); // 清空购物车
        // 2秒后跳回首页
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        message.error("下单出了点小问题");
      }
    } catch (error) {
      console.error("下单失败", error);
      message.error("网络连接失败，请检查后端");
    } finally {
      setSubmitting(false);
    }
  };

  if (!restaurant) {
    return (
      <div style={{ padding: 50, textAlign: "center" }}>
        数据丢失，请返回首页重新进入
      </div>
    );
  }

  return (
    <Layout style={{ background: "#F5F5F7", minHeight: "100vh" }}>
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
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          onClick={() => navigate(-1)}
          style={{ marginRight: "10px" }}
        >
          返回
        </Button>
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
          {restaurant.name}
        </div>
      </Header>

      <Content style={{ marginTop: 64, paddingBottom: 100 }}>
        <div
          style={{ height: "200px", overflow: "hidden", position: "relative" }}
        >
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
              padding: "20px",
              color: "white",
            }}
          >
            <Title level={3} style={{ color: "white", margin: "0" }}>
              {restaurant.name}
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.8)" }}>
              配送费 ¥{restaurant.deliveryFee} • {restaurant.deliveryTime} 分钟
            </Text>
          </div>
        </div>

        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
          <Title level={4} style={{ marginBottom: 20 }}>
            菜单
          </Title>
          {loading ? (
            <Spin
              size="large"
              style={{ display: "block", margin: "50px auto" }}
            />
          ) : (
            <List
              grid={{ gutter: 16, xs: 1, sm: 2 }}
              dataSource={menu}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    hoverable
                    style={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                    bodyStyle={{ padding: "15px" }}
                  >
                    <div style={{ display: "flex", gap: "15px" }}>
                      <img
                        src={item.imageUrl}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                          {item.name}
                        </div>
                        <div
                          style={{
                            color: "#888",
                            fontSize: "12px",
                            margin: "5px 0",
                          }}
                        >
                          {item.description}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <div style={{ color: "#ff4d4f", fontWeight: "bold" }}>
                            ¥{item.price}
                          </div>
                          {cart[item.id] ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <Button
                                shape="circle"
                                size="small"
                                icon={<MinusOutlined />}
                                onClick={() => removeFromCart(item)}
                              />
                              <span style={{ fontWeight: "bold" }}>
                                {cart[item.id]}
                              </span>
                              <Button
                                shape="circle"
                                size="small"
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => addToCart(item)}
                              />
                            </div>
                          ) : (
                            <Button
                              type="primary"
                              shape="circle"
                              icon={<PlusOutlined />}
                              onClick={() => addToCart(item)}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          )}
        </div>
      </Content>

      <AnimatePresence>
        {totalCount > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            style={{
              position: "fixed",
              bottom: 20,
              left: 20,
              right: 20,
              maxWidth: "800px",
              margin: "0 auto",
              background: "#1d1d1f",
              borderRadius: "50px",
              padding: "15px 30px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              color: "white",
              zIndex: 1000,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <Badge count={totalCount} offset={[5, -5]}>
                <div
                  style={{
                    background: "#333",
                    padding: "10px",
                    borderRadius: "50%",
                  }}
                >
                  <ShoppingCartOutlined
                    style={{ color: "white", fontSize: "20px" }}
                  />
                </div>
              </Badge>
              <div>
                <div style={{ fontSize: "12px", color: "#888" }}>预计总价</div>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                  ¥{totalPrice.toFixed(2)}
                </div>
              </div>
            </div>
            {/* 🔥 修改这里：onClick 指向 handleCheckout，并增加了 loading 状态 */}
            <Button
              type="primary"
              shape="round"
              size="large"
              loading={submitting}
              style={{
                background: "#0071e3",
                border: "none",
                fontWeight: "bold",
              }}
              onClick={handleCheckout}
            >
              {submitting ? "支付中..." : "去结算"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default RestaurantDetail;

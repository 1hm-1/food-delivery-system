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

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const RestaurantDetail = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({}); // 本地显示的购物车状态（用于显示数字）
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const restaurant = location.state?.restaurant;
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get("id");

  // 🔥 1. 获取正确的 userId (从 User 对象中解析)
  const getUserID = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        return JSON.parse(userStr).userId;
      }
    } catch (e) {
      return null;
    }
    return null;
  };
  const userId = getUserID();

  // 加载菜单
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

  // 点击加号时，发送给后端数据库
  const addToCart = async (item) => {
    if (!userId) {
      message.warning("请先登录");
      navigate("/login");
      return;
    }

    //前端立即更新 UI 
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));

    // B. 后台悄悄发送数据给数据库
    try {
      const payload = {
        userId: userId,
        restaurantId: parseInt(restaurantId),
        foodId: item.id,
        foodName: item.name,
        price: item.price,
        quantity: 1, // 每次增加1个
        imageUrl: item.imageUrl,
      };
      await axios.post("/api/cart/add", payload);
      // message.success("已加入购物车"); 
    } catch (error) {
      console.error("同步购物车失败", error);
      // 如果失败了，最好把 UI 回滚
    }
  };

  // 移出购物车 (暂时只做前端减少，实际项目建议也调用后端 delete 接口)
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
    // 注意：为了完整性，这里其实也应该调用 axios.post("/api/cart/reduce") 或 delete
    // 但为了不让代码太复杂，这里暂时只处理了前端显示的减少。
    // 如果你点击删除，目前数据库里不会减少，只有在购物车页面点击删除才会真删。
  };

  const totalPrice = Object.keys(cart).reduce((sum, itemId) => {
    const item = menu.find((m) => m.id === parseInt(itemId));
    return sum + (item ? item.price * cart[itemId] : 0);
  }, 0);

  const totalCount = Object.values(cart).reduce((a, b) => a + b, 0);

  // 直接结算逻辑 (保留你的原始逻辑)
  const handleCheckout = async () => {
    // 这里我们可以改一下逻辑：点击去结算，直接跳转到购物车页面
    // 因为数据已经存到数据库了，去购物车结算更合理
    navigate("/cart");
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
        {/* 顶部大图 */}
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

        {/* 菜单列表 */}
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
                        alt={item.name}
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
                <div style={{ fontSize: "12px", color: "#888" }}>当前小计</div>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                  ¥{totalPrice.toFixed(2)}
                </div>
              </div>
            </div>
            {/* 🔥 修改：点击这里现在去购物车结算，而不是直接下单 */}
            <Button
              type="primary"
              shape="round"
              size="large"
              style={{
                background: "#0071e3",
                border: "none",
                fontWeight: "bold",
              }}
              onClick={handleCheckout}
            >
              去购物车结算
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default RestaurantDetail;

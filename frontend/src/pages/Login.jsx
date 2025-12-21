import React, { useState } from "react";
import { Form, Input, Button, message, Layout } from "antd";
import {
  MobileOutlined,
  LockOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Content, Footer } = Layout;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        phone: values.phone,
        passwordHash: values.password,
      };

      const response = await axios.post("/api/users/login", payload);

      if (typeof response.data === "object" && response.data.userId) {
        message.success("欢迎回来！");
        // 跳转到首页 ---
        setTimeout(() => {
          navigate("/home");
        }, 1000);
        console.log("登录用户信息:", response.data);
      } else {
        message.error(response.data);
      }
    } catch (error) {
      message.error("登录服务暂时不可用");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. 背景改为浅灰
    <Layout
      style={{
        background: "#F5F5F7",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          cursor: "pointer",
          color: "#86868b",
          zIndex: 10,
        }}
        onClick={() => navigate("/register")}
      >
        <ArrowLeftOutlined /> 返回注册
      </div>

      <Content style={{ width: "100%", maxWidth: "400px", padding: "20px" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div
              style={{
                fontSize: "40px",
                fontWeight: 600,
                color: "#1d1d1f",
                letterSpacing: "-1px",
              }}
            >
              登录
            </div>
            <div
              style={{ color: "#86868b", marginTop: "10px", fontSize: "16px" }}
            >
              继续您的美食之旅
            </div>
          </div>

          {/* 2. 卡片改为磨砂白 + 阴影 */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(30px)",
              borderRadius: "24px",
              padding: "40px 30px",
              border: "1px solid rgba(255,255,255,0.5)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            }}
          >
            <Form
              name="login"
              onFinish={onFinish}
              size="large"
              layout="vertical"
            >
              <Form.Item
                name="phone"
                rules={[{ required: true, message: "请输入手机号" }]}
              >
                <Input
                  prefix={<MobileOutlined style={{ color: "#86868b" }} />}
                  placeholder="手机号"
                  style={{
                    background: "#fff",
                    border: "1px solid #d2d2d7",
                    color: "#1d1d1f",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#86868b" }} />}
                  placeholder="密码"
                  style={{
                    background: "#fff",
                    border: "1px solid #d2d2d7",
                    color: "#1d1d1f",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                />
              </Form.Item>

              <Form.Item>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    size="large"
                    style={{
                      height: "50px",
                      borderRadius: "25px",
                      fontSize: "16px",
                      fontWeight: 600,
                      background:
                        "linear-gradient(90deg, #0071e3 0%, #42a1ff 100%)",
                      border: "none",
                      boxShadow: "0 4px 10px rgba(0, 113, 227, 0.3)",
                    }}
                  >
                    登录
                  </Button>
                </motion.div>
              </Form.Item>
            </Form>
          </div>
        </motion.div>
      </Content>

      <Footer
        style={{
          position: "absolute",
          bottom: 20,
          background: "transparent",
          color: "#86868b",
        }}
      >
        FoodDelivery.Pro Secure Login
      </Footer>
    </Layout>
  );
};

export default Login;

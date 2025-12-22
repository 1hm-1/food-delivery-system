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
import CryptoJS from "crypto-js"; // 1. 引入加密库

const { Content, Footer } = Layout;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 2. 登录时也必须加密，才能和数据库里的密文匹配
      const encryptedPassword = CryptoJS.MD5(values.password).toString();

      const payload = {
        phone: values.phone,
        password: encryptedPassword, // 注意：虽然 User.java 是 passwordHash，但 Controller 接收 map 可能用了 password 这个key，我们保持一致
      };

      // 这里的 payload 键名取决于你的 UserController 里的 login 接收方式
      // 如果后端是 Map<String, String> payload，且取值是用 payload.get("password")
      // 那么这里传 password 就对了。
      // 如果后端 login 接口用 User 实体接收，那应该传 passwordHash

      // 根据之前的交流，后端 Login 接口接收的是 Map，取的是 "password" 和 "username"(或者 phone)
      // 我们稍微调整一下 payload 以匹配通用情况：
      const finalPayload = {
        username: values.phone, // 有些后端实现可能用 username 接手机号
        phone: values.phone,
        password: encryptedPassword,
      };

      const response = await axios.post("/api/users/login", finalPayload);

      if (typeof response.data === "object" && response.data.userId) {
        message.success("欢迎回来！");
        // 保存用户信息到本地
        localStorage.setItem("user", JSON.stringify(response.data));

        setTimeout(() => {
          navigate("/home"); // 假设登录后去 home
        }, 1000);
      } else {
        // 如果后端返回空，说明登录失败
        message.error("登录失败：手机号或密码错误");
      }
    } catch (error) {
      console.error(error);
      message.error("登录服务暂时不可用");
    } finally {
      setLoading(false);
    }
  };

  return (
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
                  style={{ borderRadius: "12px", padding: "12px" }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#86868b" }} />}
                  placeholder="密码"
                  style={{ borderRadius: "12px", padding: "12px" }}
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

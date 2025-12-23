import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Layout,
  Row,
  Col,
  Typography,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import CryptoJS from "crypto-js"; 

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const appleEase = [0.16, 1, 0.3, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: appleEase,
      delay: i * 0.15,
    },
  }),
};

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  const onFinish = async (values) => {
    // 正则校验手机号 (11位，1开头)
    const phoneRegex = /^1\d{10}$/;
    if (!phoneRegex.test(values.phone)) {
      message.error("请输入有效的11位手机号码");
      return;
    }

    // 校验密码长度 (不少于6位)
    if (values.password.length < 6) {
      message.error("密码长度不能少于6位");
      return;
    }

    setLoading(true);
    try {
      //  前端加密密码 (MD5)
      const encryptedPassword = CryptoJS.MD5(values.password).toString();

      const payload = {
        username: values.username,
        phone: values.phone,
        role: "CUSTOMER",
        passwordHash: encryptedPassword, // 发送加密后的密文
      };

      const response = await axios.post("/api/users/register", payload);

      // 兼容后端返回字符串或JSON的情况
      if (response.data === "注册成功" || response.data?.code === 200) {
        message.success({
          content: "注册成功，欢迎加入。",
          style: { marginTop: "20vh" },
        });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        message.error(
          typeof response.data === "string" ? response.data : "注册失败"
        );
      }
    } catch (error) {
      console.error(error);
      message.error("请求失败，请检查网络或联系管理员");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      style={{ background: "#F5F5F7", minHeight: "100vh", overflowX: "hidden" }}
    >
      <Header
        style={{
          position: "fixed",
          zIndex: 100,
          width: "100%",
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 40px",
        }}
      >
        <div
          style={{
            color: "#1d1d1f",
            fontSize: "20px",
            fontWeight: 600,
            letterSpacing: "-0.5px",
          }}
        >
          FoodDelivery<span style={{ color: "#0071e3" }}>.Com</span>
        </div>
        <div>
          <Button
            type="primary"
            shape="round"
            onClick={() => navigate("/login")}
            style={{ background: "#1d1d1f", color: "#fff", border: "none" }}
          >
            登录
          </Button>
        </div>
      </Header>

      <Content style={{ position: "relative" }}>
        <div
          style={{
            height: "90vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <motion.div style={{ y: y1, textAlign: "center", zIndex: 1 }}>
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeInUp}
            >
              <Title
                level={1}
                style={{
                  color: "#1d1d1f",
                  fontSize: "80px",
                  margin: 0,
                  letterSpacing: "-2px",
                  lineHeight: 1.1,
                }}
              >
                重新定义
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #0071e3 0%, #42a1ff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  外卖体验
                </span>
              </Title>
            </motion.div>
          </motion.div>
        </div>

        <div
          style={{
            minHeight: "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#F5F5F7",
          }}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            style={{ width: "100%", maxWidth: "480px" }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(30px)",
                borderRadius: "30px",
                padding: "50px 40px",
                border: "1px solid rgba(255,255,255,0.5)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
              }}
            >
              <Title
                level={2}
                style={{
                  color: "#1d1d1f",
                  textAlign: "center",
                  marginBottom: "40px",
                }}
              >
                即刻启程
              </Title>

              <Form
                name="register"
                onFinish={onFinish}
                size="large"
                layout="vertical"
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: "请输入用户名" }]}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: "#86868b" }} />}
                    placeholder="用户名"
                    style={{ borderRadius: "12px", padding: "12px" }}
                  />
                </Form.Item>

                {/* 这里的 name 必须是 phone，才能被正则校验检测到 */}
                <Form.Item
                  name="phone"
                  rules={[{ required: true, message: "请输入手机号" }]}
                >
                  <Input
                    prefix={<MobileOutlined style={{ color: "#86868b" }} />}
                    placeholder="手机号"
                    maxLength={11}
                    style={{ borderRadius: "12px", padding: "12px" }}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: "请输入密码" }]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: "#86868b" }} />}
                    placeholder="设置密码 (至少6位)"
                    style={{ borderRadius: "12px", padding: "12px" }}
                  />
                </Form.Item>

                <Form.Item>
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
                    }}
                  >
                    创建账户
                  </Button>
                </Form.Item>
              </Form>
              <div
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  color: "#86868b",
                }}
              >
                已有账号?{" "}
                <span
                  onClick={() => navigate("/login")}
                  style={{
                    color: "#0071e3",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  立即登录
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
          background: "#F5F5F7",
          color: "#86868b",
          borderTop: "1px solid #e5e5e5",
        }}
      >
        Copyright © 2025 LabWork 李昊旻
      </Footer>
    </Layout>
  );
};

export default Register;

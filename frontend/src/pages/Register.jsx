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

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

// 动画曲线保持不变，依旧丝滑
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
    setLoading(true);
    try {
      const payload = {
        ...values,
        role: "CUSTOMER",
        passwordHash: values.password,
      };
      const response = await axios.post("/api/users/register", payload);
      if (response.data === "注册成功") {
        message.success({
          content: "欢迎加入，体验开始。",
          style: { marginTop: "20vh" },
        });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        message.error(response.data);
      }
    } catch (error) {
      message.error("请检查网络连接");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. 全局背景改为柔和的灰白色 #F5F5F7
    <Layout
      style={{ background: "#F5F5F7", minHeight: "100vh", overflowX: "hidden" }}
    >
      {/* 2. 导航栏：改为半透明磨砂白 */}
      <Header
        style={{
          position: "fixed",
          zIndex: 100,
          width: "100%",
          background: "rgba(255, 255, 255, 0.7)", // 白色半透明
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)", // 极淡的分割线
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 40px",
        }}
      >
        <div
          style={{
            color: "#1d1d1f", // Logo 变黑
            fontSize: "20px",
            fontWeight: 600,
            letterSpacing: "-0.5px",
          }}
        >
          FoodDelivery<span style={{ color: "#0071e3" }}>.Pro</span>
        </div>
        <div>
          <Button type="link" style={{ color: "#1d1d1f" }}>
            概览
          </Button>
          <Button type="link" style={{ color: "#86868b" }}>
            技术
          </Button>
          <Button
            type="primary"
            shape="round"
            onClick={() => navigate("/login")}
            // 登录按钮改为黑色，在浅色背景上更显高级
            style={{ background: "#1d1d1f", color: "#fff", border: "none" }}
          >
            登录
          </Button>
        </div>
      </Header>

      <Content style={{ position: "relative" }}>
        {/* Hero 区域 */}
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
                  color: "#1d1d1f", // 标题变黑
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
                    // 渐变色微调，使其在浅色背景更透亮
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

            <motion.div
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeInUp}
            >
              <Text
                style={{
                  display: "block",
                  color: "#86868b", // 副标题用深灰
                  fontSize: "24px",
                  marginTop: "20px",
                  maxWidth: "600px",
                }}
              >
                快。准。狠。前所未有的送达速度，
                <br />
                加入我们
              </Text>
            </motion.div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ position: "absolute", bottom: "50px", color: "#1d1d1f" }}
          >
            <ArrowRightOutlined
              style={{ transform: "rotate(90deg)", fontSize: "24px" }}
            />
          </motion.div>
        </div>

        {/* 3. 功能展示区：改为白色背景 */}
        <div style={{ padding: "100px 50px", background: "#fff" }}>
          <Row gutter={[48, 48]} justify="center">
            {["极速送达", "安全加密", "极致流畅"].map((item, index) => (
              <Col xs={24} md={8} key={item} style={{ textAlign: "center" }}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  custom={index}
                  variants={fadeInUp}
                >
                  <div
                    style={{
                      height: "200px",
                      background: "#F5F5F7", // 卡片背景改浅灰
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "30px",
                      fontWeight: "bold",
                      color: "#1d1d1f", // 文字变黑
                      boxShadow: "0 10px 30px rgba(0,0,0,0.05)", // 增加柔和投影
                    }}
                  >
                    {item}
                  </div>
                  <p
                    style={{
                      color: "#86868b",
                      marginTop: "20px",
                      fontSize: "16px",
                    }}
                  >
                    {index === 0 && "30分钟内，使命必达。"}
                    {index === 1 && "企业级的数据保护。"}
                    {index === 2 && "React + Spring Boot 强力驱动。"}
                  </p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>

        {/* 4. 注册表单区：浅色磨砂玻璃 */}
        <div
          style={{
            minHeight: "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#F5F5F7", // 浅灰背景
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
                background: "rgba(255, 255, 255, 0.6)", // 白色毛玻璃
                backdropFilter: "blur(30px)",
                borderRadius: "30px",
                padding: "50px 40px",
                border: "1px solid rgba(255,255,255,0.5)", // 边框稍微亮一点
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)", // 增加立体感阴影
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
                    style={{
                      background: "#fff", // 输入框纯白
                      border: "1px solid #d2d2d7", // 苹果风格的淡灰边框
                      color: "#1d1d1f",
                      borderRadius: "12px",
                      padding: "12px",
                    }}
                  />
                </Form.Item>

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
                    placeholder="设置密码"
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
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
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
                        fontSize: "18px",
                        fontWeight: 600,
                        background:
                          "linear-gradient(90deg, #0071e3 0%, #42a1ff 100%)", // 经典的苹果蓝
                        border: "none",
                        boxShadow: "0 4px 10px rgba(0, 113, 227, 0.3)", // 按钮阴影
                      }}
                    >
                      创建账户
                    </Button>
                  </motion.div>
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
                    marginLeft: "5px",
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
        Copyright © 2025 FoodDelivery Inc. All rights reserved.
      </Footer>
    </Layout>
  );
};

export default Register;

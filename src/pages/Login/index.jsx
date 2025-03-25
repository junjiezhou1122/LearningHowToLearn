import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Layout, Form, Input, Button, Card, message } from "antd";
import { setUser, setLoading } from "../../store/slices/userSlice";

const { Content } = Layout;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      dispatch(setLoading(true));
      // TODO: 替换为实际的API调用
      const mockUser = {
        id: 1,
        username: values.username,
        preferences: {
          topics: ["React", "JavaScript"],
          difficulty: "intermediate",
          resourceTypes: ["视频教程", "在线课程"],
        },
      };

      dispatch(setUser(mockUser));
      message.success("登录成功！");
      navigate("/");
    } catch (error) {
      message.error("登录失败，请重试");
      console.error("Login failed:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Layout>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)",
          background: "#ffffff",
          padding: "clamp(16px, 4vw, 32px)",
        }}
      >
        <Card
          title={
            <div
              style={{
                textAlign: "center",
                fontSize: "clamp(20px, 4vw, 24px)",
                color: "#1890ff",
              }}
            >
              登录
            </div>
          }
          style={{
            width: "100%",
            maxWidth: "min(400px, 90vw)",
            margin: "0 16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            borderRadius: "12px",
            animation: "fadeIn 0.5s ease-in-out, floatUp 0.7s ease-out",
          }}
          headStyle={{
            borderBottom: "1px solid #f0f0f0",
            padding: "clamp(12px, 2vw, 16px) 0",
          }}
          bodyStyle={{ padding: "clamp(16px, 3vw, 24px)" }}
        >
          <Form form={form} name="login" onFinish={onFinish} layout="vertical">
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: "请输入用户名" }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{
                  height: "48px",
                  fontSize: "16px",
                  borderRadius: "6px",
                  background: "#1890ff",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(24,144,255,0.3)",
                  transition: "all 0.3s ease",
                }}
                className="login-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes floatUp {
          from {
            transform: translateY(20px);
          }
          to {
            transform: translateY(0);
          }
        }

        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
        }
      `}</style>
    </Layout>
  );
};

export default Login;

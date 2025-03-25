import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Layout, Form, Input, Button, Card, Select, message } from "antd";
import { setUser, setPreferences } from "../../store/slices/userSlice";

const { Content } = Layout;
const { Option } = Select;

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      // TODO: 替换为实际的API调用
      const newUser = {
        id: Date.now(),
        username: values.username,
        preferences: {
          topics: values.topics,
          difficulty: values.difficulty,
          resourceTypes: values.resourceTypes,
        },
      };

      dispatch(setUser(newUser));
      dispatch(setPreferences(newUser.preferences));
      message.success("注册成功！");
      navigate("/");
    } catch (error) {
      message.error("注册失败，请重试");
      console.error("Registration failed:", error);
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
              注册
            </div>
          }
          style={{
            width: "100%",
            maxWidth: "min(600px, 90vw)",
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
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
          >
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

            <Form.Item
              name="topics"
              label="感兴趣的主题"
              rules={[{ required: true, message: "请选择感兴趣的主题" }]}
            >
              <Select
                mode="multiple"
                placeholder="请选择感兴趣的主题"
                style={{ width: "100%" }}
                maxTagCount="responsive"
                className="animated-select"
              >
                <Option value="React">React</Option>
                <Option value="JavaScript">JavaScript</Option>
                <Option value="Node.js">Node.js</Option>
                <Option value="Python">Python</Option>
                <Option value="机器学习">机器学习</Option>
                <Option value="数据分析">数据分析</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="difficulty"
              label="期望难度"
              rules={[{ required: true, message: "请选择期望难度" }]}
            >
              <Select placeholder="请选择期望难度" className="animated-select">
                <Option value="beginner">初级</Option>
                <Option value="intermediate">中级</Option>
                <Option value="advanced">高级</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="resourceTypes"
              label="资源类型偏好"
              rules={[{ required: true, message: "请选择资源类型偏好" }]}
            >
              <Select
                mode="multiple"
                placeholder="请选择资源类型偏好"
                style={{ width: "100%" }}
                maxTagCount="responsive"
                className="animated-select"
              >
                <Option value="视频教程">视频教程</Option>
                <Option value="在线课程">在线课程</Option>
                <Option value="文档教程">文档教程</Option>
                <Option value="实战项目">实战项目</Option>
              </Select>
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
                className="register-button"
              >
                注册
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

        .register-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
        }

        .animated-select .ant-select-selector {
          transition: all 0.3s ease;
        }

        .animated-select:hover .ant-select-selector {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
        }
      `}</style>
    </Layout>
  );
};

export default Register;

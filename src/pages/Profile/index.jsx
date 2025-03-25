import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Layout,
  Card,
  Typography,
  Form,
  Select,
  Button,
  Row,
  Col,
  List,
  Tag,
  message,
} from "antd";
import { setPreferences } from "../../store/slices/userSlice";

const { Title, Text } = Typography;
const { Content } = Layout;
const { Option } = Select;

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, preferences, learningHistory } = useSelector(
    (state) => state.user
  );
  const [form] = Form.useForm();

  const onFinish = (values) => {
    try {
      dispatch(setPreferences(values));
      message.success("偏好设置更新成功！");
    } catch (error) {
      message.error("更新失败，请重试");
      console.error("Update preferences failed:", error);
    }
  };

  if (!currentUser) {
    return (
      <Layout>
        <Content style={{ padding: "24px" }}>
          <Card>
            <Text>请先登录</Text>
          </Card>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Content style={{ padding: "clamp(16px, 4vw, 32px)" }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Card
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderRadius: "8px",
              }}
            >
              <Title level={2} style={{ fontSize: "clamp(20px, 4vw, 24px)" }}>
                个人信息
              </Title>
              <Text style={{ fontSize: "clamp(14px, 2vw, 16px)" }}>
                用户名：{currentUser.username}
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24}>
            <Card
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderRadius: "8px",
              }}
            >
              <Title level={2} style={{ fontSize: "clamp(20px, 4vw, 24px)" }}>
                学习偏好设置
              </Title>
              <Form
                form={form}
                initialValues={preferences}
                onFinish={onFinish}
                layout="vertical"
                style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}
              >
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
                  <Select placeholder="请选择期望难度">
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
                  >
                    <Option value="视频教程">视频教程</Option>
                    <Option value="在线课程">在线课程</Option>
                    <Option value="文档教程">文档教程</Option>
                    <Option value="实战项目">实战项目</Option>
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    更新偏好设置
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24}>
            <Card
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderRadius: "8px",
              }}
            >
              <Title level={2} style={{ fontSize: "clamp(20px, 4vw, 24px)" }}>
                学习历史
              </Title>
              <List
                dataSource={learningHistory}
                renderItem={(item) => (
                  <List.Item>
                    <Card style={{ width: "100%", margin: "8px 0" }}>
                      <Title
                        level={4}
                        style={{ fontSize: "clamp(16px, 3vw, 20px)" }}
                      >
                        {item.title}
                      </Title>
                      <Text style={{ fontSize: "clamp(14px, 2vw, 16px)" }}>
                        {item.description}
                      </Text>
                      <div style={{ marginTop: "12px" }}>
                        {item.tags.map((tag) => (
                          <Tag key={tag} style={{ margin: "4px" }}>
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Profile;

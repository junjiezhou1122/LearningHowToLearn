import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Layout, Row, Col, Card, Typography, Spin, List, Tag } from "antd";
import {
  setResources,
  setRecommendedResources,
} from "../../store/slices/resourceSlice";

const { Title } = Typography;
const { Content } = Layout;

const Home = () => {
  const dispatch = useDispatch();
  const { resources, recommendedResources, loading } = useSelector(
    (state) => state.resources
  );
  const { currentUser, preferences } = useSelector((state) => state.user);

  useEffect(() => {
    // 模拟获取资源数据
    const fetchResources = async () => {
      try {
        // TODO: 替换为实际的API调用
        const mockResources = [
          {
            id: 1,
            title: "React基础教程",
            description: "从零开始学习React框架",
            type: "视频教程",
            tags: ["React", "前端开发", "JavaScript"],
            difficulty: "beginner",
          },
          {
            id: 2,
            title: "Node.js实战指南",
            description: "深入学习Node.js后端开发",
            type: "在线课程",
            tags: ["Node.js", "后端开发", "JavaScript"],
            difficulty: "intermediate",
          },
        ];

        dispatch(setResources(mockResources));

        // 根据用户偏好生成推荐资源
        if (currentUser) {
          const recommended = mockResources.filter(
            (resource) =>
              preferences.topics.some((topic) =>
                resource.tags.includes(topic)
              ) && resource.difficulty === preferences.difficulty
          );
          dispatch(setRecommendedResources(recommended));
        }
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      }
    };

    fetchResources();
  }, [dispatch, currentUser, preferences]);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <Layout>
      <Content style={{ padding: "clamp(16px, 4vw, 32px)" }}>
        {currentUser && recommendedResources.length > 0 && (
          <div style={{ marginBottom: "clamp(24px, 6vw, 48px)" }}>
            <Title level={2} style={{ marginBottom: "clamp(16px, 4vw, 32px)" }}>
              推荐资源
            </Title>
            <Row gutter={[16, 16]} style={{ margin: 0 }}>
              {recommendedResources.map((resource) => (
                <Col key={resource.id} xs={24} sm={12} md={8} xl={6}>
                  <Card
                    hoverable
                    title={resource.title}
                    extra={<Tag color="blue">{resource.type}</Tag>}
                    style={{ height: "100%", overflow: "hidden" }}
                    headStyle={{ fontSize: "clamp(14px, 2vw, 16px)" }}
                  >
                    <p style={{ marginBottom: "16px" }}>
                      {resource.description}
                    </p>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                    >
                      {resource.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        <Title level={2} style={{ marginBottom: "clamp(16px, 4vw, 32px)" }}>
          所有资源
        </Title>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, xl: 4 }}
          dataSource={resources}
          renderItem={(resource) => (
            <List.Item>
              <Card
                hoverable
                title={resource.title}
                extra={<Tag color="blue">{resource.type}</Tag>}
                style={{ height: "100%", overflow: "hidden" }}
                headStyle={{ fontSize: "clamp(14px, 2vw, 16px)" }}
              >
                <p style={{ marginBottom: "16px" }}>{resource.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {resource.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Content>
    </Layout>
  );
};

export default Home;

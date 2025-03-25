import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Layout, Card, Typography, Tag, Button, Row, Col, message } from "antd";
import {
  setCurrentResource,
  setLoading,
} from "../../store/slices/resourceSlice";
import { addToHistory } from "../../store/slices/userSlice";

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

const ResourceDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentResource, loading } = useSelector((state) => state.resources);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchResourceDetail = async () => {
      try {
        dispatch(setLoading(true));
        // TODO: 替换为实际的API调用
        const mockResource = {
          id: parseInt(id),
          title: "React基础教程",
          description: "从零开始学习React框架",
          content: "这是一个详细的React教程，包含组件、状态管理、路由等内容...",
          type: "视频教程",
          tags: ["React", "前端开发", "JavaScript"],
          difficulty: "beginner",
          author: "John Doe",
          createTime: "2024-03-15",
          duration: "2小时30分钟",
          requirements: ["基础JavaScript知识", "HTML/CSS基础"],
          learningObjectives: [
            "理解React基本概念",
            "掌握组件开发",
            "学会状态管理",
            "实现路由导航",
          ],
        };

        dispatch(setCurrentResource(mockResource));
      } catch (error) {
        message.error("获取资源详情失败");
        console.error("Fetch resource detail failed:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchResourceDetail();
  }, [dispatch, id]);

  const handleStartLearning = () => {
    if (!currentUser) {
      message.warning("请先登录");
      return;
    }

    dispatch(addToHistory(currentResource));
    message.success("已添加到学习历史");
  };

  if (!currentResource) {
    return null;
  }

  return (
    <Layout>
      <Content style={{ padding: "24px" }}>
        <Card>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Title level={2}>{currentResource.title}</Title>
              <div style={{ marginBottom: "16px" }}>
                <Tag color="blue">{currentResource.type}</Tag>
                {currentResource.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              <Paragraph>{currentResource.description}</Paragraph>
            </Col>

            <Col span={24}>
              <Card type="inner" title="课程信息">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <Text strong>作者：</Text>
                    <Text>{currentResource.author}</Text>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Text strong>难度：</Text>
                    <Text>{currentResource.difficulty}</Text>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Text strong>时长：</Text>
                    <Text>{currentResource.duration}</Text>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={24}>
              <Card type="inner" title="课程要求">
                <ul>
                  {currentResource.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </Card>
            </Col>

            <Col span={24}>
              <Card type="inner" title="学习目标">
                <ul>
                  {currentResource.learningObjectives.map((obj, index) => (
                    <li key={index}>{obj}</li>
                  ))}
                </ul>
              </Card>
            </Col>

            <Col span={24}>
              <Card type="inner" title="课程内容">
                <Paragraph>{currentResource.content}</Paragraph>
              </Card>
            </Col>

            <Col span={24} style={{ textAlign: "center" }}>
              <Button type="primary" size="large" onClick={handleStartLearning}>
                开始学习
              </Button>
            </Col>
          </Row>
        </Card>
      </Content>
    </Layout>
  );
};

export default ResourceDetail;

import React, { useState } from "react";
import {
  Card,
  List,
  Button,
  Input,
  Modal,
  Form,
  Avatar,
  message,
  Popconfirm,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { addPost, deletePost } from "../../store/slices/forumSlice";

const { TextArea } = Input;

const Forum = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.forum);
  const { currentUser } = useSelector((state) => state.user);

  const handleCreatePost = (values) => {
    const newPost = {
      id: Date.now(), // Using timestamp as unique ID
      ...values,
      author: currentUser?.username || "Anonymous",
      time: new Date().toLocaleDateString(),
      comments: 0,
    };
    dispatch(addPost(newPost));
    setIsModalVisible(false);
    form.resetFields();
    message.success("发布成功！");
  };

  const handleDeletePost = (postId) => {
    dispatch(deletePost(postId));
    message.success("删除成功");
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "16px", textAlign: "right" }}>
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          disabled={!currentUser}
        >
          发布新帖子
        </Button>
      </div>

      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={posts}
        renderItem={(post) => (
          <List.Item>
            <Card>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar style={{ marginRight: "8px" }}>
                    {post.author[0].toUpperCase()}
                  </Avatar>
                  <div>
                    <div style={{ fontWeight: "bold" }}>{post.title}</div>
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      {post.author} · {post.time}
                    </div>
                  </div>
                </div>

                {currentUser && currentUser.username === post.author && (
                  <Popconfirm
                    title="确定要删除这个帖子吗？"
                    onConfirm={() => handleDeletePost(post.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button danger size="small">
                      删除
                    </Button>
                  </Popconfirm>
                )}
              </div>
              <div style={{ marginBottom: "12px" }}>{post.content}</div>
              <div style={{ color: "#999", fontSize: "12px" }}>
                {post.comments} 条评论
              </div>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title="发布新帖子"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreatePost}>
          <Form.Item
            name="title"
            rules={[{ required: true, message: "请输入标题" }]}
          >
            <Input placeholder="标题" />
          </Form.Item>
          <Form.Item
            name="content"
            rules={[{ required: true, message: "请输入内容" }]}
          >
            <TextArea
              placeholder="在这里输入帖子内容..."
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              发布
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Forum;

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Layout, Card, Typography, List, Tag, Modal, Form, Input, DatePicker, Select, Button, Space } from "antd";
import { addTodo, updateTodo, deleteTodo, toggleTodoStatus } from "../../store/slices/learningRecordSlice";
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import styles from "./LearningRecord.module.css";

const { Title, Text } = Typography;
const { Content } = Layout;
const { Option } = Select;

const LearningRecord = () => {
  const dispatch = useDispatch();
  const { todos } = useSelector((state) => state.learningRecord);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingTodoId, setEditingTodoId] = useState(null);

  const handleAddTodo = () => {
    setEditingTodoId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditTodo = (todo) => {
    setEditingTodoId(todo.id);
    form.setFieldsValue({
      ...todo,
      dueDate: todo.dueDate ? dayjs(todo.dueDate) : undefined,
    });
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingTodoId) {
        dispatch(updateTodo({ id: editingTodoId, updates: values }));
      } else {
        dispatch(addTodo(values));
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleDeleteTodo = (id) => {
    dispatch(deleteTodo(id));
  };

  const handleToggleTodoStatus = (id) => {
    dispatch(toggleTodoStatus(id));
  };

  const getPriorityTag = (priority) => {
    const classes = {
      high: styles.priorityHigh,
      medium: styles.priorityMedium,
      low: styles.priorityLow,
    };
    return (
      <span className={`${styles.todoPriority} ${classes[priority]}`}>
        {priority === "high" ? "高" : priority === "medium" ? "中" : "低"}
      </span>
    );
  };

  return (
    <Layout>
      <Content className={styles.container}>
        <Card
          className={styles.todoCard}
          headStyle={{ padding: 0, border: "none" }}
          title={
            <div className={styles.todoHeader}>
              <Title level={2} className={styles.todoTitle}>待办事项</Title>
            </div>
          }
          extra={
            <Button
              className={styles.addButton}
              icon={<PlusOutlined />}
              onClick={handleAddTodo}
            >
              添加待办
            </Button>
          }
        >
          <List
            className={styles.todoList}
            dataSource={todos}
            locale={{ emptyText: "暂无待办事项" }}
            renderItem={(todo) => (
              <List.Item
                className={`${styles.todoItem} ${todo.completed ? styles.completed : ""}`}
              >
                <div className={styles.todoMeta}>
                  <div>
                    <Text className={styles.todoTitle} delete={todo.completed}>
                      {todo.title}
                    </Text>
                    <div className={styles.todoDescription}>{todo.description}</div>
                    <Space style={{ marginTop: "0.5rem" }}>
                      {getPriorityTag(todo.priority)}
                      {todo.completed && <Tag color="success">已完成</Tag>}
                      {todo.dueDate && (
                        <Text type="secondary">
                          截止日期: {new Date(todo.dueDate).toLocaleDateString()}
                        </Text>
                      )}
                    </Space>
                  </div>
                </div>
                <div className={styles.todoActions}>
                  <Button
                    className={`${styles.actionButton} ${styles.completeButton}`}
                    icon={<CheckOutlined />}
                    onClick={() => handleToggleTodoStatus(todo.id)}
                  />
                  <Button
                    className={`${styles.actionButton} ${styles.editButton}`}
                    icon={<EditOutlined />}
                    onClick={() => handleEditTodo(todo)}
                  />
                  <Button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteTodo(todo.id)}
                  />
                </div>
              </List.Item>
            )}
          />
        </Card>

        <Modal
          title={editingTodoId ? "编辑待办" : "添加待办"}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          className={styles.modal}
        >
          <Form form={form} layout="vertical" className={styles.form}>
            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: "请输入待办标题" }]}
              className={styles.formItem}
            >
              <Input className={styles.input} />
            </Form.Item>
            <Form.Item name="description" label="描述" className={styles.formItem}>
              <Input.TextArea className={styles.input} />
            </Form.Item>
            <Form.Item
              name="priority"
              label="优先级"
              initialValue="medium"
              className={styles.formItem}
            >
              <Select className={styles.input}>
                <Option value="high">高</Option>
                <Option value="medium">中</Option>
                <Option value="low">低</Option>
              </Select>
            </Form.Item>
            <Form.Item name="dueDate" label="截止日期" className={styles.formItem}>
              <DatePicker className={styles.input} style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default LearningRecord;
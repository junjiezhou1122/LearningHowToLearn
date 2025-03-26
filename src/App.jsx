import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Avatar } from "antd";
import { logout } from "./store/slices/userSlice";

const { Header, Content, Sider } = Layout;

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Determine which menu item is active
  const selectedKey =
    location.pathname === "/" ? "1" :
    location.pathname === "/forum" ? "2" :
    location.pathname === "/learning-record" ? "3" : "";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(8px, 2vw, 20px)",
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          flexWrap: "wrap",
          minHeight: "64px",
          background: "#fff",
          color: "#333",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <h1
            style={{
              color: "#333",
              margin: "0 12px 0 0",
              fontSize: "calc(16px + 0.5vw)",
            }}
          >
            <Link to="/" style={{ color: "#333", textDecoration: "none" }}>
              Learning How To Learn
            </Link>
          </h1>
        </div>
        <div>
          {currentUser ? (
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Link to="/profile">
                <Avatar style={{ backgroundColor: "#1677ff" }}>
                  {currentUser.username[0].toUpperCase()}
                </Avatar>
              </Link>
              <Button onClick={handleLogout} type="primary" danger>
                退出
              </Button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "16px" }}>
              <Link to="/login" className="auth-button-link">
                <Button type="default" className="auth-button login-button">
                  登录
                </Button>
              </Link>
              <Link to="/register" className="auth-button-link">
                <Button type="default" className="auth-button register-button">
                  注册
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Header>
      <Layout style={{ marginTop: 64 }}>
        <Sider
          theme="light"
          width={200}
          style={{
            position: "fixed",
            left: 0,
            height: "calc(100vh - 64px)",
            paddingTop: "20px",
            background: "#fff",
            boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
            zIndex: 999,
          }}
        >
          <Menu
            mode="vertical"
            selectedKeys={[selectedKey]}
            style={{
              height: "100%",
              borderRight: 0,
              background: "#fff",
            }}
          >
            <Menu.Item key="1" style={menuItemStyle}>
              <Link to="/">首页</Link>
            </Menu.Item>
            <Menu.Item key="2" style={menuItemStyle}>
              <Link to="/forum">论坛</Link>
            </Menu.Item>
            <Menu.Item key="3" style={menuItemStyle}>
              <Link to="/learning-record">学习记录</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Content
            style={{
              padding: "clamp(8px, 2vw, 16px)",
              minHeight: "calc(100vh - 64px)",
              background: "#f5f5f5",
              width: "100%",
              overflowX: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "1200px",
                margin: "0 auto",
                background: "#fff",
                padding: "clamp(12px, 2vw, 24px)",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                overflowX: "auto",
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
      <style jsx="true">{`
        .ant-menu-item {
          transition: all 0.3s ease;
          margin: 8px 0;
          border-radius: 0 8px 8px 0;
        }

        .ant-menu-item:hover {
          color: #1677ff;
          background: #e6f4ff;
          transform: translateX(5px);
        }

        .ant-menu-item-selected {
          background: #e6f4ff !important;
          color: #1677ff !important;
          font-weight: 500;
          border-left: 3px solid #1677ff;
        }

        .auth-button {
          background: white;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
          border: 1px solid #eaeaea;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
          padding: 0 20px;
          height: 36px;
        }

        .login-button:hover {
          background: #f0f7ff;
          border-color: #1677ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(22, 119, 255, 0.1);
          color: #1677ff;
        }

        .register-button:hover {
          background: #f6f6f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
        }

        .auth-button-link {
          text-decoration: none;
        }
      `}</style>
    </Layout>
  );
};

// Custom styles for menu items
const menuItemStyle = {
  fontSize: "16px",
  margin: "8px 0",
  height: "48px",
  lineHeight: "48px",
};

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import RecommendationsPage from "./pages/RecommendationsPage";
import CategoriesPage from "./pages/CategoriesPage";
import BookmarksPage from "./pages/BookmarksPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./App.css";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container p-5">
          <h2>Something went wrong.</h2>
          <p>
            The application encountered an error. Please try refreshing the
            page.
          </p>
          <details style={{ whiteSpace: "pre-wrap" }}>
            <summary>Error Details</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button
            className="btn btn-primary mt-3"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App({ serverPort = 3000 }) {
  const [isServerConnected, setIsServerConnected] = useState(null);
  const [appError, setAppError] = useState(null);

  // Check if server is running when app starts
  useEffect(() => {
    const checkServer = async () => {
      try {
        // Use the detected server port from main.jsx
        console.log(`Checking server connection on port ${serverPort}...`);
        const apiUrl = `http://localhost:${serverPort}/api/test`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(apiUrl, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Server connection successful:", data);

        // Store server port in localStorage for future reference
        localStorage.setItem("serverPort", serverPort);

        setIsServerConnected(true);
      } catch (error) {
        console.error("Server connection error:", error);
        setIsServerConnected(false);
        setAppError(error.message);
      }
    };

    checkServer();

    // Add an error event listener to catch unhandled errors
    const handleError = (event) => {
      console.error("Global error caught:", event.error);
      setAppError(event.error?.message || "Unknown application error");
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, [serverPort]);

  // Show loading or error state while checking server
  if (isServerConnected === false) {
    return (
      <div
        className="server-error-container p-5 text-center"
        style={{
          margin: "2rem",
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h2>Server Connection Error</h2>
        <p>
          Unable to connect to the server. Please make sure the server is
          running at http://localhost:{serverPort}
        </p>
        <div className="alert alert-danger mt-3">
          <strong>Error details:</strong> {appError || "Connection failed"}
        </div>
        <div className="alert alert-info mt-3">
          <p>
            <strong>Troubleshooting steps:</strong>
          </p>
          <ol className="text-start">
            <li>
              Make sure your server is running with <code>npm start</code> in
              the server directory
            </li>
            <li>
              Check that port {serverPort} is available and not blocked by a
              firewall
            </li>
            <li>
              Verify your server/.env file has the correct port (PORT=5000)
            </li>
            <li>Look for any error messages in your server terminal</li>
          </ol>
        </div>
        <button
          className="btn btn-primary mt-3"
          onClick={() => window.location.reload()}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (isServerConnected === null) {
    return (
      <div className="loading p-5 text-center" style={{ margin: "2rem" }}>
        <h3>Connecting to server...</h3>
        <p>Please wait while we connect to the backend server</p>
        <div className="spinner-border text-primary mt-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Add a fallback UI in case something is wrong with MainLayout or its children
  try {
    return (
      <Router>
        <ErrorBoundary>
          <div className="app-container">
            <MainLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/recommendations"
                  element={<RecommendationsPage />}
                />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/bookmarks" element={<BookmarksPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </MainLayout>
          </div>
        </ErrorBoundary>
      </Router>
    );
  } catch (error) {
    console.error("Error rendering app:", error);
    return (
      <div
        className="fallback-error p-5 text-center"
        style={{ margin: "2rem" }}
      >
        <h2>Application Error</h2>
        <p>The application failed to render properly.</p>
        <div className="alert alert-danger">{error.message}</div>
        <button
          className="btn btn-primary mt-3"
          onClick={() => window.location.reload()}
        >
          Reload Application
        </button>
      </div>
    );
  }
}

export default App;

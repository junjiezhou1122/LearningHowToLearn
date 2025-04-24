import React from "react"; // Added missing React import
import Header from "../components/Header";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => {
  // Add error catching to avoid blank screens if rendering fails
  try {
    return (
      <div className="app">
        <Header />
        <main className="main-content">{children}</main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Error rendering MainLayout:", error);
    return (
      <div className="layout-error p-5">
        <h2>Layout Error</h2>
        <p>There was a problem rendering the page layout.</p>
        <div className="alert alert-danger">{error.message}</div>
      </div>
    );
  }
};

export default MainLayout;

import React from "react";
import { Link } from "react-router-dom";
import "./PageStyles.css";

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;

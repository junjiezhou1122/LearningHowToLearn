import React from "react";
import "./PageStyles.css";

const RecommendationsPage = () => {
  return (
    <div className="recommendations-page">
      <h1>Your Personalized Recommendations</h1>
      <p>
        Here you'll find resources tailored to your interests and learning
        history.
      </p>

      {/* Content will be added in the future */}
      <div className="placeholder-content">
        <p>Content coming soon...</p>
      </div>
    </div>
  );
};

export default RecommendationsPage;

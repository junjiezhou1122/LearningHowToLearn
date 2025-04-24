import { useState, useEffect } from "react";
import "./ResourceCard.css";

// Function to generate a random color with good contrast for white text
const getRandomColor = () => {
  // Array of good background colors (mostly darker/medium tones for white text)
  const colors = [
    "4a6cf7", // blue
    "6c5ce7", // purple
    "e84393", // pink
    "00b894", // green
    "00cec9", // teal
    "fd79a8", // light pink
    "ff7675", // salmon
    "fdcb6e", // yellow
    "e17055", // orange
    "2d3436", // dark gray
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const ResourceCard = ({ resource }) => {
  const {
    title,
    description,
    imageUrl,
    category,
    rating,
    url,
    instructors,
    site,
  } = resource;

  // Add state for the placeholder color
  const [placeholderColor, setPlaceholderColor] = useState("");
  const [imageError, setImageError] = useState(false);

  // Generate random color when component mounts
  useEffect(() => {
    setPlaceholderColor(getRandomColor());
  }, []);

  // Handle click to open course URL in new tab
  const handleCourseOpen = () => {
    if (url && url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  // Create placeholder URL with the course title as text
  const placeholderUrl = `https://placehold.co/600x400/${placeholderColor}/ffffff?text=${encodeURIComponent(title || "Course")}`;

  return (
    <div className="resource-card">
      <div className="resource-image">
        <img 
          src={imageError || !imageUrl ? placeholderUrl : imageUrl} 
          alt={title}
          onError={handleImageError}
        />
        <span className="category-tag">{category}</span>
        {site && <span className="provider-tag">{site}</span>}
      </div>
      <div className="resource-content">
        <h3>{title}</h3>
        <p className="resource-description">{description}</p>
        {instructors && (
          <p className="resource-instructor">
            <strong>Instructor:</strong> {instructors}
          </p>
        )}
        <div className="resource-footer">
          <div className="rating">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < rating ? "star filled" : "star"}>
                ★
              </span>
            ))}
          </div>
          <div className="button-group">
            <button className="btn-view" onClick={handleCourseOpen}>
              View Course
            </button>
            <button className="btn-save">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;

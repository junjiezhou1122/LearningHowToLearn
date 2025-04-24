import { useState, useEffect } from "react";
import ResourceCard from "../components/ResourceCard";
import { subscribeToNewsletter } from "../services/api";
import {
  getRealCourses,
  getUniqueCategories,
  getMainCategories,
} from "../utils/courseUtils";
import "./HomePage.css";

const HomePage = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [mainCategories, setMainCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeMainCategory, setActiveMainCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // New state for newsletter subscription
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    message: "",
    type: "", // "success" or "error"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load real course data
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        const realCourses = await getRealCourses();
        setResources(realCourses);

        // Get unique categories for filtering
        const uniqueCategories = getUniqueCategories(realCourses);
        setCategories(uniqueCategories);

        // Get main categories
        const uniqueMainCategories = getMainCategories(realCourses);
        setMainCategories(uniqueMainCategories);

        setFilteredResources(realCourses);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading course data:", error);
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Filter resources when category or main category changes
  useEffect(() => {
    if (resources.length === 0) return;

    let filtered = resources;

    // Filter by main category if selected
    if (activeMainCategory !== "All") {
      filtered = filtered.filter(
        (resource) => resource.mainCategory === activeMainCategory
      );
    }

    // Then filter by subcategory if selected
    if (activeCategory !== "All") {
      filtered = filtered.filter(
        (resource) => resource.category === activeCategory
      );
    }

    // Apply search filter if there's a search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(term) ||
          resource.description.toLowerCase().includes(term) ||
          (resource.instructors &&
            resource.instructors.toLowerCase().includes(term))
      );
    }

    setFilteredResources(filtered);
  }, [activeCategory, activeMainCategory, resources, searchTerm]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // Handle main category change
  const handleMainCategoryChange = (category) => {
    setActiveMainCategory(category);
    // Reset subcategory when main category changes
    setActiveCategory("All");
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle newsletter subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!email || !email.includes("@")) {
      setSubscriptionStatus({
        message: "Please enter a valid email address",
        type: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Submitting email:", email);
      const data = await subscribeToNewsletter(email);
      setSubscriptionStatus({
        message: data.message || "Thank you for subscribing!",
        type: "success",
      });
      setEmail(""); // Clear the input
    } catch (error) {
      console.error("Subscription error in component:", error);
      setSubscriptionStatus({
        message: error.message || "An error occurred during subscription",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Real Learning Resources</h1>
          <p>
            Explore top-rated courses from leading platforms to enhance your
            skills and advance your career.
          </p>
        </div>
        <div className="hero-image">
          <img
            src="https://placehold.co/600x400/4a6cf7/ffffff?text=Online+Courses"
            alt="Online learning resources"
          />
        </div>
      </section>

      <section className="category-section">
        <h2>Browse by Main Category</h2>
        <div className="category-tabs main-categories">
          {mainCategories.map((category) => (
            <button
              key={category}
              className={`category-tab ${
                activeMainCategory === category ? "active" : ""
              }`}
              onClick={() => handleMainCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {activeMainCategory !== "All" && (
          <>
            <h3>Subcategories</h3>
            <div className="category-tabs sub-categories">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-tab ${
                    activeCategory === category ? "active" : ""
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="resources-section">
        {isLoading ? (
          <div className="loading">Loading resources...</div>
        ) : (
          <>
            <h2>
              {searchTerm
                ? `Search Results for "${searchTerm}"`
                : activeCategory !== "All"
                ? `Courses in ${activeCategory}`
                : activeMainCategory !== "All"
                ? `All ${activeMainCategory} Courses`
                : "Featured Courses"}
              <span className="course-count">
                ({filteredResources.length} courses)
              </span>
            </h2>

            <div className="resources-grid">
              {filteredResources.length > 0 ? (
                filteredResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))
              ) : (
                <div className="no-resources">
                  No courses found. Try a different search or category.
                </div>
              )}
            </div>
          </>
        )}
      </section>

      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Stay Updated with the Latest Resources</h2>
          <p>
            Subscribe to our newsletter and get personalized recommendations
            delivered to your inbox.
          </p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {/* Display subscription status message */}
          {subscriptionStatus.message && (
            <div className={`subscription-message ${subscriptionStatus.type}`}>
              {subscriptionStatus.message}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

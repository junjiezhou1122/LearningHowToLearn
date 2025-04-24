import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ResourceCard from "../components/ResourceCard";
import { getPaginatedCourses, getCategories } from "../api/courseApi";
import "./HomePage.css";

const HomePage = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [mainCategories, setMainCategories] = useState(["All"]);
  const [subCategories, setSubCategories] = useState({});
  const [activeMainCategory, setActiveMainCategory] = useState("All");
  const [activeSubCategory, setActiveSubCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    message: "",
    type: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 100; // Increased to 100

  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL parameters on component mount and when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mainParam = params.get("main");
    const subParam = params.get("sub");

    if (mainParam) {
      setActiveMainCategory(mainParam);
      // Set subcategory only if main category exists and sub parameter is provided
      if (subParam) {
        setActiveSubCategory(subParam);
      } else {
        setActiveSubCategory("All");
      }
    }
  }, [location]);

  // Initialize categories
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const categoriesData = await getCategories();

        // Add "All" to the beginning of the main categories array
        const mainCats = ["All", ...categoriesData.mainCategories];
        setMainCategories(mainCats);

        // Store subcategories
        setSubCategories(categoriesData.subCategories || {});
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to empty arrays with "All" option
        setMainCategories(["All"]);
        setSubCategories({});
      }
    };

    fetchAllCategories();
  }, []);

  // Load courses with pagination
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        const response = await getPaginatedCourses(page, ITEMS_PER_PAGE);

        if (response.data) {
          // Paginated API response (new format)
          if (page === 1) {
            setResources(response.data);
          } else {
            setResources((prev) => [...prev, ...response.data]);
          }

          setFilteredResources((prev) => {
            if (page === 1) {
              return filterCourses(response.data);
            } else {
              return filterCourses([...prev, ...response.data]);
            }
          });

          setHasMore(page < response.totalPages);
        } else {
          // Fallback to old API format (array response)
          setResources(response);
          setFilteredResources(response);
          setHasMore(false); // No pagination available
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading course data:", error);
        setIsLoading(false);
        setHasMore(false);
      }
    };

    loadCourses();
  }, [page]);

  // Handle loading more courses
  const loadMoreData = () => {
    setLoadingMore(true);
    setPage((prevPage) => prevPage + 1);
    setLoadingMore(false);
  };

  // Helper function to filter courses based on current filters
  const filterCourses = (coursesToFilter) => {
    let filtered = coursesToFilter;

    // Filter by main category if selected
    if (activeMainCategory !== "All") {
      filtered = filtered.filter(
        (resource) => resource.category === activeMainCategory
      );

      // Further filter by subcategory if selected
      if (activeSubCategory !== "All") {
        filtered = filtered.filter(
          (resource) => resource.subCategory === activeSubCategory
        );
      }
    }

    // Apply search filter if there's a search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(term) ||
          resource.description.toLowerCase().includes(term) ||
          (resource.instructors &&
            resource.instructors.toString().toLowerCase().includes(term))
      );
    }

    return filtered;
  };

  // Filter resources when category changes
  useEffect(() => {
    if (resources.length === 0) return;
    setFilteredResources(filterCourses(resources));
  }, [activeMainCategory, activeSubCategory, searchTerm, resources]);

  // Handle main category change
  const handleMainCategoryChange = (category) => {
    setActiveMainCategory(category);
    setActiveSubCategory("All"); // Reset subcategory when main category changes

    // Update URL params
    if (category === "All") {
      navigate("/"); // Remove parameters if "All" is selected
    } else {
      navigate(`/?main=${encodeURIComponent(category)}`);
    }
  };

  // Handle subcategory change
  const handleSubCategoryChange = (subcategory) => {
    setActiveSubCategory(subcategory);

    // Update URL params
    if (subcategory === "All") {
      navigate(`/?main=${encodeURIComponent(activeMainCategory)}`);
    } else {
      navigate(
        `/?main=${encodeURIComponent(
          activeMainCategory
        )}&sub=${encodeURIComponent(subcategory)}`
      );
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle newsletter subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add actual subscription logic here
      // For now, just simulate a successful subscription
      setTimeout(() => {
        setSubscriptionStatus({
          message: "Thank you for subscribing!",
          type: "success",
        });
        setEmail("");
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      setSubscriptionStatus({
        message: "Failed to subscribe. Please try again.",
        type: "error",
      });
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
        <h2>Browse by Category</h2>

        {/* Main Categories */}
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

        {/* Subcategories - only show if a main category is selected */}
        {activeMainCategory !== "All" && subCategories[activeMainCategory] && (
          <div className="category-tabs sub-categories">
            <button
              className={`category-tab ${
                activeSubCategory === "All" ? "active" : ""
              }`}
              onClick={() => handleSubCategoryChange("All")}
            >
              All {activeMainCategory}
            </button>
            {subCategories[activeMainCategory].map((subCategory) => (
              <button
                key={subCategory}
                className={`category-tab ${
                  activeSubCategory === subCategory ? "active" : ""
                }`}
                onClick={() => handleSubCategoryChange(subCategory)}
              >
                {subCategory}
              </button>
            ))}
          </div>
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
                : activeMainCategory !== "All"
                ? activeSubCategory !== "All"
                  ? `Courses in ${activeMainCategory} > ${activeSubCategory}`
                  : `Courses in ${activeMainCategory}`
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

            {/* Add this at the bottom of your component, after the resource cards */}
            {hasMore && (
              <div className="text-center mt-6 mb-10">
                <button
                  onClick={loadMoreData}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading more..." : "Load More Courses"}
                </button>
              </div>
            )}
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

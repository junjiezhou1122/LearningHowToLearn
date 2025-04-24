import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../api/courseApi";
import "./PageStyles.css";

const CategoriesPage = () => {
  const [categories, setCategories] = useState({
    mainCategories: [],
    subCategories: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="categories-page">
      <h1>Browse Categories</h1>
      <p>Explore resources by your favorite topics and categories.</p>

      {isLoading ? (
        <div className="loading-container">
          <p>Loading categories...</p>
        </div>
      ) : (
        <div className="categories-container">
          {categories.mainCategories.length > 0 ? (
            categories.mainCategories.map((mainCategory) => (
              <div key={mainCategory} className="category-card">
                <h2>{mainCategory}</h2>

                {categories.subCategories[mainCategory] && (
                  <ul className="subcategory-list">
                    {categories.subCategories[mainCategory].map(
                      (subCategory) => (
                        <li key={subCategory}>
                          <Link
                            to={`/?main=${encodeURIComponent(
                              mainCategory
                            )}&sub=${encodeURIComponent(subCategory)}`}
                            className="subcategory-link"
                          >
                            {subCategory}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                )}

                <div className="category-footer">
                  <Link
                    to={`/?main=${encodeURIComponent(mainCategory)}`}
                    className="browse-all-link"
                  >
                    Browse all {mainCategory} courses
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-categories">
              <p>No categories found. Please check back later.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;

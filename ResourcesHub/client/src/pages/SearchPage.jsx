import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ResourceCard from "../components/ResourceCard";
import { searchCourses } from "../api/courseApi";
import "./PageStyles.css";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  // Load search results when query or page changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const results = await searchCourses(query, page);

        if (page === 1) {
          setSearchResults(results.data);
        } else {
          setSearchResults((prev) => [...prev, ...results.data]);
        }

        setTotalResults(results.totalCount);
        setTotalPages(results.totalPages);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page]);

  // Load more results
  const loadMoreResults = () => {
    if (page < totalPages) {
      setLoadingMore(true);
      setPage((prev) => prev + 1);
      setLoadingMore(false);
    }
  };

  return (
    <div className="search-page">
      <h1>Search Results</h1>
      {query ? (
        <p>
          Showing results for: <span className="search-query">"{query}"</span>
        </p>
      ) : (
        <p>Please enter a search term to see results.</p>
      )}

      {isLoading && page === 1 ? (
        <div className="loading-container">
          <p>Loading results...</p>
        </div>
      ) : (
        <>
          {searchResults.length > 0 ? (
            <>
              <div className="search-stats">
                <p>Found {totalResults} results</p>
              </div>
              <div className="resources-grid">
                {searchResults.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>

              {page < totalPages && (
                <div className="load-more-container">
                  <button
                    onClick={loadMoreResults}
                    className="load-more-button"
                    disabled={loadingMore}
                  >
                    {loadingMore ? "Loading..." : "Load More Results"}
                  </button>
                </div>
              )}
            </>
          ) : (
            query && (
              <div className="no-results">
                <p>
                  No results found for "{query}". Try a different search term.
                </p>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;

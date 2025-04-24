import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Function to check if the link is active
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      // Close mobile menu if open
      setIsMenuOpen(false);
      // Navigate to search page with query
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/">
            <h1>ResourceHub</h1>
          </Link>
        </div>

        <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <ul>
            <li>
              <Link to="/" className={isActive("/")}>
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/recommendations"
                className={isActive("/recommendations")}
              >
                Recommendations
              </Link>
            </li>
            <li>
              <Link to="/categories" className={isActive("/categories")}>
                Categories
              </Link>
            </li>
            <li>
              <Link to="/bookmarks" className={isActive("/bookmarks")}>
                Bookmarks
              </Link>
            </li>
            <li>
              <Link to="/profile" className={isActive("/profile")}>
                Profile
              </Link>
            </li>
          </ul>
        </nav>

        <form onSubmit={handleSearchSubmit} className="search-box">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div
          className="mobile-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  );
};

export default Header;

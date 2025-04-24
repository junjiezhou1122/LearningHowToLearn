import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Function to check if the link is active
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
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

        <div className="search-box">
          <input type="text" placeholder="Search resources..." />
          <button type="submit">Search</button>
        </div>

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

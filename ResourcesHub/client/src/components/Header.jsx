import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/authContext";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // shrink header on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (p) => (location.pathname === p ? "active" : "");

  const onSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setIsMenuOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput("");
    }
  };

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <span className="logo-icon">
              <i className="fas fa-book-open"></i>
            </span>
            <span className="logo-text">ResourcesHub</span>
          </Link>
          <nav className="main-nav">
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
              {user && (
                <>
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
                </>
              )}
            </ul>
          </nav>
        </div>

        <div className="header-right">
          <form onSubmit={onSearch} className="search-wrapper">
            <div className="search-input-wrapper">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search resources..."
              />
              <button type="submit">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>

          {user ? (
            <button onClick={logout} className="auth-btn logout">
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          ) : (
            <Link to="/login" className="auth-btn login">
              <i className="fas fa-user"></i>
              <span>Login</span>
            </Link>
          )}

          <button
            className={`mobile-toggle ${isMenuOpen ? "active" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <div className={`mobile-nav ${isMenuOpen ? "active" : ""}`}>
        <form onSubmit={onSearch} className="mobile-search">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search resources..."
          />
          <button type="submit">
            <i className="fas fa-search"></i>
          </button>
        </form>
        <nav>
          <ul>
            <li>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/recommendations" onClick={() => setIsMenuOpen(false)}>
                Recommendations
              </Link>
            </li>
            <li>
              <Link to="/categories" onClick={() => setIsMenuOpen(false)}>
                Categories
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link to="/bookmarks" onClick={() => setIsMenuOpen(false)}>
                    Bookmarks
                  </Link>
                </li>
                <li>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="mobile-auth"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="mobile-auth"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {isMenuOpen && (
        <div className="mobile-backdrop" onClick={() => setIsMenuOpen(false)} />
      )}
    </header>
  );
};

export default Header;

import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>ResourceHub</h3>
          <p>
            Your personalized resource recommendation system for continuous
            learning and growth.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Categories</h4>
          <ul>
            <li>
              <Link to="/categories?filter=programming">Programming</Link>
            </li>
            <li>
              <Link to="/categories?filter=design">Design</Link>
            </li>
            <li>
              <Link to="/categories?filter=business">Business</Link>
            </li>
            <li>
              <Link to="/categories?filter=education">Education</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect With Us</h4>
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              FB
            </a>
            <a href="#" aria-label="Twitter">
              TW
            </a>
            <a href="#" aria-label="Instagram">
              IG
            </a>
            <a href="#" aria-label="LinkedIn">
              IN
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} ResourceHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useEffect, useState } from "react";
import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";
import "./AuthPages.css";

const RegisterPage = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);

    // Initialize the particle animation
    const createParticles = () => {
      const container = document.querySelector(".particles-container");
      if (!container) return;

      for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";

        // Random positions and sizes
        const size = Math.random() * 6 + 3;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 4;
        const duration = Math.random() * 20 + 10;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;

        container.appendChild(particle);
      }
    };

    createParticles();
    return () => {
      const container = document.querySelector(".particles-container");
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div className={`auth-page ${loaded ? "loaded" : ""}`}>
      <div className="auth-image-side">
        <div className="particles-container"></div>

        <div className="custom-scene">
          <div className="scene-element books-stack">
            <div className="book book-1"></div>
            <div className="book book-2"></div>
            <div className="book book-3"></div>
          </div>

          <div className="scene-element laptop">
            <div className="laptop-screen">
              <div className="laptop-content">
                <div className="code-line"></div>
                <div className="code-line"></div>
                <div className="code-line"></div>
              </div>
            </div>
            <div className="laptop-base"></div>
          </div>

          <div className="floating-icons">
            <div className="icon icon-1">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div className="icon icon-2">
              <i className="fas fa-brain"></i>
            </div>
            <div className="icon icon-3">
              <i className="fas fa-lightbulb"></i>
            </div>
          </div>
        </div>

        <div className="auth-tagline">
          <h2>Join Our Learning Community</h2>
          <p>Curated resources for continuous learning</p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-container">
          <div className="auth-logo">
            <div className="logo-animation">
              <i className="fas fa-book-open"></i>
            </div>
            <span className="logo-text">ResourcesHub</span>
          </div>

          <h1>Create Account</h1>
          <p className="auth-subtitle">
            Join our community and discover curated learning resources
          </p>

          <RegisterForm />

          <div className="auth-divider">or sign up with</div>

          <div className="social-login">
            <button className="social-btn google" title="Sign up with Google">
              <i className="fab fa-google"></i>
            </button>
            <button className="social-btn github" title="Sign up with GitHub">
              <i className="fab fa-github"></i>
            </button>
            <button className="social-btn twitter" title="Sign up with Twitter">
              <i className="fab fa-twitter"></i>
            </button>
          </div>

          <div className="auth-alternate">
            <p>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

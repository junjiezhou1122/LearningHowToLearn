import { useState } from "react";
import { useAuth } from "../utils/authContext";

const RegisterForm = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { register, error } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (userData.password !== userData.confirmPassword) {
      setFormError("Passwords do not match");
      return false;
    }

    if (userData.password.length < 6) {
      setFormError("Password must be at least 6 characters long");
      return false;
    }

    if (!agreedToTerms) {
      setFormError("You must agree to the Terms & Conditions");
      return false;
    }

    setFormError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Remove confirmPassword before sending
      const { confirmPassword, ...registerData } = userData;
      await register(registerData);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const { password } = userData;
    if (!password) return { strength: 0, text: "" };

    if (password.length < 6) {
      return { strength: 1, text: "Weak", color: "#E53E3E" };
    } else if (password.length < 10) {
      return { strength: 2, text: "Medium", color: "#F6AD55" };
    } else {
      return { strength: 3, text: "Strong", color: "#38A169" };
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <>
      {formError && <div className="error-message">{formError}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
            minLength={3}
            placeholder="Choose a username"
          />
          <span className="input-icon">
            <i className="fas fa-user"></i>
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
            placeholder="yourname@example.com"
          />
          <span className="input-icon">
            <i className="fas fa-envelope"></i>
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="password">
            Password
            {userData.password && (
              <span
                style={{
                  float: "right",
                  fontSize: "0.85rem",
                  color: passwordStrength.color,
                }}
              >
                {passwordStrength.text}
              </span>
            )}
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Create a password"
          />
          <span
            className="input-icon"
            style={{ cursor: "pointer" }}
            onClick={() => setShowPassword(!showPassword)}
          >
            <i
              className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
            ></i>
          </span>

          {userData.password && (
            <div style={{ marginTop: "6px" }}>
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  marginTop: "4px",
                }}
              >
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    style={{
                      height: "4px",
                      flex: 1,
                      backgroundColor:
                        n <= passwordStrength.strength
                          ? passwordStrength.color
                          : "#E2E8F0",
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
          />
          <span className="input-icon">
            <i className="fas fa-lock"></i>
          </span>
        </div>

        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label className="remember-me">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={() => setAgreedToTerms(!agreedToTerms)}
            />
            I agree to the{" "}
            <a href="#" style={{ color: "#4a6cf7" }}>
              Terms & Conditions
            </a>
          </label>
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? (
            <>
              <i
                className="fas fa-circle-notch fa-spin"
                style={{ marginRight: "8px" }}
              ></i>
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </>
  );
};

export default RegisterForm;

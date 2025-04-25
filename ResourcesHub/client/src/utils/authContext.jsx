import { createContext, useState, useEffect, useContext } from "react";
import { loginUser, registerUser, verifyUser } from "./serverConfig";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await verifyUser();
        if (userData && userData.user) {
          setUser(userData.user);
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    setError(null);
    try {
      const response = await loginUser(credentials);
      if (response.token) {
        localStorage.setItem("authToken", response.token);
        setUser(response.user);
        return true;
      } else {
        setError(response.message || "Login failed");
        return false;
      }
    } catch (err) {
      setError("Login request failed");
      return false;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const response = await registerUser(userData);
      if (response.token) {
        localStorage.setItem("authToken", response.token);
        setUser(response.user);
        return true;
      } else {
        setError(response.message || "Registration failed");
        return false;
      }
    } catch (err) {
      setError("Registration request failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

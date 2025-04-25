/**
 * Get the current server URL based on the detected port
 * @returns {string} The server URL
 */
export const getServerUrl = () => {
  const port = window.SERVER_PORT || 5000; // Default to 5000 if not detected
  return `http://localhost:${port}`;
};

/**
 * Check if server is currently available
 * @returns {Promise<boolean>} True if server is available, false otherwise
 */
export const isServerAvailable = async () => {
  try {
    const serverUrl = getServerUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const response = await fetch(`${serverUrl}/api/test`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn("Server availability check failed:", error);
    return false;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration response
 */
export const registerUser = async (userData) => {
  const serverUrl = getServerUrl();
  const response = await fetch(`${serverUrl}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return await response.json();
};

/**
 * Login a user
 * @param {Object} credentials - User login credentials
 * @returns {Promise<Object>} Login response
 */
export const loginUser = async (credentials) => {
  const serverUrl = getServerUrl();
  const response = await fetch(`${serverUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return await response.json();
};

/**
 * Verify user token
 * @returns {Promise<Object>} User data if token is valid
 */
export const verifyUser = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  const serverUrl = getServerUrl();
  const response = await fetch(`${serverUrl}/api/auth/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    // Token is invalid, clear it
    localStorage.removeItem("authToken");
    return null;
  }

  return await response.json();
};

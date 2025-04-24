// Get the server port from window or localStorage, fallback to environment variable or default
const getServerPort = () => {
  return window.SERVER_PORT || localStorage.getItem("serverPort") || 5000; // Default to 5000 based on server .env
};

// Dynamically construct API URL based on server port
const getApiUrl = () => {
  const port = getServerPort();
  return import.meta.env.VITE_API_URL || `http://localhost:${port}/api`;
};

/**
 * Newsletter subscription service
 * @param {string} email - User's email address
 * @returns {Promise<Object>} - Response from the server
 */
export const subscribeToNewsletter = async (email) => {
  try {
    // Try the main API endpoint with better error handling
    try {
      const API_URL = getApiUrl();
      console.log(
        `Attempting to subscribe with endpoint: ${API_URL}/subscribers`
      );
      console.log(`Email being sent: ${email}`); // Log the actual email value

      const payload = JSON.stringify({ email });
      console.log(`Request payload: ${payload}`); // Log the actual payload

      const response = await fetch(`${API_URL}/subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: payload,
      });

      console.log(`Response status: ${response.status}`);
      console.log(`Response status text: ${response.statusText}`);

      // For debugging - log response headers
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log("Response headers:", headers);

      // Parse the JSON response (even for errors)
      let data;
      try {
        data = await response.json();
        console.log("Response data:", data);
      } catch (jsonError) {
        console.error("Error parsing response JSON:", jsonError);
        const text = await response.text();
        console.log("Response text:", text);
        throw new Error("Invalid response format from server");
      }

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(data.message || "Subscription failed");
      }

      return data;
    } catch (fetchError) {
      console.error("Primary endpoint error:", fetchError);

      // Only try fallback if it's a network error
      if (
        fetchError.name === "TypeError" &&
        (fetchError.message.includes("Failed to fetch") ||
          fetchError.message.includes("NetworkError"))
      ) {
        // For absolute URLs, try fallback port
        let fallbackURL = API_URL;

        if (API_URL.includes(":3000")) {
          fallbackURL = API_URL.replace(":3000", ":3001");
        } else if (API_URL === "/api") {
          // For relative URLs, try the full fallback URL
          fallbackURL = "http://localhost:3001/api";
        }

        console.log("Trying fallback endpoint:", fallbackURL);

        // Wrap in try/catch to better handle fallback errors
        try {
          const fallbackResponse = await fetch(`${fallbackURL}/subscribers`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ email }),
          });

          let fallbackData;
          try {
            fallbackData = await fallbackResponse.json();
          } catch (jsonError) {
            const text = await fallbackResponse.text();
            console.log("Fallback response text:", text);
            throw new Error("Invalid response format from fallback server");
          }

          if (!fallbackResponse.ok) {
            throw new Error(fallbackData.message || "Subscription failed");
          }

          return fallbackData;
        } catch (fallbackError) {
          console.error("Fallback endpoint error:", fallbackError);
          throw new Error(
            "Both primary and fallback endpoints failed. Please ensure the server is running."
          );
        }
      }

      // Re-throw the original error if it's not a network error
      throw fetchError;
    }
  } catch (error) {
    console.error("Subscription error:", error);
    throw new Error(
      error.message || "Network error, please check if server is running"
    );
  }
};

/**
 * Fetch all resources
 * @returns {Promise<Array>} - Array of resources
 */
export const getAllResources = async () => {
  const API_URL = getApiUrl();
  const response = await fetch(`${API_URL}/resources`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch resources");
  }

  return data;
};

/**
 * Fetch resources by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} - Array of resources
 */
export const getResourcesByCategory = async (category) => {
  const API_URL = getApiUrl();
  const response = await fetch(`${API_URL}/resources/category/${category}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Failed to fetch ${category} resources`);
  }

  return data;
};

/**
 * Save a resource (bookmark)
 * @param {string} resourceId - ID of the resource to save
 * @param {string} userId - User's ID
 * @returns {Promise<Object>} - Response from the server
 */
export const saveResource = async (resourceId, userId) => {
  const API_URL = getApiUrl();
  const response = await fetch(`${API_URL}/users/${userId}/bookmarks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resourceId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to save resource");
  }

  return data;
};

// Additional API functions can be added here as your application grows

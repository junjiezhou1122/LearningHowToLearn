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

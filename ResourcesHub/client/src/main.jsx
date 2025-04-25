import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./utils/authContext";

// Check if server is running before mounting the app
const checkServerConnection = async () => {
  // Array of ports to try in order
  const portsToTry = [5000, 3000, 50001, 5001];

  for (const port of portsToTry) {
    try {
      console.log(`Trying to connect to server on port ${port}...`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`http://localhost:${port}/api/test`, {
        signal: controller.signal,
        mode: "cors", // Explicitly set CORS mode
        headers: {
          Accept: "application/json",
        },
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        console.log(`Server connection successful on port ${port}`);
        window.SERVER_PORT = port;
        return true;
      }
    } catch (error) {
      console.warn(`Couldn't connect on port ${port}`);
    }
  }

  console.error("Failed to connect to server on any of the attempted ports");
  return false;
};

// Add error handling for root rendering
const rootElement = document.getElementById("root");

if (!rootElement) {
  // This would indicate a problem with the HTML structure
  const errorElement = document.createElement("div");
  errorElement.style.padding = "20px";
  errorElement.style.margin = "20px";
  errorElement.style.border = "1px solid red";
  errorElement.innerHTML = `
    <h2>Critical Error</h2>
    <p>Root element with id "root" not found in the document.</p>
    <p>Please check your HTML structure and make sure the root element exists.</p>
  `;
  document.body.appendChild(errorElement);
} else {
  // Before rendering, check if the server is available
  checkServerConnection().then((isConnected) => {
    if (!isConnected) {
      // Show server connection error directly
      rootElement.innerHTML = `
        <div style="padding: 40px; margin: 40px; border: 1px solid #f0ad4e; background-color: #fcf8e3; border-radius: 8px; text-align: center;">
          <h2 style="color: #8a6d3b;">Server Connection Error</h2>
          <p>Unable to connect to the server. Please make sure the server is running.</p>
          <div style="margin: 20px 0; padding: 10px; background-color: #f7f7f9; border-radius: 4px; text-align: left;">
            <code>Error: Failed to connect to server on any port</code>
          </div>
          <p>Please try one of the following solutions:</p>
          <ul style="text-align: left; display: inline-block;">
            <li>Make sure the server is running with <code>npm start</code> in the server directory</li>
            <li>Server might be running on a different port (check server console output)</li>
            <li>Current ports tried: ${portsToTry.join(", ")}</li>
            <li>Check for any firewall or network issues</li>
            <li>Restart both the client and server applications</li>
          </ul>
          <p style="margin-top: 20px;">
            <button onclick="window.location.reload()" style="padding: 10px 20px; background-color: #5bc0de; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Retry Connection
            </button>
          </p>
        </div>
      `;
    } else {
      // Render the application when server is available
      try {
        const root = createRoot(rootElement);
        root.render(
          <React.StrictMode>
            <AuthProvider>
              <App serverPort={window.SERVER_PORT || 5000} />
            </AuthProvider>
          </React.StrictMode>
        );
      } catch (error) {
        // This is a catch-all for any rendering errors
        console.error("Error rendering the application:", error);
        rootElement.innerHTML = `
          <div style="padding: 20px; margin: 20px; border: 1px solid red;">
            <h2>Application Error</h2>
            <p>The application failed to initialize properly.</p>
            <div style="padding: 10px; background-color: #ffeeee; border-radius: 4px;">
              ${error.message}
            </div>
            <p style="margin-top: 20px;">
              <button onclick="window.location.reload()">Reload Application</button>
            </p>
          </div>
        `;
      }
    }
  });
}

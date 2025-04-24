import React, { useState, useEffect } from "react";
import axios from "axios";

// Configure axios with a base URL
// This ensures all requests go to the correct server address
const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  withCredentials: true,
});

const ServerUpload = () => {
  const [file, setFile] = useState(null);
  const [serverPath, setServerPath] = useState("");
  const [uploadMethod, setUploadMethod] = useState("file");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dbStatus, setDbStatus] = useState(null);
  const [processingProgress, setProcessingProgress] = useState(null);

  useEffect(() => {
    // Check database status when component mounts
    checkDbStatus();
  }, []);

  const checkDbStatus = async () => {
    try {
      setMessage("Checking MongoDB Atlas connection...");
      // Use the configured axios instance
      const response = await api.get("/api/upload/db-status");
      setDbStatus(response.data);
      setMessage("");
    } catch (err) {
      console.error("Failed to check MongoDB Atlas status:", err);
      setDbStatus({ connectionState: "error", error: err.message });
      setError(
        `Failed to check database status: ${err.message}. Is the server running?`
      );
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleServerPathChange = (e) => {
    setServerPath(e.target.value);
  };

  const handleUploadMethodChange = (e) => {
    setUploadMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (uploadMethod === "file") {
        if (!file) {
          throw new Error("Please select a file to upload");
        }

        const formData = new FormData();
        formData.append("file", file);

        setMessage("Uploading and processing file...");
        // Use the configured axios instance
        const response = await api.post("/api/upload/bulk-upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setMessage(response.data.message);
      } else {
        if (!serverPath) {
          throw new Error("Please enter a server file path");
        }

        setMessage("Processing server file...");
        // Use the configured axios instance
        const response = await api.post("/api/upload/process-server-file", {
          filePath: serverPath,
        });

        setMessage(response.data.message);
      }

      // Refresh DB status after successful upload
      await checkDbStatus();
    } catch (err) {
      console.error("Upload failed:", err);
      setError(`Upload failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // New function to process Online_Courses.csv with a single click
  const processOnlineCourses = async () => {
    setLoading(true);
    setMessage(
      "Processing Online_Courses.csv file from the default location..."
    );
    setError("");
    setProcessingProgress("Starting...");

    try {
      // Use the configured axios instance
      const response = await api.post("/api/upload/process-online-courses");
      setMessage(response.data.message);

      // Refresh DB status after successful upload
      await checkDbStatus();
    } catch (err) {
      console.error("Processing failed:", err);
      setError(
        `Processing failed: ${err.response?.data?.error || err.message}`
      );
    } finally {
      setLoading(false);
      setProcessingProgress(null);
    }
  };

  // Add a rendering error catcher
  if (!dbStatus && error) {
    return (
      <div className="alert alert-danger m-5">
        <h4>Connection Error</h4>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={checkDbStatus}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="server-upload container mt-4">
      <h2>MongoDB Atlas Resource Upload</h2>
      <p>
        Upload resources in bulk using server-side processing with MongoDB
        Atlas.
      </p>

      {dbStatus && (
        <div className="card mb-4">
          <div className="card-header">MongoDB Atlas Status</div>
          <div className="card-body">
            <p>
              <strong>Connection Status:</strong> {dbStatus.connectionState}
            </p>
            {dbStatus.databaseInfo && (
              <>
                <p>
                  <strong>Database:</strong> {dbStatus.databaseInfo.name}
                </p>
                <div>
                  <p>
                    <strong>Collections:</strong>
                  </p>
                  <ul>
                    {dbStatus.databaseInfo.collections.map((collection) => (
                      <li key={collection}>{collection}</li>
                    ))}
                  </ul>
                </div>
                {dbStatus.databaseInfo.resourceCount !== undefined && (
                  <p>
                    <strong>Resources in Database:</strong>{" "}
                    {dbStatus.databaseInfo.resourceCount}
                  </p>
                )}
              </>
            )}
            <button onClick={checkDbStatus} className="btn btn-sm btn-info">
              Refresh Status
            </button>
          </div>
        </div>
      )}

      {/* Quick Upload for Online_Courses.csv */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          Quick Upload: Online Courses
        </div>
        <div className="card-body">
          <p>
            Process the <code>Online_Courses.csv</code> file directly from the
            default location. This option uses optimized processing specifically
            for this file format.
          </p>
          <button
            onClick={processOnlineCourses}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Processing..." : "Process Online Courses CSV"}
          </button>
          {processingProgress && (
            <div className="mt-2">
              <small className="text-muted">{processingProgress}</small>
            </div>
          )}
        </div>
      </div>

      <h3 className="mt-4">Advanced Options</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label className="form-label">Upload Method</label>
          <div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="uploadMethod"
                id="uploadMethodFile"
                value="file"
                checked={uploadMethod === "file"}
                onChange={handleUploadMethodChange}
              />
              <label className="form-check-label" htmlFor="uploadMethodFile">
                Upload CSV File
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="uploadMethod"
                id="uploadMethodServer"
                value="server"
                checked={uploadMethod === "server"}
                onChange={handleUploadMethodChange}
              />
              <label className="form-check-label" htmlFor="uploadMethodServer">
                Process CSV on Server
              </label>
            </div>
          </div>
        </div>

        {uploadMethod === "file" ? (
          <div className="mb-3">
            <label htmlFor="csvFile" className="form-label">
              CSV File
            </label>
            <input
              type="file"
              className="form-control"
              id="csvFile"
              accept=".csv"
              onChange={handleFileChange}
            />
            <div className="form-text">
              Upload a CSV file containing resource data
            </div>
          </div>
        ) : (
          <div className="mb-3">
            <label htmlFor="serverPath" className="form-label">
              Server File Path
            </label>
            <input
              type="text"
              className="form-control"
              id="serverPath"
              value={serverPath}
              onChange={handleServerPathChange}
              placeholder="/path/to/resources.csv"
            />
            <div className="form-text">
              Enter the absolute path to a CSV file on the server
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-secondary" disabled={loading}>
          {loading ? "Processing..." : "Process Resources"}
        </button>
      </form>

      {message && <div className="alert alert-success mt-3">{message}</div>}

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default ServerUpload;

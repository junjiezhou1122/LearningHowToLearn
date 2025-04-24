import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import subscriberRoutes from "./routes/subscriber.js";
import uploadRoutes from "./routes/upload.js";
import resourcesRoutes from "./routes/resources.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS properly
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// Body parser middleware - very important for parsing JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Increased limit for larger CSV files

// Request logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  // Log request body for debugging but sanitize sensitive data
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = "***";
    console.log("Request body:", sanitizedBody);
  }
  next();
});

// Routes
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/resources", resourcesRoutes);

// Test route to verify API functionality
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

// Start the server regardless of MongoDB connection status
const startServer = (port = PORT) => {
  try {
    app
      .listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
      })
      .on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          console.log(`Port ${port} is in use, trying port ${port + 1}...`);
          startServer(port + 1);
        } else {
          console.error("Server error:", err);
        }
      });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Connect to MongoDB Atlas
const connectToMongoDB = async () => {
  try {
    // Log the connection string (but hide the password){
    const connectionStringSafe = process.env.MONGODB_URI.replace(
      /mongodb(\+srv)?:\/\/[^:]+:[^@]+@/,
      "mongodb$1://***:***@"
    );
    console.log(`Connecting to MongoDB Atlas: ${connectionStringSafe}`);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      retryWrites: true,
      // Explicitly set the TLS version
      tlsCAFile: undefined, // Let MongoDB driver find the right CA file
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      heartbeatFrequencyMS: 10000, // Check server every 10 seconds
    });

    console.log("Connected to MongoDB Atlas");
    // Log collections to verify
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Available collections:",
      collections.map((c) => c.name)
    );

    // Create multiple collections for different data types
    const requiredCollections = ["subscribers", "resources"];
    for (const collectionName of requiredCollections) {
      if (!collections.find((c) => c.name === collectionName)) {
        console.log(`Creating '${collectionName}' collection...`);
        await mongoose.connection.db.createCollection(collectionName);
        console.log(`Collection '${collectionName}' created successfully`);
      }
    }
    // Make sure we have the right indexes
    const subscriberModel = mongoose.model("Subscriber");
    await subscriberModel.createIndexes();
    startServer();
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // More detailed error logging to help diagnose the issue
    if (error.name === "MongoNetworkError") {
      console.error("This appears to be a network connectivity issue.");
      console.error(
        "Please check your internet connection and firewall settings."
      );
      console.error(
        "If you're behind a corporate network, you might need to use a VPN."
      );
    }

    if (error.message && error.message.includes("authentication failed")) {
      console.error(
        "Authentication failed. Please check your username and password."
      );
    }

    if (error.message && error.message.includes("SSL")) {
      console.error(
        "SSL/TLS error. This might be due to an outdated Node.js version."
      );
      console.error("Try updating Node.js to the latest LTS version.");
    }

    console.log("Starting server without MongoDB connection");
    startServer();
  }
};

connectToMongoDB();

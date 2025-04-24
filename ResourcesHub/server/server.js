import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import subscriberRoutes from "./routes/subscriber.js";

dotenv.config();

const app = express();
const PORT = 3000; // Hard-coded port value to avoid conflicts

// Configure CORS properly
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Vite's default port
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
app.use(express.urlencoded({ extended: true }));

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

// Connect to MongoDB
const connectToMongoDB = async () => {
  try {
    // Log the connection string (but hide the password)
    const connectionStringSafe = process.env.MONGODB_URI.replace(
      /mongodb(\+srv)?:\/\/[^:]+:[^@]+@/,
      "mongodb$1://***:***@"
    );
    console.log(`Connecting to MongoDB: ${connectionStringSafe}`);

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "newsletter", // Explicitly set the database name
    });

    console.log("Connected to MongoDB - Database: newsletter");

    // Log collections to verify
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Available collections:",
      collections.map((c) => c.name)
    );

    // If subscribers collection doesn't exist, create it
    if (!collections.find((c) => c.name === "subscribers")) {
      console.log("Creating 'subscribers' collection...");
      await mongoose.connection.db.createCollection("subscribers");
      console.log("Collection 'subscribers' created successfully");
    }

    // Make sure we have the right indexes
    const subscriberModel = mongoose.model("Subscriber");
    await subscriberModel.createIndexes();

    startServer();
  } catch (error) {
    console.error("MongoDB connection error:", error);
    console.log("Starting server without MongoDB connection");
    startServer();
  }
};

connectToMongoDB();

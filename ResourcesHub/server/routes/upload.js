import express from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Resource from "../models/resource.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Ensure MongoDB Atlas connection
const ensureAtlasConnection = async (req, res, next) => {
  try {
    // Check if we need to connect to the database
    if (mongoose.connection.readyState !== 1) {
      console.log("Connecting to MongoDB Atlas...");

      // Using the MongoDB Atlas connection string from .env
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "online_courses", // Use a dedicated database for courses
        connectTimeoutMS: 30000, // Increase timeout for large operations
        socketTimeoutMS: 45000,
      });

      console.log("Connected to MongoDB Atlas - online_courses database");

      // Create resources collection if it doesn't exist
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();
      if (!collections.find((c) => c.name === "resources")) {
        console.log("Creating resources collection...");
        await mongoose.connection.db.createCollection("resources");

        // Create indexes for better performance
        await mongoose.connection.db
          .collection("resources")
          .createIndex({ title: 1 });
        await mongoose.connection.db
          .collection("resources")
          .createIndex({ url: 1 }, { unique: true });
        await mongoose.connection.db
          .collection("resources")
          .createIndex({ category: 1 });

        console.log("Resources collection created with indexes");
      }
    }
    next();
  } catch (error) {
    console.error("MongoDB Atlas connection error:", error);
    return res
      .status(500)
      .json({ error: "Database connection failed: " + error.message });
  }
};

// Apply the middleware to all routes
router.use(ensureAtlasConnection);

// Debug endpoint to check database status
router.get("/db-status", async (req, res) => {
  try {
    // Get connection state
    const connectionState = mongoose.connection.readyState;
    const stateMap = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    // Get database info if connected
    let dbInfo = null;
    if (connectionState === 1) {
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();

      // Get count of resources
      const resourceCount = await mongoose.connection.db
        .collection("resources")
        .countDocuments();

      dbInfo = {
        name: mongoose.connection.db.databaseName,
        collections: collections.map((c) => c.name),
        resourceCount,
      };
    }

    res.json({
      connectionState: stateMap[connectionState],
      databaseInfo: dbInfo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to parse Online_Courses.csv format
function parseOnlineCourse(data) {
  return {
    title: data[1] || "",
    url: data[2] || "",
    description: data[3] || "",
    category: data[4] || "",
    subCategory: data[5] || "",
    resourceType: data[6] || "",
    language: data[7] || "",
    subtitles: data[8] || "",
    tags: data[9] ? data[9].split(",").map((tag) => tag.trim()) : [],
    instructors: data[10]
      ? data[10].split(",").map((instructor) => instructor.trim())
      : [],
    rating: data[11] ? parseFloat(data[11]) : null,
    reviews: data[12] ? parseInt(data[12].replace(/,/g, "")) : null,
    duration: data[13] || "",
    provider: data[14] || "Coursera", // Default provider
  };
}

// Function to optimize resource data for storage
function createResourceObject(item, isOnlineCourseFormat = false) {
  if (isOnlineCourseFormat) {
    // Specific for Online_Courses.csv format
    return {
      title: item.title || "",
      description: item.description || "",
      url: item.url || "",
      imageUrl: item.imageUrl || "",
      category: item.category || "",
      subCategory: item.subCategory || "",
      tags: Array.isArray(item.tags)
        ? item.tags
        : typeof item.tags === "string"
        ? item.tags.split(",").map((tag) => tag.trim())
        : [],
      provider: item.provider || "Coursera",
      difficulty: item.difficulty || "",
      resourceType: item.resourceType || "Course",
      language: item.language || "English",
      instructors: Array.isArray(item.instructors)
        ? item.instructors
        : typeof item.instructors === "string"
        ? item.instructors.split(",").map((i) => i.trim())
        : [],
      rating: item.rating || null,
      reviews: item.reviews || null,
      duration: item.duration || "",
      subtitles: item.subtitles || "",
    };
  } else {
    // Generic format for other CSV files
    return {
      title: item.title || item.Title || "",
      description:
        item.description || item["Short Intro"] || item.Description || "",
      url: item.url || item.URL || "",
      imageUrl: item.imageUrl || item.Image || "",
      category: item.category || item.Category || item["Sub-Category"] || "",
      tags: item.tags
        ? typeof item.tags === "string"
          ? item.tags.split(",").map((tag) => tag.trim())
          : item.tags
        : [],
      provider: item.provider || item.Site || item.Provider || "",
      difficulty: item.difficulty || item.Level || "",
    };
  }
}

// Process a CSV file with format detection and optimized batch insertion
async function processCSVFile(filePath, res, options = {}) {
  const { isServerFile = false, isOnlineCourseFormat = false } = options;

  try {
    // Check if we're dealing with Online_Courses.csv format by filename
    const fileName = path.basename(filePath);
    const isDetectedOnlineCourseFormat =
      isOnlineCourseFormat || fileName.includes("Online_Courses");

    console.log(`Processing ${fileName} with format detection...`);
    console.log(
      `Detected format: ${
        isDetectedOnlineCourseFormat ? "Online_Courses.csv" : "Generic CSV"
      }`
    );

    // If it's Online_Courses.csv, use a specialized stream processor
    if (isDetectedOnlineCourseFormat) {
      const results = [];
      let processedCount = 0;
      let successCount = 0;
      const errors = [];

      const fileContent = fs.readFileSync(filePath, "utf8");
      const lines = fileContent.split("\n");

      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue; // Skip empty lines

        try {
          // Parse CSV line manually for Online_Courses.csv specific format
          const columns = line.split(",");

          // Ensure we have enough columns and proper data
          if (columns.length < 15) continue;

          const resource = parseOnlineCourse(columns);
          results.push(resource);
          processedCount++;

          // Process in batches of 200 for optimal performance
          if (results.length >= 200) {
            await insertResourceBatch(results, isDetectedOnlineCourseFormat);
            successCount += results.length;
            console.log(
              `Inserted batch of ${results.length} resources. Total: ${successCount}`
            );
            results.length = 0; // Clear array but keep reference
          }
        } catch (error) {
          console.error(`Error processing line ${i}: ${error.message}`);
          errors.push(`Error at line ${i}: ${error.message}`);
        }
      }

      // Insert any remaining resources
      if (results.length > 0) {
        await insertResourceBatch(results, isDetectedOnlineCourseFormat);
        successCount += results.length;
        console.log(
          `Inserted final batch of ${results.length} resources. Total: ${successCount}`
        );
      }

      if (!isServerFile) {
        fs.unlinkSync(filePath); // Clean up the uploaded file
      }

      return res.json({
        message: `Processed ${processedCount} resources, successfully inserted ${successCount} resources`,
        errors: errors.length > 0 ? errors : undefined,
      });
    } else {
      // For non-Online_Courses.csv files, use csv-parser
      const results = [];
      const errors = [];
      let processedCount = 0;

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          console.log(`Found ${results.length} resources to process`);

          // Process in batches for better performance
          const batchSize = 200;
          for (let i = 0; i < results.length; i += batchSize) {
            const batch = results.slice(i, i + batchSize);
            try {
              const resources = batch.map((item) => createResourceObject(item));

              // Skip empty resources
              const validResources = resources.filter((r) => r.title && r.url);

              if (validResources.length > 0) {
                await insertResourceBatch(validResources);
                processedCount += validResources.length;
                console.log(
                  `Inserted batch ${Math.floor(i / batchSize)}: ${
                    validResources.length
                  } resources`
                );
              }
            } catch (error) {
              console.error(
                `Error in batch ${Math.floor(i / batchSize)}:`,
                error
              );
              errors.push(
                `Error in batch ${Math.floor(i / batchSize)}: ${error.message}`
              );
            }
          }

          if (!isServerFile) {
            fs.unlinkSync(filePath); // Clean up the uploaded file
          }

          console.log(`Successfully processed ${processedCount} resources`);
          res.json({
            message: `Processed ${processedCount} resources successfully`,
            errors: errors.length > 0 ? errors : undefined,
          });
        });
    }
  } catch (error) {
    console.error("File processing error:", error);
    res.status(500).json({ error: error.message });
  }
}

// Helper function to insert resources in a batch with error handling
async function insertResourceBatch(resources, isOnlineCourseFormat = false) {
  // Format all resources
  const formattedResources = resources.map((resource) =>
    createResourceObject(resource, isOnlineCourseFormat)
  );

  // Filter out invalid resources
  const validResources = formattedResources.filter((r) => r.title && r.url);

  if (validResources.length === 0) {
    return 0;
  }

  try {
    // Use ordered: false for better performance - allows parallel inserts
    const result = await Resource.insertMany(validResources, {
      ordered: false,
      // Skip duplicate URLs
      rawResult: true,
    }).catch((err) => {
      // Handle duplicate key errors - just return valid inserted items
      if (err.code === 11000) {
        console.log(`Some duplicates found and skipped`);
        return { insertedCount: err.result?.nInserted || 0 };
      }
      throw err;
    });

    return result.insertedCount;
  } catch (error) {
    console.error("Error during batch insert:", error);
    throw error;
  }
}

// Endpoint for bulk upload from CSV
router.post("/bulk-upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(`Processing uploaded CSV file: ${req.file.path}`);

    // Process the file - determining format based on filename
    await processCSVFile(req.file.path, res, {
      isOnlineCourseFormat: req.file.originalname.includes("Online_Courses"),
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Process a CSV file already on the server
router.post("/process-server-file", async (req, res) => {
  try {
    const { filePath } = req.body;
    if (!filePath) {
      return res.status(400).json({ error: "No file path provided" });
    }

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    console.log(`Processing server file: ${filePath}`);

    // Process with server file flag
    await processCSVFile(filePath, res, {
      isServerFile: true,
      isOnlineCourseFormat: path.basename(filePath).includes("Online_Courses"),
    });
  } catch (error) {
    console.error("Server file processing error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add a new route specifically for Online_Courses.csv
router.post("/process-online-courses", async (req, res) => {
  try {
    // Default path or get from request
    let filePath =
      req.body.filePath ||
      path.join(__dirname, "../../client/src/data/Online_Courses.csv");

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: "Online_Courses.csv not found. Please specify a valid path.",
      });
    }

    console.log(`Processing Online_Courses.csv: ${filePath}`);

    // Process with specific Online_Courses format flag
    await processCSVFile(filePath, res, {
      isServerFile: true,
      isOnlineCourseFormat: true,
    });
  } catch (error) {
    console.error("Online courses processing error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

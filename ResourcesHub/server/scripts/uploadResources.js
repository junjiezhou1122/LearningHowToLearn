require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");
const Resource = require("../models/resource");

// Connect to the database
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/resourceshub")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

const uploadResources = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const results = [];

  console.log(`Reading CSV file: ${filePath}`);

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      console.log(`Found ${results.length} resources to upload`);

      try {
        // Process in batches for better performance
        const batchSize = 100;
        let processed = 0;

        for (let i = 0; i < results.length; i += batchSize) {
          const batch = results.slice(i, i + batchSize);
          const resources = batch.map((item) => ({
            title: item.title,
            description: item.description,
            url: item.url,
            imageUrl: item.imageUrl,
            category: item.category,
            tags: item.tags
              ? item.tags.split(",").map((tag) => tag.trim())
              : [],
            provider: item.provider,
            difficulty: item.difficulty,
          }));

          await Resource.insertMany(resources);
          processed += resources.length;
          console.log(`Processed ${processed}/${results.length} resources`);
        }

        console.log("Upload completed successfully!");
        mongoose.disconnect();
      } catch (error) {
        console.error("Error uploading resources:", error);
        mongoose.disconnect();
        process.exit(1);
      }
    });
};

// Get the file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error("Please provide a CSV file path");
  console.log("Usage: node uploadResources.js /path/to/resources.csv");
  process.exit(1);
}

uploadResources(filePath);

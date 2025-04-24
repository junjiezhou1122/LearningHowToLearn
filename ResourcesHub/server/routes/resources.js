import express from "express";
import path from "path";
import fs from "fs";
import csv from "csv-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Cache for storing processed data
let coursesCache = null;
let lastCacheTime = null;
let categoriesCache = null;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
const DEFAULT_PAGE_SIZE = 100; // Increased default page size

// Get all available categories (main categories only)
router.get("/categories", async (req, res) => {
  try {
    // Use cached categories if available
    if (categoriesCache) {
      return res.json(categoriesCache);
    }

    const categories = { mainCategories: [] };
    const mainCategoriesSet = new Set();

    // Read the CSV file to extract all categories
    const dataPath = path.join(
      __dirname,
      "../..",
      "client",
      "src",
      "data",
      "Online_Courses.csv"
    );

    fs.createReadStream(dataPath)
      .pipe(csv())
      .on("data", (data) => {
        if (data.Category) {
          mainCategoriesSet.add(data.Category);
        }
      })
      .on("end", () => {
        categories.mainCategories = Array.from(mainCategoriesSet).sort();

        // Update cache
        categoriesCache = categories;

        return res.json(categories);
      });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Get all courses with pagination support
router.get("/courses", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || DEFAULT_PAGE_SIZE; // 0 means no limit

    // Use cached data if available and still valid
    if (
      coursesCache &&
      lastCacheTime &&
      Date.now() - lastCacheTime < CACHE_DURATION
    ) {
      // Return paginated data if limit is specified
      if (limit > 0) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedData = coursesCache.slice(startIndex, endIndex);

        return res.json({
          totalCount: coursesCache.length,
          currentPage: page,
          totalPages: Math.ceil(coursesCache.length / limit),
          data: paginatedData,
        });
      }

      // Return all data if no pagination requested
      return res.json(coursesCache);
    }

    // If no cache or cache expired, read and process the data
    const results = [];
    const dataPath = path.join(
      __dirname,
      "../..",
      "client",
      "src",
      "data",
      "Online_Courses.csv"
    );

    fs.createReadStream(dataPath)
      .pipe(csv())
      .on("data", (data) => {
        // Process each row
        const resource = {
          title: data.Title || "",
          description: data["Short Intro"] || "",
          url: data.URL || "",
          imageUrl: data.imageUrl || "/placeholder-course.jpg", // Default image
          category: data.Category || "",
          mainCategory: data.Category?.split(",")[0]?.trim() || "Miscellaneous",
          subCategory: data["Sub-Category"] || "",
          tags: data.Skills
            ? data.Skills.split(",").map((tag) => tag.trim())
            : [],
          provider: data.Site || "Coursera",
          difficulty: data.Level || "",
          resourceType: data["Course Type"] || "Course",
          language: data.Language || "English",
          instructors: data.Instructors
            ? data.Instructors.split(",").map((i) => i.trim())
            : [],
          rating: data.Rating || null,
          reviews: data["Number of viewers"] || null,
          duration: data.Duration || "",
          subtitles: data["Subtitle Languages"] || "",
        };
        results.push(resource);
      })
      .on("end", () => {
        // Update cache
        coursesCache = results;
        lastCacheTime = Date.now();

        // Return paginated data if limit is specified
        if (limit > 0) {
          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;
          const paginatedData = results.slice(startIndex, endIndex);

          return res.json({
            totalCount: results.length,
            currentPage: page,
            totalPages: Math.ceil(results.length / limit),
            data: paginatedData,
          });
        }

        // Return all data if no pagination requested
        return res.json(results);
      });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch course data" });
  }
});

// Search courses by query with pagination
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || DEFAULT_PAGE_SIZE;

    // If no query provided, return empty results
    if (!query.trim()) {
      return res.json({
        totalCount: 0,
        currentPage: page,
        totalPages: 0,
        data: [],
      });
    }

    // Use cached data if available for searching
    if (!coursesCache || Date.now() - lastCacheTime > CACHE_DURATION) {
      // If no cache or cache expired, load the data first
      const dataPath = path.join(
        __dirname,
        "../..",
        "client",
        "src",
        "data",
        "Online_Courses.csv"
      );

      const results = [];

      // Wait for the CSV to be processed
      await new Promise((resolve, reject) => {
        fs.createReadStream(dataPath)
          .pipe(csv())
          .on("data", (data) => {
            // Process each row
            const resource = {
              id: results.length + 1, // Adding ID for each resource
              title: data.Title || "",
              description: data["Short Intro"] || "",
              url: data.URL || "",
              imageUrl: data.imageUrl || "/placeholder-course.jpg",
              category: data.Category || "",
              subCategory: data["Sub-Category"] || "",
              tags: data.Skills
                ? data.Skills.split(",").map((tag) => tag.trim())
                : [],
              provider: data.Site || "Coursera",
              difficulty: data.Level || "",
              resourceType: data["Course Type"] || "Course",
              language: data.Language || "English",
              instructors: data.Instructors
                ? data.Instructors.split(",").map((i) => i.trim())
                : [],
              rating: data.Rating || null,
              reviews: data["Number of viewers"] || null,
              duration: data.Duration || "",
              subtitles: data["Subtitle Languages"] || "",
            };
            results.push(resource);
          })
          .on("end", () => {
            // Update cache
            coursesCache = results;
            lastCacheTime = Date.now();
            resolve();
          })
          .on("error", (err) => {
            reject(err);
          });
      });
    }

    // Perform the search on the cached data
    const searchTerm = query.toLowerCase();
    const matchingCourses = coursesCache.filter(
      (course) =>
        (course.title && course.title.toLowerCase().includes(searchTerm)) ||
        (course.description &&
          course.description.toLowerCase().includes(searchTerm)) ||
        (course.instructors &&
          course.instructors.some((instructor) =>
            instructor.toLowerCase().includes(searchTerm)
          )) ||
        (course.category &&
          course.category.toLowerCase().includes(searchTerm)) ||
        (course.subCategory &&
          course.subCategory.toLowerCase().includes(searchTerm)) ||
        (course.tags &&
          course.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
    );

    // Paginate the results
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, matchingCourses.length);
    const paginatedResults = matchingCourses.slice(startIndex, endIndex);

    return res.json({
      totalCount: matchingCourses.length,
      currentPage: page,
      totalPages: Math.ceil(matchingCourses.length / limit),
      data: paginatedResults,
    });
  } catch (error) {
    console.error("Error searching courses:", error);
    res.status(500).json({ error: "Failed to search course data" });
  }
});

export default router;

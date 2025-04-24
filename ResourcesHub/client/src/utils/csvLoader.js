/**
 * Utility for directly loading CSV data when the server is unavailable
 */

// Cache to avoid multiple loads
let csvCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 3600000; // 1 hour

/**
 * Load CSV data directly from file
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<Array>} - Parsed CSV data
 */
export const loadCSVData = async (
  filePath = "/src/data/Online_Courses.csv"
) => {
  // Return cached data if available and fresh
  if (
    csvCache &&
    cacheTimestamp &&
    Date.now() - cacheTimestamp < CACHE_DURATION
  ) {
    console.log("Using cached CSV data");
    return csvCache;
  }

  try {
    console.log(`Loading CSV data from ${filePath}`);
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(
        `Failed to load CSV: ${response.status} ${response.statusText}`
      );
    }

    const text = await response.text();

    // Parse CSV text
    const rows = text.split("\n");
    const headers = rows[0].split(",").map((h) => h.trim());

    const data = [];

    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].trim()) continue; // Skip empty rows

      const values = parseCSVRow(rows[i]);
      if (values.length < headers.length) continue; // Skip malformed rows

      const entry = {};
      for (let j = 0; j < headers.length; j++) {
        entry[headers[j]] = values[j];
      }

      // Add processed record to results
      data.push(transformCourseData(entry, i));
    }

    // Cache results
    csvCache = data;
    cacheTimestamp = Date.now();
    console.log(`Successfully loaded ${data.length} courses from CSV`);

    return data;
  } catch (error) {
    console.error("Error loading CSV file:", error);
    return [];
  }
};

/**
 * Parse a CSV row accounting for quoted values with commas
 * @param {string} row - CSV row to parse
 * @returns {Array} - Array of values
 */
function parseCSVRow(row) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  // Add the last field
  result.push(current.trim());
  return result;
}

/**
 * Transform raw CSV data into structured course object
 * @param {Object} entry - Raw CSV record
 * @param {number} index - Row index for ID generation
 * @returns {Object} - Standardized course object
 */
function transformCourseData(entry, index) {
  return {
    id: entry.id || index.toString(),
    title: entry.title || entry.Title || "Unknown Title",
    url: entry.url || entry.URL || "#",
    description:
      entry.description || entry["Short Intro"] || "No description available",
    imageUrl: entry.imageUrl || entry.Image || "",
    category: entry.category || entry.Category || "Uncategorized",
    mainCategory: (entry.category || entry.Category || "Uncategorized")
      .split(",")[0]
      ?.trim(),
    subCategory: entry.subCategory || entry["Sub-Category"] || "",
    tags: parseTags(entry.tags || entry.Tags),
    provider: entry.provider || entry.Site || "Coursera",
    difficulty: entry.difficulty || entry.Level || "",
    resourceType: entry.resourceType || entry["Course Type"] || "Course",
    language: entry.language || entry.Language || "English",
    instructors: parseInstructors(entry.instructors || entry.Instructors),
    rating: entry.rating || entry.Rating || null,
    reviews: entry.reviews || entry.Reviews || null,
    duration: entry.duration || entry.Duration || "",
    subtitles: entry.subtitles || entry.Subtitles || "",
  };
}

/**
 * Parse tags string into array
 * @param {string|Array} tags - Tags string or array
 * @returns {Array} - Array of tags
 */
function parseTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") return tags.split(",").map((tag) => tag.trim());
  return [];
}

/**
 * Parse instructors string into array
 * @param {string|Array} instructors - Instructors string or array
 * @returns {Array} - Array of instructors
 */
function parseInstructors(instructors) {
  if (!instructors) return [];
  if (Array.isArray(instructors)) return instructors;
  if (typeof instructors === "string")
    return instructors.split(",").map((i) => i.trim());
  return [];
}

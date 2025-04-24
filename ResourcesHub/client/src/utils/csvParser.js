/**
 * Utility for parsing CSV files
 */

/**
 * Parse a CSV file into an array of objects
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<Array>} - Array of objects representing the CSV data
 */
export const parseCSV = async (filePath) => {
  try {
    console.log(`Loading CSV data from ${filePath}`);

    // Get the absolute path
    const csvPath = filePath.startsWith("/") ? filePath : `/${filePath}`;

    const response = await fetch(csvPath);

    if (!response.ok) {
      throw new Error(
        `Failed to load CSV: ${response.status} ${response.statusText}`
      );
    }

    const text = await response.text();

    // Parse CSV text
    const lines = text.split("\n");
    const headers = parseCSVLine(lines[0]);

    const data = [];

    // Skip header row (i=0)
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines

      const values = parseCSVLine(lines[i]);
      if (values.length < headers.length) continue; // Skip incomplete rows

      const entry = {};
      for (let j = 0; j < headers.length; j++) {
        entry[headers[j].trim()] = values[j].trim();
      }

      // Transform into course format
      data.push(transformToCourseFormat(entry, i));
    }

    console.log(`Successfully loaded ${data.length} courses from CSV`);
    return data;
  } catch (error) {
    console.error("Error parsing CSV file:", error);
    return [];
  }
};

/**
 * Parse a CSV line accounting for quoted values which may contain commas
 * @param {string} line - CSV line
 * @returns {string[]} - Array of values
 */
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  // Add the last field
  result.push(current);

  return result;
}

/**
 * Transform raw CSV data into course object format
 * @param {Object} entry - Raw CSV data
 * @param {number} index - Row index
 * @returns {Object} - Formatted course object
 */
function transformToCourseFormat(entry, index) {
  // Handle different field name variations
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

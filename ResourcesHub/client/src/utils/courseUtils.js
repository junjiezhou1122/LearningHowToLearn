import { parseCSV } from "./csvParser";

// The URL to your CSV file as an asset
const courseDataUrl = "/src/data/Online_Courses.csv";

// Cache for the parsed courses
let cachedCourses = null;

/**
 * Gets the real course data from the CSV file
 * @returns {Array} Array of course objects
 */
export const getRealCourses = async () => {
  if (cachedCourses) return cachedCourses;

  try {
    const courses = await parseCSV(courseDataUrl);

    // Process the courses to ensure they have the needed properties
    const processedCourses = courses.map((course, index) => ({
      id: course.id || index.toString(),
      title: course.Title || "Unknown Title",
      url: course.URL || "#",
      description: course["Short Intro"] || "No description available",
      mainCategory: course.Category || "Uncategorized",
      category: course["Sub-Category"] || "Uncategorized",
      type: course["Course Type"] || "Course",
      language: course.Language || "English",
      instructors: course.Instructors || "Unknown Instructor",
      rating: course.Rating || "Not rated",
      duration: course.Duration || "Duration not specified",
      platform: course.Site || "Unknown Platform",
    }));

    cachedCourses = processedCourses;
    return processedCourses;
  } catch (error) {
    console.error("Error loading course data:", error);
    return [];
  }
};

/**
 * Gets unique categories from the courses
 * @param {Array} courses - Array of course objects
 * @returns {Array} - Array of unique categories with "All" as the first option
 */
export const getUniqueCategories = (courses) => {
  const categories = new Set(courses.map((course) => course.category));
  return ["All", ...Array.from(categories)].filter(Boolean);
};

/**
 * Gets unique main categories from the courses
 * @param {Array} courses - Array of course objects
 * @returns {Array} - Array of unique main categories with "All" as the first option
 */
export const getMainCategories = (courses) => {
  const categories = new Set(courses.map((course) => course.mainCategory));
  return ["All", ...Array.from(categories)].filter(Boolean);
};

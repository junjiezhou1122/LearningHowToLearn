import { getServerUrl, isServerAvailable } from "../utils/serverConfig";
import { parseCSV } from "../utils/csvParser";

// Cache for courses
let coursesCache = null;
let cacheTimestamp = null;
let categoriesCache = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
const CSV_PATH = "/src/data/Online_Courses.csv";
const DEFAULT_PAGE_SIZE = 100; // Increased default page size

// Function to get all categories
export const getCategories = async () => {
  // Use cache if available
  if (categoriesCache) {
    return categoriesCache;
  }

  try {
    // Try to get from server if available
    const serverIsAvailable = await isServerAvailable();

    if (serverIsAvailable) {
      const serverUrl = getServerUrl();
      console.log(
        `Fetching categories from server: ${serverUrl}/api/resources/categories`
      );

      const response = await fetch(`${serverUrl}/api/resources/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      categoriesCache = data;
      return data;
    } else {
      // Server not available, extract categories from CSV
      console.log("Server unavailable, extracting categories from CSV");
      return extractCategoriesFromCSV();
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Fallback to CSV
    return extractCategoriesFromCSV();
  }
};

// Extract categories from CSV file
async function extractCategoriesFromCSV() {
  try {
    const courses = await getCoursesFromCSV();

    // Create a map to organize subcategories under main categories
    const categoryMap = new Map();

    // Filter for valid categories: English only and not too long
    courses.forEach((course) => {
      if (course.category && course.subCategory) {
        // Filter out non-English categories and categories that are too long
        const isEnglishCategory = /^[A-Za-z\s&-]+$/.test(course.category);
        const isCategoryLengthOK =
          course.category.length <= "Physical Science and Engineering".length;

        if (isEnglishCategory && isCategoryLengthOK) {
          // If the main category doesn't exist in the map yet, add it with an empty set
          if (!categoryMap.has(course.category)) {
            categoryMap.set(course.category, new Set());
          }

          // Only add English subcategories that aren't too long
          const isEnglishSubCategory = /^[A-Za-z\s&-]+$/.test(
            course.subCategory
          );
          const isSubCategoryLengthOK =
            course.subCategory.length <=
            "Physical Science and Engineering".length;

          if (isEnglishSubCategory && isSubCategoryLengthOK) {
            categoryMap.get(course.category).add(course.subCategory);
          }
        }
      }
    });

    // Convert the map to the desired format
    const mainCategories = Array.from(categoryMap.keys()).sort();
    const subCategories = {};

    for (const [mainCategory, subCategorySet] of categoryMap.entries()) {
      subCategories[mainCategory] = Array.from(subCategorySet).sort();
    }

    const categories = {
      mainCategories,
      subCategories,
    };

    categoriesCache = categories;
    return categories;
  } catch (error) {
    console.error("Error extracting categories from CSV:", error);
    return { mainCategories: [], subCategories: {} };
  }
}

// Function to get paginated courses with category and subcategory filtering
export const getPaginatedCourses = async (
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
  category = null,
  subcategory = null
) => {
  try {
    // First try to get from server if available
    const serverIsAvailable = await isServerAvailable();

    if (serverIsAvailable) {
      const serverUrl = getServerUrl();
      let url = `${serverUrl}/api/resources/courses?page=${page}&limit=${limit}`;
      
      // Add category and subcategory filters if provided
      if (category && category !== "All") {
        url += `&category=${encodeURIComponent(category)}`;
        if (subcategory && subcategory !== "All") {
          url += `&subcategory=${encodeURIComponent(subcategory)}`;
        }
      }
      
      console.log(`Fetching paginated courses from server: ${url}`);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } else {
      // Server not available, use CSV fallback
      console.log("Server unavailable, loading paginated courses from CSV");
      return getPaginatedCoursesFromCSV(page, limit, category, subcategory);
    }
  } catch (error) {
    console.error("Error fetching paginated courses:", error);
    // Always fallback to CSV if there's an error
    console.log("Using CSV fallback for paginated courses");
    return getPaginatedCoursesFromCSV(page, limit, category, subcategory);
  }
};

// Get all real courses, with caching
export const getRealCourses = async () => {
  // Use cache if available and not expired
  if (
    coursesCache &&
    cacheTimestamp &&
    Date.now() - cacheTimestamp < CACHE_DURATION
  ) {
    console.log("Using cached courses data");
    return coursesCache;
  }

  try {
    // Try to get from server if available
    const serverIsAvailable = await isServerAvailable();

    if (serverIsAvailable) {
      const serverUrl = getServerUrl();
      console.log(
        `Fetching all courses from server: ${serverUrl}/api/resources/courses`
      );

      const response = await fetch(`${serverUrl}/api/resources/courses`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache successful results
      if (data && data.length > 0) {
        coursesCache = data;
        cacheTimestamp = Date.now();
        console.log(`Successfully loaded ${data.length} courses from server`);
      } else {
        console.warn("Server returned empty courses data");
        throw new Error("Empty courses data received from server");
      }

      return data;
    } else {
      // Server not available, use CSV fallback
      console.log("Server unavailable, loading all courses from CSV");
      return getCoursesFromCSV();
    }
  } catch (error) {
    console.error("Error fetching course data from server:", error);
    // Always fallback to CSV if there's an error
    console.log("Using CSV fallback for all courses");
    return getCoursesFromCSV();
  }
};

// Get courses directly from CSV file
async function getCoursesFromCSV() {
  try {
    console.log(`Loading courses directly from CSV file: ${CSV_PATH}`);
    const courses = await parseCSV(CSV_PATH);

    if (courses && courses.length > 0) {
      // Cache the results
      coursesCache = courses;
      cacheTimestamp = Date.now();
      console.log(`Successfully loaded ${courses.length} courses from CSV`);
    } else {
      console.error("Failed to load courses from CSV or CSV file is empty");
    }

    return courses;
  } catch (error) {
    console.error("Error loading courses from CSV:", error);
    return []; // Return empty array if CSV loading fails
  }
}

// Get paginated courses from CSV with filtering
async function getPaginatedCoursesFromCSV(page = 1, limit = 20, category = null, subcategory = null) {
  try {
    const allCourses = await getCoursesFromCSV();
    
    // Apply filters if provided
    let filteredCourses = [...allCourses];
    
    // Apply category filter if provided
    if (category && category !== "All") {
      filteredCourses = filteredCourses.filter(
        course => course.category === category
      );
      
      // Apply subcategory filter if provided (and category is also provided)
      if (subcategory && subcategory !== "All") {
        filteredCourses = filteredCourses.filter(
          course => course.subCategory === subcategory
        );
      }
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredCourses.slice(startIndex, endIndex);

    return {
      totalCount: filteredCourses.length,
      currentPage: page,
      totalPages: Math.ceil(filteredCourses.length / limit),
      data: paginatedData,
    };
  } catch (error) {
    console.error("Error paginating CSV data:", error);
    return { data: [], totalCount: 0, currentPage: page, totalPages: 0 };
  }
}

// Function to search courses globally
export const searchCourses = async (query, page = 1, limit = 100) => {
  try {
    // First try to get from server if available
    const serverIsAvailable = await isServerAvailable();

    if (serverIsAvailable) {
      const serverUrl = getServerUrl();
      console.log(
        `Searching courses from server: ${serverUrl}/api/resources/search`
      );

      const response = await fetch(
        `${serverUrl}/api/resources/search?query=${encodeURIComponent(
          query
        )}&page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } else {
      // Server not available, use CSV fallback
      console.log("Server unavailable, searching courses from CSV");
      return searchCoursesFromCSV(query, page, limit);
    }
  } catch (error) {
    console.error("Error searching courses:", error);
    // Always fallback to CSV if there's an error
    console.log("Using CSV fallback for course search");
    return searchCoursesFromCSV(query, page, limit);
  }
};

// Search courses from CSV
async function searchCoursesFromCSV(query, page = 1, limit = 100) {
  try {
    const allCourses = await getCoursesFromCSV();

    // Convert query to lowercase for case-insensitive search
    const searchTerm = query.toLowerCase();

    // Filter courses that match the search term
    const matchingCourses = allCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        (course.instructors &&
          course.instructors.toString().toLowerCase().includes(searchTerm)) ||
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

    return {
      totalCount: matchingCourses.length,
      currentPage: page,
      totalPages: Math.ceil(matchingCourses.length / limit),
      data: paginatedResults,
    };
  } catch (error) {
    console.error("Error searching courses from CSV:", error);
    return {
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      data: [],
    };
  }
}

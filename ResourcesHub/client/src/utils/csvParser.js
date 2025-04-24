/**
 * Fetches and parses a CSV file
 * @param {string} url - The URL of the CSV file
 * @returns {Promise<Array>} - Array of objects representing CSV rows
 */
export const parseCSV = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status}`);
    }

    const text = await response.text();
    return parseCSVText(text);
  } catch (error) {
    console.error("Error fetching or parsing CSV:", error);
    throw error;
  }
};

/**
 * Parses CSV text into an array of objects
 * @param {string} text - The CSV text content
 * @returns {Array} - Array of objects with header keys
 */
export const parseCSVText = (text) => {
  // Split the text into lines
  const lines = text.split("\n").filter((line) => line.trim());

  // Get the headers from the first line
  const headers = lines[0].split(",").map((header) => header.trim());

  // Parse the data rows
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    // Handle commas inside quotes properly
    const values = parseCSVLine(lines[i]);

    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        // Clean potential quotes from values
        const value = values[index].replace(/^"|"$/g, "");
        row[header] = value;
      });
      data.push(row);
    }
  }

  return data;
};

/**
 * Parses a CSV line handling commas within quoted fields
 * @param {string} line - A line from the CSV file
 * @returns {Array} - Array of field values
 */
const parseCSVLine = (line) => {
  const values = [];
  let inQuotes = false;
  let currentValue = "";

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(currentValue);
      currentValue = "";
    } else {
      currentValue += char;
    }
  }

  // Add the last value
  values.push(currentValue);

  return values;
};

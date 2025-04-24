import { execSync } from "child_process";

/**
 * Utility script to find and kill processes using a specific port
 * Run with: node utils/killServer.js
 */

const PORT = process.env.PORT || 5000;

try {
  // Find process using port 5000
  console.log(`Checking for processes using port ${PORT}...`);

  // Command for macOS and Linux
  const command = `lsof -i :${PORT} | grep LISTEN | awk '{print $2}'`;

  // For Windows, you would use:
  // const command = `netstat -ano | findstr :${PORT} | findstr LISTENING`;

  const result = execSync(command, { encoding: "utf-8" });

  if (result) {
    const pids = result.trim().split("\n");

    if (pids.length > 0 && pids[0] !== "") {
      console.log(`Found ${pids.length} process(es) using port ${PORT}:`);

      pids.forEach((pid) => {
        console.log(`Killing process with PID: ${pid}`);
        try {
          // For macOS/Linux:
          execSync(`kill -9 ${pid}`);
          // For Windows:
          // execSync(`taskkill /F /PID ${pid}`);

          console.log(`Process ${pid} killed successfully.`);
        } catch (killError) {
          console.error(`Failed to kill process ${pid}:`, killError.message);
        }
      });
    } else {
      console.log(`No processes found using port ${PORT}.`);
    }
  } else {
    console.log(`No processes found using port ${PORT}.`);
  }
} catch (error) {
  if (error.status === 1) {
    console.log(`No processes found using port ${PORT}.`);
  } else {
    console.error("Error finding processes:", error.message);
  }
}

console.log("Script completed.");

import fs from "fs";
import Log from "./src/utils/Log";

interface FileInfo {
  path: string;
  updated: boolean;
  hasError: boolean;
}

const checkFiles = (dir: string): FileInfo[] => {
  let files: FileInfo[] = [];
  fs.readdirSync(dir).forEach(async (file) => {
    const filePath = `${dir}/${file}`;
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      // Check if the file has been updated in the last 24 hours
      const updated = Date.now() - stat.mtimeMs < 24 * 60 * 60 * 1000;
      // Check if the file has any errors
      let hasError = false;
      try {
        await import(filePath);
      } catch (error) {
        hasError = true;
      }
      files.push({ path: filePath, updated, hasError });
    } else if (stat.isDirectory()) {
      files = files.concat(checkFiles(filePath));
    }
  });
  return files;
};

const dir = String("./src");
const files = checkFiles(dir);
let updated = 0;
let errors = 0;
files.forEach((file) => {
  if (file.updated) {
    updated++;
  }
  if (file.hasError) {
    errors++;
  }
});

/**
 * @INFO
 * Checking the files, and logging how much errors or updated files there are.
 */

Log.success(`${updated} files have been updated`, "launcher");
Log.info(`${errors} files have errors`, "launcher");

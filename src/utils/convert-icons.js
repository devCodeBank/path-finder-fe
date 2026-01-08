import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, "src/assets/icons");
const targetDir = path.join(__dirname, "src/assets/icons-clean");

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Read all SVG files from source directory
const files = fs.readdirSync(sourceDir).filter((file) => file.endsWith(".svg"));

files.forEach((file) => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);

  // Read source file content
  let content = fs.readFileSync(sourcePath, "utf8");

  // Replace hardcoded colors with currentColor (globally)
  content = content.replace(/stroke="#[0-9A-Fa-f]+"/g, 'stroke="currentColor"');
  content = content.replace(/fill="#[0-9A-Fa-f]+"/g, 'fill="currentColor"');

  // Also handle rgb and rgba colors
  content = content.replace(/stroke="rgb\([^)]+\)"/g, 'stroke="currentColor"');
  content = content.replace(/fill="rgb\([^)]+\)"/g, 'fill="currentColor"');
  content = content.replace(/stroke="rgba\([^)]+\)"/g, 'stroke="currentColor"');
  content = content.replace(/fill="rgba\([^)]+\)"/g, 'fill="currentColor"');

  // Handle named colors too
  const namedColors = ["black", "white", "red", "green", "blue", "yellow", "gray", "grey", "purple", "orange", "brown"];
  namedColors.forEach((color) => {
    content = content.replace(new RegExp(`stroke="${color}"`, "gi"), 'stroke="currentColor"');
    content = content.replace(new RegExp(`fill="${color}"`, "gi"), 'fill="currentColor"');
  });

  // Write to target directory
  fs.writeFileSync(targetPath, content);

  console.log(`Converted ${file}`);
});

console.log("All icons converted successfully!");

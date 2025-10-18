const fs = require('fs');
const path = require('path');

function cleanMarkdownFormatting(content) {
  // Remove ** (bold markers)
  content = content.replace(/\*\*(.*?)\*\*/g, '$1');

  // Remove ### (heading markers) but keep the text
  content = content.replace(/^### /gm, '');

  return content;
}

function cleanFile(filePath) {
  console.log(`Cleaning ${filePath}...`);

  // Read the file
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Clean the markdown formatting
  const cleanedContent = cleanMarkdownFormatting(fileContent);

  // Write back to the file
  fs.writeFileSync(filePath, cleanedContent, 'utf-8');

  console.log(`✓ Cleaned ${filePath}`);
}

// Clean both blog seed files
const filesToClean = [
  path.join(__dirname, 'seed-blog-posts.ts'),
  path.join(__dirname, 'seed-blog-simple.js')
];

filesToClean.forEach(file => {
  if (fs.existsSync(file)) {
    cleanFile(file);
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log('\nAll seed files cleaned successfully!');

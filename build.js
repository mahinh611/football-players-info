const { minify } = require('html-minifier-terser');
const fs = require('fs');
const path = require('path');

const srcDir = './';
const distDir = './dist';

// Folders/files to copy as-is (no minification)
const assetFolders = [
  'blog-css',
  'experiment-css',
  'experiment-images',
  'experiment-js',
  'experiment-slides',
  'images',
  'videos'
];

const assetFiles = [
  'firebase-config.js',
  'robots.txt',
  'sitemap.xml'
];

function copyFolderSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src)) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (fs.statSync(srcPath).isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

(async () => {
  // Minify HTML files
  const htmlFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.html'));
  for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(srcDir, file), 'utf8');
    const minified = await minify(content, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true
    });
    fs.writeFileSync(path.join(distDir, file), minified);
    console.log(`Minified: ${file}`);
  }

  // Overwrite the Google verification file with the original, unminified
  const verifyFile = fs.readdirSync(srcDir).find(f => f.startsWith('google') && f.endsWith('.html'));
  if (verifyFile) {
    fs.copyFileSync(path.join(srcDir, verifyFile), path.join(distDir, verifyFile));
    console.log(`Restored original: ${verifyFile}`);
  }

  // Copy asset folders
  for (const folder of assetFolders) {
    if (fs.existsSync(folder)) {
      copyFolderSync(folder, path.join(distDir, folder));
      console.log(`Copied folder: ${folder}`);
    }
  }

  // Copy standalone asset files
  for (const file of assetFiles) {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(distDir, file));
      console.log(`Copied file: ${file}`);
    }
  }

  console.log('Build complete.');
})();
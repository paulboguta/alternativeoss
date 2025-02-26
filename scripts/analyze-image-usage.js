#!/usr/bin/env node

/**
 * Image Usage Analysis Script for AlternativeOSS
 * 
 * This script analyzes the Next.js build output to find which images
 * are being optimized and how many transformations are occurring.
 * 
 * Usage:
 *   node scripts/analyze-image-usage.js
 * 
 * Requirements:
 *   - A completed Next.js build (.next directory)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const buildDir = path.join(rootDir, '.next');

// Check if build directory exists
if (!fs.existsSync(buildDir)) {
  console.error('Build directory (.next) not found. Run "pnpm build" first.');
  process.exit(1);
}

// Image optimization patterns to look for
const patterns = {
  optimized: /"optimized":true/g,
  unoptimized: /"unoptimized":true/g,
  sizes: /"sizes":"[^"]+"/g,
  src: /"src":"[^"]+"/g,
};

// Results object
const results = {
  totalFiles: 0,
  optimizedImages: 0,
  unoptimizedImages: 0,
  imagesByDomain: {},
  sizesByRole: {},
};

/**
 * Analyzes a file for image usage
 * @param {string} filePath Path to the file
 */
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Count optimized and unoptimized images
    const optimizedMatches = content.match(patterns.optimized) || [];
    const unoptimizedMatches = content.match(patterns.unoptimized) || [];
    
    results.optimizedImages += optimizedMatches.length;
    results.unoptimizedImages += unoptimizedMatches.length;
    
    // Extract image sources
    const srcMatches = content.match(patterns.src) || [];
    srcMatches.forEach(srcMatch => {
      const src = srcMatch.replace(/"src":"([^"]+)"/, '$1');
      
      try {
        const url = new URL(src);
        const domain = url.hostname;
        
        results.imagesByDomain[domain] = (results.imagesByDomain[domain] || 0) + 1;
      } catch {
        // Not a valid URL, might be a relative path
        const domain = 'relative-path';
        results.imagesByDomain[domain] = (results.imagesByDomain[domain] || 0) + 1;
      }
    });
    
    // Extract sizes attributes
    const sizesMatches = content.match(patterns.sizes) || [];
    sizesMatches.forEach(sizesMatch => {
      const sizes = sizesMatch.replace(/"sizes":"([^"]+)"/, '$1');
      
      results.sizesByRole[sizes] = (results.sizesByRole[sizes] || 0) + 1;
    });
    
  } catch (error) {
    console.error(`Error analyzing file ${filePath}:`, error.message);
  }
}

/**
 * Recursively processes all files in a directory
 * @param {string} directory Directory to process
 */
function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      processDirectory(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.json')) {
      // Process JavaScript and JSON files
      results.totalFiles++;
      analyzeFile(filePath);
    }
  }
}

// Main execution
console.log('🔍 Analyzing image usage in Next.js build...');
processDirectory(path.join(buildDir, 'server'));
processDirectory(path.join(buildDir, 'static'));

// Print results
console.log('\n📊 Image Optimization Analysis');
console.log('============================');
console.log(`Total files analyzed: ${results.totalFiles}`);
console.log(`Optimized images: ${results.optimizedImages}`);
console.log(`Unoptimized images: ${results.unoptimizedImages}`);
console.log(`Optimization ratio: ${Math.round((results.unoptimizedImages / (results.optimizedImages + results.unoptimizedImages)) * 100)}%`);

console.log('\n📊 Images by Domain');
console.log('=================');
Object.entries(results.imagesByDomain)
  .sort((a, b) => b[1] - a[1])
  .forEach(([domain, count]) => {
    console.log(`${domain}: ${count}`);
  });

console.log('\n📊 Sizes Attributes Used');
console.log('======================');
Object.entries(results.sizesByRole)
  .sort((a, b) => b[1] - a[1])
  .forEach(([sizes, count]) => {
    console.log(`"${sizes}": ${count}`);
  });

console.log('\n✅ Analysis complete!');
console.log('For more detailed information, check the Vercel dashboard.'); 
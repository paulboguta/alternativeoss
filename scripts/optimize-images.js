#!/usr/bin/env node

/**
 * Image Optimization Script for AlternativeOSS
 * 
 * This script optimizes images locally to WebP format.
 * It prepares images for manual upload to your CDN.
 * 
 * Usage:
 *   node scripts/optimize-images.js <input-directory> <output-directory>
 * 
 * Requirements:
 *   - sharp
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get input and output directories from command line arguments
const inputDir = process.argv[2];
const outputDir = process.argv[3] || path.join(__dirname, '../optimized-images');

if (!inputDir) {
  console.error('Please provide an input directory');
  process.exit(1);
}

// Ensure the input directory exists
if (!fs.existsSync(inputDir)) {
  console.error(`Input directory ${inputDir} does not exist`);
  process.exit(1);
}

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created output directory: ${outputDir}`);
}

// Track processed images
let processedCount = 0;
let errorCount = 0;

/**
 * Optimizes an image and saves it locally
 * @param {string} filePath Path to the image file
 */
async function optimizeImage(filePath) {
  const fileName = path.basename(filePath);
  const fileNameWithoutExt = path.parse(fileName).name;
  const outputFileName = `${fileNameWithoutExt}.webp`;
  const outputPath = path.join(outputDir, outputFileName);
  
  try {
    // Optimize image with sharp
    await sharp(filePath)
      .webp({ quality: 80 })
      .resize({
        width: 1920,
        height: 1080,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toFile(outputPath);
    
    console.log(`✅ Successfully optimized: ${outputFileName}`);
    processedCount++;
  } catch (error) {
    console.error(`❌ Error processing ${fileName}:`, error);
    errorCount++;
  }
}

/**
 * Checks if a directory contains any image files
 * @param {string} directory Directory to check
 * @returns {boolean} True if directory contains images, false otherwise
 */
function directoryHasImages(directory) {
  const files = fs.readdirSync(directory);
  return files.some(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
}

/**
 * Processes all images in a directory
 * @param {string} directory Directory containing images
 */
async function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      await processDirectory(filePath);
    } else if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
      // Process image files
      await optimizeImage(filePath);
    }
  }
}

// Main execution
(async () => {
  console.log(`🔍 Processing images in ${inputDir}...`);
  
  // Check if directory has any images
  if (!directoryHasImages(inputDir) && !fs.readdirSync(inputDir).some(file => fs.statSync(path.join(inputDir, file)).isDirectory())) {
    console.log(`⚠️ No image files found in ${inputDir}. Nothing to process.`);
    console.log('Add some JPG, PNG, or GIF files to the directory and run the script again.');
    process.exit(0);
  }
  
  try {
    await processDirectory(inputDir);
    
    if (processedCount === 0) {
      console.log(`⚠️ No images were processed. Check that your images have the correct extensions (.jpg, .jpeg, .png, .gif).`);
    } else {
      console.log(`✨ Processing complete! Optimized ${processedCount} images with ${errorCount} errors.`);
      console.log(`Optimized images saved to: ${outputDir}`);
      console.log('You can now manually upload these optimized images to your CDN.');
    }
  } catch (error) {
    console.error('❌ Error processing images:', error);
    process.exit(1);
  }
})(); 
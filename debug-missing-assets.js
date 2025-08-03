// Debug script to check which cat sprites are missing
import { getAllCats } from './src/data/CatDatabase.js';
import fs from 'fs';
import path from 'path';

const cats = getAllCats();
const spritesDir = './assets/sprites';

console.log('Checking for missing cat sprites...\n');

const missingSprites = [];
const existingSprites = [];

for (const cat of cats) {
    const spritePath = path.join(spritesDir, `cat_${cat.id}.png`);
    
    if (fs.existsSync(spritePath)) {
        existingSprites.push(cat.id);
        console.log(`✓ Found: cat_${cat.id}.png`);
    } else {
        missingSprites.push(cat.id);
        console.log(`✗ Missing: cat_${cat.id}.png`);
    }
}

console.log(`\nSummary:`);
console.log(`- Total cats in database: ${cats.length}`);
console.log(`- Existing sprites: ${existingSprites.length}`);
console.log(`- Missing sprites: ${missingSprites.length}`);

if (missingSprites.length > 0) {
    console.log(`\nMissing cat sprites:`);
    missingSprites.forEach(catId => console.log(`  - cat_${catId}.png`));
    
    console.log(`\nThis could cause the game to hang during loading!`);
    console.log(`Solution: Either create these sprites or remove these cats from the database.`);
}

// Also check other required assets
const requiredAssets = [
    'food_bowl_empty.png',
    'litter_box_clean.png',
    'ui_panel.png',
    'particle_star.png',
    'particle_heart.png',
    'particle_sparkle.png',
    'icon_heart.png'
];

console.log(`\nChecking other required assets:`);
for (const asset of requiredAssets) {
    const assetPath = path.join(spritesDir, asset);
    if (fs.existsSync(assetPath)) {
        console.log(`✓ Found: ${asset}`);
    } else {
        console.log(`✗ Missing: ${asset}`);
    }
}
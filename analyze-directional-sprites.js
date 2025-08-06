const puppeteer = require('puppeteer');

(async () => {
    console.log('Analyzing sprite sheets for directional sprites...\n');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1400, height: 800 }
    });
    
    const page = await browser.newPage();
    
    await page.goto('http://localhost:8080');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Analyze sprite sheet layout for directional sprites
    const analysis = await page.evaluate(() => {
        const results = {};
        const catName = 'stinkylee';
        const spriteKey = `cat_${catName}`;
        
        if (window.game.textures.exists(spriteKey)) {
            const texture = window.game.textures.get(spriteKey);
            
            // Standard sprite sheet layout for directional sprites:
            // Row 0: Idle facing down/forward
            // Row 1: Walk facing down/forward  
            // Row 2: Walk facing left
            // Row 3: Walk facing right
            // Row 4: Walk facing up/back
            // Row 5: Idle variations
            // Row 6: Sleep/lying down
            // Row 7: Sitting
            
            results[catName] = {
                totalFrames: texture.frameTotal,
                rows: Math.floor(texture.source[0].height / 30),
                cols: Math.floor(texture.source[0].width / 32),
                probableLayout: {
                    row0: 'Idle facing down (frames 0-7)',
                    row1: 'Walk facing down (frames 32-39)',
                    row2: 'Walk facing left (frames 64-71)',
                    row3: 'Walk facing right (frames 96-103)',
                    row4: 'Walk facing up (frames 128-135)',
                    row5: 'Idle variations (frames 160-167)',
                    row6: 'Sleep/lying (frames 192-199)',
                    row7: 'Sitting (frames 224-231)'
                }
            };
        }
        
        return results;
    });
    
    console.log('=== SPRITE SHEET DIRECTIONAL ANALYSIS ===\n');
    
    Object.entries(analysis).forEach(([catName, data]) => {
        console.log(`${catName.toUpperCase()}:`);
        console.log(`  Total frames: ${data.totalFrames}`);
        console.log(`  Grid: ${data.rows} rows x ${data.cols} columns`);
        console.log('\n  Probable directional layout:');
        Object.entries(data.probableLayout).forEach(([row, desc]) => {
            console.log(`    ${row}: ${desc}`);
        });
    });
    
    console.log('\n=== RECOMMENDED DIRECTIONAL ANIMATIONS ===');
    console.log('walk_down: frames 32-39 (row 1)');
    console.log('walk_left: frames 64-71 (row 2)');
    console.log('walk_right: frames 96-103 (row 3)');
    console.log('walk_up: frames 128-135 (row 4)');
    console.log('idle_down: frames 2-5 (row 0, skip first 2)');
    console.log('idle_up: frames 130-133 (row 4, cols 2-5)');
    
    await browser.close();
})();
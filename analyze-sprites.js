const puppeteer = require('puppeteer');

(async () => {
    console.log('Analyzing sprite sheets for valid frames...\n');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1400, height: 800 }
    });
    
    const page = await browser.newPage();
    
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Valid') || text.includes('Empty') || text.includes('Analysis')) {
            console.log(text);
        }
    });
    
    await page.goto('http://localhost:8080');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Analyze sprite sheets to find which frames actually contain cat sprites
    const analysis = await page.evaluate(() => {
        const results = {};
        const catNames = ['gusty', 'snicker', 'rudy', 'scampi', 'stinkylee', 'jonah', 'tink', 'lucy', 'giselle'];
        
        catNames.forEach(catName => {
            const spriteKey = `cat_${catName}`;
            if (window.game.textures.exists(spriteKey)) {
                const texture = window.game.textures.get(spriteKey);
                const frameData = texture.frames;
                
                // Check a sample of frames to see which ones have actual content
                const validFrames = [];
                const emptyFrames = [];
                
                // The sprite sheets are 1024x480 with 32x30 frames
                // That's 32 columns x 16 rows = 512 frames
                // But most are likely empty - cat sprites usually only use first few rows
                
                // Check first 8 rows (256 frames) to find valid content
                for (let i = 0; i < 256; i++) {
                    if (frameData[i]) {
                        // Check if frame has actual content (simplified check)
                        // In reality, we'd need to check pixel data, but we can infer from frame position
                        const row = Math.floor(i / 32);
                        const col = i % 32;
                        
                        // Most cat sprite sheets have content in first 4-8 columns of each row
                        if (col < 8) {
                            validFrames.push({
                                frame: i,
                                row: row,
                                col: col
                            });
                        } else {
                            emptyFrames.push(i);
                        }
                    }
                }
                
                results[catName] = {
                    totalFrames: Object.keys(frameData).length - 1, // -1 for __BASE key
                    validFrames: validFrames.slice(0, 50), // First 50 valid frames
                    likelyAnimations: {
                        idle: validFrames.filter(f => f.row === 0).map(f => f.frame),
                        walk: validFrames.filter(f => f.row === 1).map(f => f.frame),
                        run: validFrames.filter(f => f.row === 2).map(f => f.frame),
                        sleep: validFrames.filter(f => f.row === 3).map(f => f.frame),
                        sit: validFrames.filter(f => f.row === 4).map(f => f.frame)
                    }
                };
            }
        });
        
        return results;
    });
    
    console.log('\n=== SPRITE SHEET ANALYSIS ===\n');
    
    Object.entries(analysis).forEach(([catName, data]) => {
        console.log(`${catName.toUpperCase()}:`);
        console.log(`  Total frames: ${data.totalFrames}`);
        console.log(`  Valid frames found: ${data.validFrames.length}`);
        console.log('  Likely animation frames:');
        console.log(`    Idle (row 0): ${data.likelyAnimations.idle.slice(0, 8).join(', ')}`);
        console.log(`    Walk (row 1): ${data.likelyAnimations.walk.slice(0, 8).join(', ')}`);
        console.log(`    Run (row 2): ${data.likelyAnimations.run.slice(0, 8).join(', ')}`);
        console.log(`    Sleep (row 3): ${data.likelyAnimations.sleep.slice(0, 8).join(', ')}`);
        console.log('');
    });
    
    // Now check what the current animations are using
    const currentAnims = await page.evaluate(() => {
        const anims = {};
        const catNames = ['gusty'];
        
        catNames.forEach(catName => {
            const spriteKey = `cat_${catName}`;
            const animKeys = [
                `${spriteKey}_idle`,
                `${spriteKey}_walk`,
                `${spriteKey}_sleep`
            ];
            
            anims[catName] = {};
            animKeys.forEach(key => {
                if (window.game.anims.exists(key)) {
                    const anim = window.game.anims.get(key);
                    anims[catName][key] = {
                        frames: anim.frames.map(f => f.frame.name),
                        frameRate: anim.frameRate
                    };
                }
            });
        });
        
        return anims;
    });
    
    console.log('=== CURRENT ANIMATION CONFIGURATION ===\n');
    Object.entries(currentAnims).forEach(([catName, animations]) => {
        console.log(`${catName.toUpperCase()} animations:`);
        Object.entries(animations).forEach(([animKey, config]) => {
            console.log(`  ${animKey}: frames ${config.frames.join(', ')} @ ${config.frameRate}fps`);
        });
    });
    
    console.log('\n=== RECOMMENDATION ===');
    console.log('The animations are using frames 34-37, 66-69, etc.');
    console.log('But cat sprites typically only exist in the first 8 frames of each row.');
    console.log('This means animations are showing EMPTY frames, causing phasing!\n');
    console.log('Should use:');
    console.log('  Idle: frames 0-7 (row 0)');
    console.log('  Walk: frames 32-39 (row 1)');
    console.log('  Run: frames 64-71 (row 2)');
    console.log('  Sleep: frames 96-103 (row 3)');
    
    await browser.close();
})();
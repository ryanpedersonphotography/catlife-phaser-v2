const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    console.log('🔍 Debugging Cat Animation Rows with Puppeteer\n');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1400, height: 900 },
        devtools: true
    });
    
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
        if (msg.type() === 'log') {
            console.log('PAGE LOG:', msg.text());
        }
    });
    
    page.on('error', err => {
        console.error('PAGE ERROR:', err);
    });
    
    // Go to the walk-up demo page
    console.log('Loading walk-up demo page...');
    await page.goto('http://localhost:8080/walk-up-demo.html');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test each row and capture screenshots
    const rowsToTest = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    
    for (const row of rowsToTest) {
        console.log(`\n📸 Testing Row ${row} (frames ${row * 32}-${row * 32 + 7})...`);
        
        // Click the button for this row (if it exists)
        try {
            // Try to find and click a button for this row
            const buttonClicked = await page.evaluate((rowNum) => {
                // First check if there's a specific button
                const buttons = document.querySelectorAll('button');
                for (const btn of buttons) {
                    if (btn.textContent.includes(`Row ${rowNum}`)) {
                        btn.click();
                        return true;
                    }
                }
                
                // Otherwise call testRow directly if function exists
                if (typeof testRow === 'function') {
                    testRow(rowNum);
                    return true;
                }
                return false;
            }, row);
            
            if (!buttonClicked) {
                // Manually trigger the row change
                await page.evaluate((rowNum) => {
                    if (window.scene) {
                        window.scene.createAnimation(rowNum);
                        window.currentCat.play('test_walk_up');
                        window.scene.displayFrameRow(rowNum);
                    }
                }, row);
            }
            
            // Wait for animation to load
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Take screenshot
            await page.screenshot({ 
                path: `debug-row-${row}.png`,
                clip: {
                    x: 0,
                    y: 0,
                    width: 800,
                    height: 600
                }
            });
            
            // Get animation info from the page
            const animInfo = await page.evaluate(() => {
                if (window.currentCat && window.currentCat.anims.currentAnim) {
                    const anim = window.currentCat.anims.currentAnim;
                    const frame = window.currentCat.anims.currentFrame;
                    return {
                        key: anim.key,
                        frameCount: anim.frames.length,
                        currentFrame: frame ? frame.textureFrame : 'N/A',
                        isPlaying: window.currentCat.anims.isPlaying
                    };
                }
                return null;
            });
            
            if (animInfo) {
                console.log(`  ✓ Animation: ${animInfo.key}`);
                console.log(`  ✓ Frames: ${animInfo.frameCount}`);
                console.log(`  ✓ Current frame: ${animInfo.currentFrame}`);
                console.log(`  ✓ Playing: ${animInfo.isPlaying}`);
            }
            
        } catch (error) {
            console.error(`  ✗ Error testing row ${row}:`, error.message);
        }
    }
    
    // Now test the main animation demo
    console.log('\n📸 Testing main animation demo page...');
    await page.goto('http://localhost:8080/animation-demo.html');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test walk_up animation
    await page.evaluate(() => {
        if (typeof playAnimation === 'function') {
            playAnimation('walk_up');
        }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Capture what's currently showing
    await page.screenshot({ 
        path: 'debug-main-walk-up.png',
        fullPage: false
    });
    
    // Get detailed sprite info
    const spriteInfo = await page.evaluate(() => {
        if (window.cat) {
            const bounds = window.cat.getBounds();
            const texture = window.cat.texture;
            const frame = window.cat.frame;
            
            return {
                x: window.cat.x,
                y: window.cat.y,
                scaleX: window.cat.scaleX,
                scaleY: window.cat.scaleY,
                width: window.cat.width,
                height: window.cat.height,
                displayWidth: window.cat.displayWidth,
                displayHeight: window.cat.displayHeight,
                textureKey: texture ? texture.key : 'N/A',
                frameWidth: frame ? frame.width : 'N/A',
                frameHeight: frame ? frame.height : 'N/A',
                frameName: frame ? frame.name : 'N/A',
                visible: window.cat.visible
            };
        }
        return null;
    });
    
    console.log('\n📊 Sprite Analysis:');
    if (spriteInfo) {
        console.log('Position:', spriteInfo.x, spriteInfo.y);
        console.log('Scale:', spriteInfo.scaleX, spriteInfo.scaleY);
        console.log('Size:', spriteInfo.width, 'x', spriteInfo.height);
        console.log('Display Size:', spriteInfo.displayWidth, 'x', spriteInfo.displayHeight);
        console.log('Frame:', spriteInfo.frameName, `(${spriteInfo.frameWidth}x${spriteInfo.frameHeight})`);
        console.log('Visible:', spriteInfo.visible);
    }
    
    // Check the actual sprite sheet to understand the layout
    console.log('\n📊 Analyzing sprite sheet structure...');
    const spriteSheetInfo = await page.evaluate(() => {
        const texture = window.game?.textures?.get('cat_stinkylee');
        if (texture) {
            const source = texture.source[0];
            const frames = texture.frames;
            
            // Check specific rows to see what content they have
            const rowAnalysis = {};
            for (let row = 0; row < 16; row++) {
                const frameIndex = row * 32; // First frame of each row
                const frame = texture.get(frameIndex);
                if (frame) {
                    rowAnalysis[`row_${row}`] = {
                        startFrame: frameIndex,
                        endFrame: frameIndex + 7,
                        exists: true,
                        width: frame.width,
                        height: frame.height
                    };
                }
            }
            
            return {
                totalFrames: texture.frameTotal,
                sourceWidth: source.width,
                sourceHeight: source.height,
                rowAnalysis: rowAnalysis
            };
        }
        return null;
    });
    
    if (spriteSheetInfo) {
        console.log('Sprite Sheet:', spriteSheetInfo.sourceWidth, 'x', spriteSheetInfo.sourceHeight);
        console.log('Total Frames:', spriteSheetInfo.totalFrames);
        console.log('\nRow Analysis:');
        Object.entries(spriteSheetInfo.rowAnalysis).forEach(([row, info]) => {
            console.log(`  ${row}: frames ${info.startFrame}-${info.endFrame} (${info.width}x${info.height})`);
        });
    }
    
    console.log('\n✅ Debug complete! Check the generated PNG files:');
    console.log('  - debug-row-*.png: Screenshots of each row');
    console.log('  - debug-main-walk-up.png: Current walk_up animation');
    
    await browser.close();
})();
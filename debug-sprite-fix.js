const puppeteer = require('puppeteer');
const http = require('http');
const path = require('path');
const fs = require('fs');

async function debugAndFix() {
    // Start HTTP server
    const server = http.createServer((req, res) => {
        let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url);
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
                return;
            }
            
            const ext = path.extname(filePath);
            const contentType = {
                '.html': 'text/html',
                '.js': 'text/javascript',
                '.css': 'text/css',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.svg': 'image/svg+xml'
            }[ext] || 'text/plain';
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });

    await new Promise(resolve => server.listen(8083, resolve));
    console.log('Server running on http://localhost:8083');

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });

    const page = await browser.newPage();
    
    // Listen to console logs
    page.on('console', msg => {
        console.log('Browser Console:', msg.text());
    });

    await page.goto('http://localhost:8083');
    
    // Wait for game to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check sprite display
    const spriteInfo = await page.evaluate(() => {
        const game = window.game;
        if (!game) return { error: 'No game instance' };
        
        const scene = game.scene.getScene('GameScene');
        if (!scene) return { error: 'No GameScene' };
        
        const info = {
            cats: [],
            textures: {}
        };
        
        // Check each cat
        if (scene.cats) {
            scene.cats.forEach(cat => {
                const catInfo = {
                    name: cat.data.name,
                    sprite: null,
                    texture: null,
                    frame: null
                };
                
                if (cat.sprite) {
                    catInfo.sprite = {
                        type: cat.sprite.constructor.name,
                        textureKey: cat.sprite.texture.key,
                        frameName: cat.sprite.frame.name,
                        frameWidth: cat.sprite.frame.width,
                        frameHeight: cat.sprite.frame.height,
                        displayWidth: cat.sprite.displayWidth,
                        displayHeight: cat.sprite.displayHeight,
                        scaleX: cat.sprite.scaleX,
                        scaleY: cat.sprite.scaleY,
                        x: cat.sprite.x,
                        y: cat.sprite.y
                    };
                    
                    // Check texture info
                    const texture = cat.sprite.texture;
                    if (texture && !info.textures[texture.key]) {
                        info.textures[texture.key] = {
                            key: texture.key,
                            width: texture.source[0].width,
                            height: texture.source[0].height,
                            frameTotal: texture.frameTotal
                        };
                    }
                }
                
                info.cats.push(catInfo);
            });
        }
        
        return info;
    });
    
    console.log('\n=== SPRITE INFO ===');
    console.log(JSON.stringify(spriteInfo, null, 2));
    
    // Take screenshot
    await page.screenshot({ path: 'debug-current-state.png' });
    
    // Now try to fix the issue
    console.log('\n=== ATTEMPTING FIX ===');
    
    // Check if sprites are showing full texture instead of single frame
    const needsFix = await page.evaluate(() => {
        const game = window.game;
        const scene = game.scene.getScene('GameScene');
        
        let fixed = false;
        scene.cats.forEach(cat => {
            if (cat.sprite && cat.sprite.displayWidth > 100) {
                // Sprite is too wide - showing multiple frames
                console.log(`Fixing ${cat.data.name}: display width is ${cat.sprite.displayWidth}`);
                
                // Force sprite to show only first frame
                cat.sprite.setFrame(0);
                cat.sprite.setSize(64, 60);
                cat.sprite.setDisplaySize(64 * 1.5, 60 * 1.5);
                fixed = true;
            }
        });
        
        return fixed;
    });
    
    if (needsFix) {
        console.log('Applied runtime fix to sprites');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await page.screenshot({ path: 'debug-after-fix.png' });
    }
    
    // Check the actual sprite rendering
    const canvasData = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        
        // Get a small sample of the canvas where cats should be
        const imageData = ctx.getImageData(0, 0, 200, 200);
        return {
            width: canvas.width,
            height: canvas.height,
            sample: Array.from(imageData.data.slice(0, 100))
        };
    });
    
    console.log('\nCanvas dimensions:', canvasData.width, 'x', canvasData.height);
    
    // Close browser
    await browser.close();
    server.close();
    
    console.log('\nDebug complete. Check debug-current-state.png and debug-after-fix.png');
}

debugAndFix().catch(console.error);
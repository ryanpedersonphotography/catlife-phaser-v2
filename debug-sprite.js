const puppeteer = require('puppeteer');
const http = require('http');
const path = require('path');
const fs = require('fs');

async function debugSprite() {
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

    await new Promise(resolve => server.listen(8082, resolve));
    console.log('Server running on http://localhost:8082');

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });

    const page = await browser.newPage();
    
    // Listen to console logs
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Cat') || text.includes('sprite') || text.includes('texture') || text.includes('frame')) {
            console.log('Browser Console:', text);
        }
    });

    await page.goto('http://localhost:8082');
    
    // Wait for game to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take screenshot
    await page.screenshot({ path: 'debug-sprite-test.png' });
    console.log('Screenshot saved to debug-sprite-test.png');
    
    // Get canvas info
    const canvasInfo = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return { error: 'No canvas found' };
        
        const game = window.game;
        if (!game) return { error: 'No game instance found' };
        
        const scene = game.scene.getScene('GameScene');
        if (!scene) return { error: 'GameScene not found' };
        
        const catInfo = [];
        if (scene.cats && scene.cats.length > 0) {
            scene.cats.forEach(cat => {
                const spriteInfo = {
                    name: cat.data.name,
                    x: cat.x,
                    y: cat.y,
                    visible: cat.visible,
                    spriteExists: !!cat.sprite,
                    spriteTexture: cat.sprite?.texture?.key,
                    spriteFrame: cat.sprite?.frame?.name,
                    spriteVisible: cat.sprite?.visible,
                    spriteScale: cat.sprite?.scaleX,
                    spriteCrop: cat.sprite?._crop ? {
                        x: cat.sprite._crop.x,
                        y: cat.sprite._crop.y,
                        width: cat.sprite._crop.width,
                        height: cat.sprite._crop.height
                    } : null,
                    containerChildren: cat.list.length
                };
                catInfo.push(spriteInfo);
            });
        }
        
        return {
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            gameRunning: game.isRunning,
            cats: catInfo,
            textureKeys: Object.keys(game.textures.list).filter(k => k.includes('cat'))
        };
    });
    
    console.log('Canvas Info:', JSON.stringify(canvasInfo, null, 2));
    
    // Wait for user input
    console.log('\nPress Enter to close browser...');
    await new Promise(resolve => process.stdin.once('data', resolve));
    
    await browser.close();
    server.close();
}

debugSprite().catch(console.error);
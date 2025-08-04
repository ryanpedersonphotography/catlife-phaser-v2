const puppeteer = require('puppeteer');
const http = require('http');
const path = require('path');
const fs = require('fs');

async function verifyFix() {
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

    await new Promise(resolve => server.listen(8084, resolve));
    console.log('Server running on http://localhost:8084');

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });

    const page = await browser.newPage();
    
    // Listen to console logs
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Cat') || text.includes('sprite') || text.includes('frame')) {
            console.log('Browser:', text);
        }
    });

    await page.goto('http://localhost:8084');
    
    // Wait for game to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check sprite info
    const verification = await page.evaluate(() => {
        const game = window.game;
        if (!game) return { error: 'No game' };
        
        const scene = game.scene.getScene('GameScene');
        if (!scene || !scene.cats) return { error: 'No cats' };
        
        const results = [];
        scene.cats.forEach(cat => {
            if (cat.sprite) {
                results.push({
                    name: cat.data.name,
                    frameWidth: cat.sprite.frame.width,
                    frameHeight: cat.sprite.frame.height,
                    displayWidth: cat.sprite.displayWidth,
                    displayHeight: cat.sprite.displayHeight,
                    scale: cat.sprite.scaleX,
                    position: { x: cat.x, y: cat.y }
                });
            }
        });
        
        return results;
    });
    
    console.log('\n=== VERIFICATION ===');
    console.log(JSON.stringify(verification, null, 2));
    
    // Take screenshot
    await page.screenshot({ path: 'verified-single-cats.png' });
    console.log('\nScreenshot saved to verified-single-cats.png');
    
    // Wait a moment to see the result
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await browser.close();
    server.close();
    
    console.log('\nVerification complete!');
}

verifyFix().catch(console.error);
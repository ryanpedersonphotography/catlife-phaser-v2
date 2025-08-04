const puppeteer = require('puppeteer');

async function debugGame() {
    console.log('Starting Puppeteer debug session...');
    
    const browser = await puppeteer.launch({
        headless: false, // Show browser window
        devtools: true,  // Open DevTools automatically
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Listen for console messages
    page.on('console', msg => {
        console.log(`BROWSER LOG [${msg.type()}]:`, msg.text());
    });
    
    // Listen for errors
    page.on('error', err => {
        console.error('PAGE ERROR:', err);
    });
    
    page.on('pageerror', err => {
        console.error('PAGE ERROR:', err);
    });
    
    // Navigate to the game
    console.log('Navigating to http://localhost:8080...');
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
    
    // Wait for Phaser to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if Phaser is loaded
    const phaserLoaded = await page.evaluate(() => {
        return typeof Phaser !== 'undefined';
    });
    console.log('Phaser loaded:', phaserLoaded);
    
    // Check if game instance exists
    const gameExists = await page.evaluate(() => {
        return typeof window.game !== 'undefined';
    });
    console.log('Game instance exists:', gameExists);
    
    // Get detailed game state
    const gameState = await page.evaluate(() => {
        if (!window.game) return { error: 'No game instance' };
        
        const game = window.game;
        const scenes = game.scene.scenes.map(scene => ({
            key: scene.sys.config.key,
            active: scene.sys.isActive(),
            visible: scene.sys.isVisible(),
            sleeping: scene.sys.isSleeping()
        }));
        
        // Check textures
        const textureKeys = game.textures.list;
        const textures = {};
        for (let key in textureKeys) {
            if (key !== '__DEFAULT' && key !== '__MISSING') {
                const texture = game.textures.get(key);
                textures[key] = {
                    exists: true,
                    frameTotal: texture.frameTotal
                };
            }
        }
        
        return {
            scenes,
            textures,
            canvas: {
                width: game.canvas.width,
                height: game.canvas.height,
                visible: game.canvas.style.display !== 'none'
            },
            renderer: {
                type: game.renderer.type,
                running: game.renderer.running
            }
        };
    });
    
    console.log('\n=== GAME STATE ===');
    console.log(JSON.stringify(gameState, null, 2));
    
    // Check for specific issues
    const diagnostics = await page.evaluate(() => {
        const results = [];
        
        // Check if loading screen is blocking
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            results.push({
                issue: 'Loading screen status',
                display: loadingScreen.style.display,
                className: loadingScreen.className,
                opacity: window.getComputedStyle(loadingScreen).opacity
            });
        }
        
        // Check canvas
        const canvas = document.querySelector('canvas');
        if (canvas) {
            results.push({
                issue: 'Canvas status',
                width: canvas.width,
                height: canvas.height,
                display: canvas.style.display,
                visibility: canvas.style.visibility,
                opacity: canvas.style.opacity
            });
        }
        
        // Check for any Phaser errors
        if (window.game && window.game.scene.scenes.length > 0) {
            const activeScene = window.game.scene.scenes.find(s => s.sys.isActive());
            if (activeScene) {
                results.push({
                    issue: 'Active scene',
                    key: activeScene.sys.config.key,
                    childrenCount: activeScene.children.list.length,
                    displayListSize: activeScene.sys.displayList.list.length
                });
            }
        }
        
        return results;
    });
    
    console.log('\n=== DIAGNOSTICS ===');
    diagnostics.forEach(d => console.log(d));
    
    // Take a screenshot
    await page.screenshot({ path: 'debug-screenshot.png' });
    console.log('\nScreenshot saved as debug-screenshot.png');
    
    // Try to manually trigger sprite rendering
    const spriteTest = await page.evaluate(() => {
        if (!window.game) return { error: 'No game' };
        
        const activeScene = window.game.scene.scenes.find(s => s.sys.isActive());
        if (!activeScene) return { error: 'No active scene' };
        
        // Try to create a test sprite
        try {
            const testSprite = activeScene.add.sprite(640, 360, 'cat_orange', 0);
            return {
                success: true,
                spriteExists: !!testSprite,
                texture: testSprite.texture.key,
                frame: testSprite.frame.name
            };
        } catch (e) {
            return { error: e.message };
        }
    });
    
    console.log('\n=== SPRITE TEST ===');
    console.log(spriteTest);
    
    // Keep browser open for manual inspection
    console.log('\nBrowser will remain open for manual inspection...');
    console.log('Press Ctrl+C to close');
}

debugGame().catch(console.error);
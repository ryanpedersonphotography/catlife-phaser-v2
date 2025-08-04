const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1400, height: 800 }
    });
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
        console.log('Browser console:', msg.text());
    });
    
    await page.goto('http://localhost:8080');
    
    // Wait for game to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take a screenshot before clicking
    await page.screenshot({ path: 'before-click.png' });
    console.log('Took before screenshot');
    
    // Find and click on a cat sprite
    await page.evaluate(() => {
        const gameScene = window.game.scene.getScene('GameScene');
        if (gameScene && gameScene.cats && gameScene.cats.length > 0) {
            // Find a cat that's visible on screen
            for (let cat of gameScene.cats) {
                if (cat.sprite && cat.sprite.visible) {
                    console.log('Found visible cat:', cat.data.name);
                    console.log('Cat position:', cat.x, cat.y);
                    
                    // Simulate a click on the cat container, not the sprite
                    const pointer = gameScene.input.activePointer;
                    pointer.x = cat.x;
                    pointer.y = cat.y;
                    
                    // Emit pointerdown on the cat container itself
                    cat.emit('pointerdown', pointer);
                    
                    return true;
                }
            }
        }
        return false;
    });
    
    // Wait for popup to appear
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Take a screenshot after clicking
    await page.screenshot({ path: 'after-click-popup.png' });
    console.log('Took after screenshot with popup');
    
    // Check popup position
    const popupInfo = await page.evaluate(() => {
        const uiScene = window.game.scene.getScene('UIScene');
        if (uiScene && uiScene.catInfoPanel) {
            return {
                visible: uiScene.catInfoPanel.visible,
                x: uiScene.catInfoPanel.x,
                y: uiScene.catInfoPanel.y,
                gameWidth: window.game.config.width,
                gameHeight: window.game.config.height,
                expectedX: window.game.config.width / 2,
                expectedY: window.game.config.height / 2
            };
        }
        return null;
    });
    
    console.log('Popup info:', popupInfo);
    
    if (popupInfo) {
        console.log(`Popup position: (${popupInfo.x}, ${popupInfo.y})`);
        console.log(`Expected center: (${popupInfo.expectedX}, ${popupInfo.expectedY})`);
        console.log(`Is centered: ${popupInfo.x === popupInfo.expectedX && popupInfo.y === popupInfo.expectedY}`);
    }
    
    console.log('Test complete - check screenshots');
    
    // Keep browser open for manual inspection
    // await browser.close();
})();
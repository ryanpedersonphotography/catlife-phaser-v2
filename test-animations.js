const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1400, height: 800 }
    });
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
        if (msg.text().includes('animation') || msg.text().includes('Animation')) {
            console.log('Browser console:', msg.text());
        }
    });
    
    await page.goto('http://localhost:8080');
    
    // Wait for game to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test different animations
    const animationTests = await page.evaluate(() => {
        const gameScene = window.game.scene.getScene('GameScene');
        const results = [];
        
        if (gameScene && gameScene.cats && gameScene.cats.length > 0) {
            gameScene.cats.forEach((cat, index) => {
                const spriteKey = `cat_${cat.data.name.toLowerCase().replace(/\s+/g, '')}`;
                const anims = window.game.anims;
                
                // Check which animations exist for this cat
                const availableAnims = [];
                const animKeys = [
                    `${spriteKey}_idle`,
                    `${spriteKey}_idle_stand`,
                    `${spriteKey}_walk`,
                    `${spriteKey}_run`,
                    `${spriteKey}_sleep`,
                    `${spriteKey}_groom`,
                    `${spriteKey}_eat`,
                    `${spriteKey}_jump`,
                    `${spriteKey}_play`
                ];
                
                animKeys.forEach(key => {
                    if (anims.exists(key)) {
                        availableAnims.push(key);
                    }
                });
                
                results.push({
                    name: cat.data.name,
                    spriteKey: spriteKey,
                    currentState: cat.currentState,
                    currentAnimation: cat.currentAnimation,
                    availableAnimations: availableAnims,
                    spriteFrameTotal: cat.sprite.texture.frameTotal
                });
                
                // Test playing different animations
                if (index === 0) {
                    // Test walk animation on first cat
                    cat.setState('walking');
                    console.log(`Set ${cat.data.name} to walking state`);
                } else if (index === 1) {
                    // Test sleep animation on second cat
                    cat.setState('sleeping');
                    console.log(`Set ${cat.data.name} to sleeping state`);
                } else if (index === 2) {
                    // Test eating animation on third cat
                    cat.setState('eating');
                    console.log(`Set ${cat.data.name} to eating state`);
                }
            });
        }
        
        return results;
    });
    
    console.log('\n=== Animation Test Results ===');
    animationTests.forEach(cat => {
        console.log(`\nCat: ${cat.name}`);
        console.log(`Sprite Key: ${cat.spriteKey}`);
        console.log(`Current State: ${cat.currentState}`);
        console.log(`Current Animation: ${cat.currentAnimation}`);
        console.log(`Total Frames: ${cat.spriteFrameTotal}`);
        console.log(`Available Animations: ${cat.availableAnimations.length}`);
        cat.availableAnimations.forEach(anim => {
            console.log(`  - ${anim}`);
        });
    });
    
    // Wait to observe animations
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take screenshot
    await page.screenshot({ path: 'animation-test.png' });
    console.log('\nScreenshot saved as animation-test.png');
    
    console.log('\nAnimation test complete');
    
    // Keep browser open for manual inspection
    // await browser.close();
})();
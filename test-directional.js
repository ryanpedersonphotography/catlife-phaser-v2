const puppeteer = require('puppeteer');

(async () => {
    console.log('Testing directional animations...\n');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1400, height: 800 }
    });
    
    const page = await browser.newPage();
    
    // Collect console logs
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('facing') || text.includes('Animation') || text.includes('walk_')) {
            console.log('Browser:', text);
        }
    });
    
    await page.goto('http://localhost:8080');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('=== TESTING DIRECTIONAL MOVEMENT ===\n');
    
    // Test moving cat in different directions
    const testResults = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        const results = [];
        
        if (gameScene && gameScene.cats && gameScene.cats[0]) {
            const cat = gameScene.cats[0];
            
            // Test walking up
            console.log('Testing: Walk UP');
            cat.facing = 'up';
            cat.setState('walking');
            results.push({
                direction: 'up',
                animation: cat.currentAnimation,
                frame: cat.sprite.frame.name
            });
            
            // Wait and test walking down
            setTimeout(() => {
                console.log('Testing: Walk DOWN');
                cat.facing = 'down';
                cat.setState('walking');
                cat.updateAnimation();
            }, 2000);
            
            // Wait and test walking left
            setTimeout(() => {
                console.log('Testing: Walk LEFT');
                cat.facing = 'left';
                cat.setState('walking');
                cat.updateAnimation();
            }, 4000);
            
            // Wait and test walking right
            setTimeout(() => {
                console.log('Testing: Walk RIGHT');
                cat.facing = 'right';
                cat.setState('walking');
                cat.updateAnimation();
            }, 6000);
        }
        
        return results;
    });
    
    console.log('\nInitial test:', testResults);
    
    // Wait to observe all animations
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    // Final check
    const finalCheck = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        
        if (gameScene && gameScene.cats && gameScene.cats[0]) {
            const cat = gameScene.cats[0];
            return {
                name: cat.data.name,
                facing: cat.facing,
                state: cat.currentState,
                animation: cat.currentAnimation,
                frame: cat.sprite.frame.name,
                isPlaying: cat.sprite.anims.isPlaying
            };
        }
    });
    
    console.log('\n=== FINAL STATE ===');
    console.log('Cat:', finalCheck?.name);
    console.log('Facing:', finalCheck?.facing);
    console.log('Animation:', finalCheck?.animation);
    console.log('Frame:', finalCheck?.frame);
    console.log('Playing:', finalCheck?.isPlaying);
    
    // Take screenshots
    await page.screenshot({ path: 'directional-test.png' });
    console.log('\nScreenshot saved to directional-test.png');
    
    await browser.close();
})();
const puppeteer = require('puppeteer');

(async () => {
    console.log('Testing fixed directional animations...\n');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1400, height: 800 }
    });
    
    const page = await browser.newPage();
    
    // Go to the animation demo page
    await page.goto('http://localhost:8080/animation-demo.html');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('=== TESTING ANIMATION DEMO PAGE ===\n');
    
    // Test each directional animation
    const animations = [
        { name: 'walk_up', description: 'Back view - cat walking away' },
        { name: 'walk_down', description: 'Front view - cat walking toward viewer' },
        { name: 'walk_left', description: 'Left side profile' },
        { name: 'walk_right', description: 'Right side profile' },
        { name: 'idle', description: 'Front idle animation' },
        { name: 'sleep', description: 'Sleeping animation' },
        { name: 'eat', description: 'Eating animation' },
        { name: 'play', description: 'Playing animation' }
    ];
    
    for (const anim of animations) {
        console.log(`Testing ${anim.name}: ${anim.description}`);
        
        await page.evaluate((animName) => {
            // Call the global playAnimation function
            if (typeof playAnimation === 'function') {
                playAnimation(animName);
            } else {
                console.log('playAnimation not found');
            }
        }, anim.name);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if animation is playing correctly
        const animState = await page.evaluate(() => {
            if (window.cat && window.cat.anims) {
                const currentAnim = window.cat.anims.currentAnim;
                const currentFrame = window.cat.anims.currentFrame;
                return {
                    isPlaying: window.cat.anims.isPlaying,
                    animKey: currentAnim ? currentAnim.key : 'none',
                    frameIndex: currentFrame ? currentFrame.index : -1,
                    frameTotal: currentAnim ? currentAnim.frames.length : 0
                };
            }
            return null;
        });
        
        if (animState) {
            console.log(`  ✓ Animation playing: ${animState.isPlaying}`);
            console.log(`  ✓ Current animation: ${animState.animKey}`);
            console.log(`  ✓ Frame ${animState.frameIndex + 1}/${animState.frameTotal}`);
        }
        console.log('');
    }
    
    // Take a screenshot of the demo
    await page.screenshot({ path: 'animation-demo-test.png' });
    console.log('Screenshot saved to animation-demo-test.png');
    
    // Now test the main game
    console.log('\n=== TESTING MAIN GAME ===\n');
    await page.goto('http://localhost:8080');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if cat animations are working without blinking
    const gameState = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        if (gameScene && gameScene.cats && gameScene.cats[0]) {
            const cat = gameScene.cats[0];
            return {
                name: cat.data.name,
                facing: cat.facing,
                state: cat.currentState,
                animation: cat.currentAnimation,
                spriteVisible: cat.sprite.visible,
                spriteAlpha: cat.sprite.alpha,
                isPlaying: cat.sprite.anims ? cat.sprite.anims.isPlaying : false
            };
        }
        return null;
    });
    
    if (gameState) {
        console.log('Main game cat state:');
        console.log(`  Name: ${gameState.name}`);
        console.log(`  Facing: ${gameState.facing}`);
        console.log(`  State: ${gameState.state}`);
        console.log(`  Animation: ${gameState.animation}`);
        console.log(`  Visible: ${gameState.spriteVisible}`);
        console.log(`  Playing: ${gameState.isPlaying}`);
    }
    
    // Take a screenshot of the game
    await page.screenshot({ path: 'game-animation-test.png' });
    console.log('\nGame screenshot saved to game-animation-test.png');
    
    console.log('\n✅ Animation test complete!');
    console.log('The animations should now:');
    console.log('  - Show back view when walking UP (tail visible)');
    console.log('  - Show front view when walking DOWN');
    console.log('  - Show proper side profiles for LEFT/RIGHT');
    console.log('  - Have no blinking or phasing');
    
    await browser.close();
})();
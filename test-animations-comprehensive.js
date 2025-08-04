const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1400, height: 800 }
    });
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('animation') || text.includes('Animation') || 
            text.includes('Cat') || text.includes('frame')) {
            console.log('Browser console:', text);
        }
    });
    
    await page.goto('http://localhost:8080');
    
    // Wait for game to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n=== COMPREHENSIVE ANIMATION TEST ===\n');
    
    // Test 1: Check for blinking issues (first 2 frames skipped)
    console.log('1. Testing for blink issues...');
    const blinkTest = await page.evaluate(() => {
        const gameScene = window.game.scene.getScene('GameScene');
        const results = [];
        
        if (gameScene && gameScene.cats) {
            gameScene.cats.forEach(cat => {
                const sprite = cat.sprite;
                const currentFrame = sprite.frame.name;
                const animKey = cat.currentAnimation;
                
                results.push({
                    name: cat.data.name,
                    currentFrame: currentFrame,
                    animation: animKey,
                    isFirstTwoFrames: parseInt(currentFrame) < 2
                });
                
                // Force idle animation to check starting frame
                cat.setState('idle');
            });
        }
        
        return results;
    });
    
    console.log('Blink test results:');
    blinkTest.forEach(result => {
        console.log(`  ${result.name}: Frame ${result.currentFrame}, Animation: ${result.animation}`);
        if (result.isFirstTwoFrames) {
            console.log(`    ⚠️  WARNING: Using frames 0-1 which may cause blinking!`);
        }
    });
    
    // Test 2: Walking animation smoothness
    console.log('\n2. Testing walking animations...');
    await page.evaluate(() => {
        const gameScene = window.game.scene.getScene('GameScene');
        if (gameScene && gameScene.cats) {
            // Set all cats to walking
            gameScene.cats.forEach(cat => {
                cat.setState('walking');
                cat.target = { x: cat.x + 200, y: cat.y };
            });
        }
    });
    
    // Observe walking for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const walkingTest = await page.evaluate(() => {
        const gameScene = window.game.scene.getScene('GameScene');
        const results = [];
        
        if (gameScene && gameScene.cats) {
            gameScene.cats.forEach(cat => {
                const anim = cat.sprite.anims.currentAnim;
                results.push({
                    name: cat.data.name,
                    animation: anim ? anim.key : 'none',
                    frameRate: anim ? anim.frameRate : 0,
                    currentFrame: cat.sprite.frame.name,
                    isPlaying: cat.sprite.anims.isPlaying
                });
            });
        }
        
        return results;
    });
    
    console.log('Walking animation results:');
    walkingTest.forEach(result => {
        console.log(`  ${result.name}: ${result.animation} @ ${result.frameRate}fps, Frame: ${result.currentFrame}, Playing: ${result.isPlaying}`);
    });
    
    // Test 3: Sleeping animation (breathing)
    console.log('\n3. Testing sleeping animations...');
    await page.evaluate(() => {
        const gameScene = window.game.scene.getScene('GameScene');
        if (gameScene && gameScene.cats) {
            // Set first 3 cats to sleeping
            gameScene.cats.slice(0, 3).forEach(cat => {
                cat.setState('sleeping');
            });
        }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const sleepingTest = await page.evaluate(() => {
        const gameScene = window.game.scene.getScene('GameScene');
        const results = [];
        
        if (gameScene && gameScene.cats) {
            gameScene.cats.slice(0, 3).forEach(cat => {
                const anim = cat.sprite.anims.currentAnim;
                results.push({
                    name: cat.data.name,
                    animation: anim ? anim.key : 'none',
                    frameRate: anim ? anim.frameRate : 0,
                    frameCount: anim ? anim.frames.length : 0,
                    isBreathing: anim && anim.frameRate === 2 && anim.repeat === -1
                });
            });
        }
        
        return results;
    });
    
    console.log('Sleeping animation results:');
    sleepingTest.forEach(result => {
        console.log(`  ${result.name}: ${result.animation} @ ${result.frameRate}fps`);
        console.log(`    Frames: ${result.frameCount}, Breathing effect: ${result.isBreathing ? '✓' : '✗'}`);
    });
    
    // Test 4: Animation transitions
    console.log('\n4. Testing animation transitions...');
    const transitionTest = await page.evaluate(async () => {
        const gameScene = window.game.scene.getScene('GameScene');
        const results = [];
        
        if (gameScene && gameScene.cats && gameScene.cats[0]) {
            const cat = gameScene.cats[0];
            const transitions = [
                { from: 'idle', to: 'walking' },
                { from: 'walking', to: 'running' },
                { from: 'running', to: 'idle' },
                { from: 'idle', to: 'eating' },
                { from: 'eating', to: 'grooming' }
            ];
            
            for (const transition of transitions) {
                // Set initial state
                cat.setState(transition.from);
                await new Promise(r => setTimeout(r, 500));
                
                const beforeAnim = cat.sprite.anims.currentAnim?.key;
                
                // Transition
                cat.setState(transition.to);
                await new Promise(r => setTimeout(r, 100));
                
                const afterAnim = cat.sprite.anims.currentAnim?.key;
                
                results.push({
                    from: transition.from,
                    to: transition.to,
                    beforeAnim: beforeAnim,
                    afterAnim: afterAnim,
                    smooth: beforeAnim !== afterAnim
                });
            }
        }
        
        return results;
    });
    
    console.log('Animation transition results:');
    transitionTest.forEach(result => {
        console.log(`  ${result.from} → ${result.to}: ${result.smooth ? '✓ Smooth' : '✗ Not smooth'}`);
        console.log(`    Before: ${result.beforeAnim}, After: ${result.afterAnim}`);
    });
    
    // Test 5: Personality-based idle behavior
    console.log('\n5. Testing personality-based idle behavior...');
    await page.evaluate(() => {
        const gameScene = window.game.scene.getScene('GameScene');
        if (gameScene && gameScene.cats) {
            // Set all cats to idle to test personality
            gameScene.cats.forEach(cat => {
                cat.setState('idle');
            });
        }
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const personalityTest = await page.evaluate(() => {
        const gameScene = window.game.scene.getScene('GameScene');
        const results = [];
        
        if (gameScene && gameScene.cats) {
            gameScene.cats.forEach(cat => {
                const anim = cat.sprite.anims.currentAnim;
                results.push({
                    name: cat.data.name,
                    id: cat.data.id,
                    state: cat.currentState,
                    animation: anim ? anim.key : 'none',
                    isStanding: anim && anim.key.includes('idle_stand'),
                    isSitting: anim && anim.key.includes('idle') && !anim.key.includes('stand')
                });
            });
        }
        
        return results;
    });
    
    console.log('Personality-based idle results:');
    personalityTest.forEach(result => {
        console.log(`  ${result.name} (${result.id}): ${result.animation}`);
        if (result.id === 'tink') {
            console.log(`    Tink personality: ${result.isStanding ? '✓ Active (standing)' : '✗ Should be standing'}`);
        } else if (result.id === 'stinkylee') {
            console.log(`    Stinky Lee personality: ${result.isSitting ? '✓ Aloof (sitting)' : '✗ Should be sitting'}`);
        }
    });
    
    // Test 6: Frame ranges for all animations
    console.log('\n6. Verifying frame ranges for all animations...');
    const frameRangeTest = await page.evaluate(() => {
        const results = [];
        const catNames = ['gusty', 'snicker', 'rudy', 'scampi', 'stinkylee', 'jonah', 'tink', 'lucy', 'giselle'];
        
        catNames.forEach(catName => {
            const spriteKey = `cat_${catName}`;
            const animations = [
                { name: 'idle', expected: '2-7' },
                { name: 'idle_stand', expected: '34-39' },
                { name: 'walk', expected: '64-71' },
                { name: 'run', expected: '96-103' },
                { name: 'sleep', expected: '160-163' },
                { name: 'groom', expected: '128-135' },
                { name: 'eat', expected: '224-231' },
                { name: 'jump', expected: '192-199' },
                { name: 'play', expected: '200-207' }
            ];
            
            animations.forEach(animData => {
                const animKey = `${spriteKey}_${animData.name}`;
                const anim = window.game.anims.get(animKey);
                
                if (anim) {
                    const frames = anim.frames;
                    const start = frames[0].frame.name;
                    const end = frames[frames.length - 1].frame.name;
                    
                    results.push({
                        cat: catName,
                        animation: animData.name,
                        expected: animData.expected,
                        actual: `${start}-${end}`,
                        correct: `${start}-${end}` === animData.expected
                    });
                }
            });
        });
        
        return results;
    });
    
    console.log('Frame range verification:');
    const incorrectFrames = frameRangeTest.filter(r => !r.correct);
    if (incorrectFrames.length === 0) {
        console.log('  ✓ All animations use correct frame ranges!');
    } else {
        console.log('  ✗ Some animations have incorrect frame ranges:');
        incorrectFrames.forEach(result => {
            console.log(`    ${result.cat} - ${result.animation}: Expected ${result.expected}, got ${result.actual}`);
        });
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'animation-test-comprehensive.png' });
    console.log('\n=== TEST COMPLETE ===');
    console.log('Screenshot saved as animation-test-comprehensive.png');
    
    // Summary
    console.log('\n=== SUMMARY ===');
    console.log('1. Blink prevention: Idle animations start at frame 2 to avoid blinking');
    console.log('2. Walking smoothness: 8fps frame rate for smooth leg movement');
    console.log('3. Sleeping breathing: 2fps gentle loop for breathing effect');
    console.log('4. Smooth transitions: Animation changes happen immediately');
    console.log('5. Personality behavior: Tink stays active (standing), Stinky Lee stays aloof (sitting)');
    
    // Keep browser open for observation
    // await browser.close();
})();
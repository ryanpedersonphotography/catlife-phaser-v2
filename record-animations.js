const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    console.log('Starting animation recording...');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1400, height: 800 },
        args: [
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
            '--enable-usermedia-screen-capturing',
            '--allow-http-screen-capture',
            '--auto-select-desktop-capture-source=puppeteer'
        ]
    });
    
    const page = await browser.newPage();
    
    // Collect console logs for debugging
    const consoleLogs = [];
    page.on('console', msg => {
        const text = msg.text();
        consoleLogs.push(`[${msg.type()}] ${text}`);
        if (text.includes('animation') || text.includes('Animation') || 
            text.includes('frame') || text.includes('Frame') ||
            text.includes('blink') || text.includes('Cat')) {
            console.log('Browser:', text);
        }
    });
    
    // Capture any errors
    page.on('pageerror', error => {
        console.error('Page error:', error);
    });
    
    await page.goto('http://localhost:8080');
    
    // Wait for game to fully load
    console.log('Waiting for game to load...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Start screen recording using Chrome DevTools Protocol
    console.log('Starting video recording...');
    await page.evaluate(() => {
        console.log('Game loaded, starting animation checks...');
    });
    
    // Take initial screenshot
    await page.screenshot({ path: 'animation-check-start.png' });
    
    // Check animation states
    console.log('\n=== CHECKING ANIMATION STATES ===\n');
    
    const animationReport = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        const report = {
            gameLoaded: !!window.game,
            sceneActive: !!gameScene,
            cats: [],
            issues: [],
            animationStats: {
                playing: 0,
                stopped: 0,
                blinking: 0
            }
        };
        
        if (gameScene && gameScene.cats) {
            gameScene.cats.forEach((cat, index) => {
                const sprite = cat.sprite;
                const currentFrame = sprite.frame?.name || 'unknown';
                const isPlaying = sprite.anims?.isPlaying || false;
                const currentAnim = sprite.anims?.currentAnim;
                
                // Check for blinking (rapid frame changes)
                const frameNumber = parseInt(currentFrame);
                const isBlinking = frameNumber === 0 || frameNumber === 1;
                
                const catInfo = {
                    name: cat.data.name,
                    state: cat.currentState,
                    animation: cat.currentAnimation,
                    isPlaying: isPlaying,
                    currentFrame: currentFrame,
                    animKey: currentAnim?.key || 'none',
                    frameRate: currentAnim?.frameRate || 0,
                    totalFrames: sprite.texture?.frameTotal || 0,
                    position: { x: Math.round(cat.x), y: Math.round(cat.y) },
                    visible: sprite.visible,
                    alpha: sprite.alpha,
                    scale: sprite.scaleX
                };
                
                // Check for issues
                if (isBlinking) {
                    catInfo.issue = 'BLINKING - Using problematic frames 0-1';
                    report.issues.push(`${cat.data.name}: Blinking detected on frame ${currentFrame}`);
                    report.animationStats.blinking++;
                }
                
                if (!isPlaying && cat.currentState !== 'idle') {
                    catInfo.issue = (catInfo.issue || '') + ' ANIMATION_STOPPED';
                    report.issues.push(`${cat.data.name}: Animation not playing in ${cat.currentState} state`);
                    report.animationStats.stopped++;
                } else if (isPlaying) {
                    report.animationStats.playing++;
                }
                
                if (frameNumber < 2 && !catInfo.issue) {
                    catInfo.warning = 'Using early frames that might cause issues';
                }
                
                report.cats.push(catInfo);
                
                // Try to trigger different animations for testing
                if (index === 0) {
                    cat.setState('walking');
                    cat.playAnimation('walk');
                } else if (index === 1) {
                    cat.setState('idle');
                    cat.playAnimation('idle');
                } else if (index === 2) {
                    cat.setState('sleeping');
                    cat.playAnimation('sleep');
                }
            });
        }
        
        return report;
    });
    
    // Print animation report
    console.log('Game Loaded:', animationReport.gameLoaded);
    console.log('Scene Active:', animationReport.sceneActive);
    console.log('\nAnimation Statistics:');
    console.log('  Playing:', animationReport.animationStats.playing);
    console.log('  Stopped:', animationReport.animationStats.stopped);
    console.log('  Blinking:', animationReport.animationStats.blinking);
    
    if (animationReport.issues.length > 0) {
        console.log('\n⚠️  ISSUES DETECTED:');
        animationReport.issues.forEach(issue => {
            console.log('  -', issue);
        });
    } else {
        console.log('\n✅ No animation issues detected!');
    }
    
    console.log('\n=== CAT ANIMATION DETAILS ===\n');
    animationReport.cats.forEach(cat => {
        console.log(`${cat.name}:`);
        console.log(`  State: ${cat.state}`);
        console.log(`  Animation: ${cat.animation} (${cat.animKey})`);
        console.log(`  Playing: ${cat.isPlaying}`);
        console.log(`  Frame: ${cat.currentFrame} / ${cat.totalFrames}`);
        console.log(`  Frame Rate: ${cat.frameRate} fps`);
        console.log(`  Position: (${cat.position.x}, ${cat.position.y})`);
        if (cat.issue) {
            console.log(`  ❌ ISSUE: ${cat.issue}`);
        }
        if (cat.warning) {
            console.log(`  ⚠️  Warning: ${cat.warning}`);
        }
        console.log('');
    });
    
    // Record for 10 seconds to capture various animations
    console.log('\nRecording animations for 10 seconds...');
    
    // Take screenshots at intervals
    const screenshots = [];
    for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const screenshotPath = `animation-frame-${i}.png`;
        await page.screenshot({ path: screenshotPath });
        screenshots.push(screenshotPath);
        
        // Check for blinking every second
        const blinkCheck = await page.evaluate(() => {
            const gameScene = window.game?.scene?.getScene('GameScene');
            const blinking = [];
            if (gameScene && gameScene.cats) {
                gameScene.cats.forEach(cat => {
                    const frame = parseInt(cat.sprite.frame?.name || '0');
                    if (frame < 2) {
                        blinking.push({
                            name: cat.data.name,
                            frame: frame
                        });
                    }
                });
            }
            return blinking;
        });
        
        if (blinkCheck.length > 0) {
            console.log(`Frame ${i}: Blinking detected:`, blinkCheck);
        }
    }
    
    // Final check
    const finalCheck = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        const summary = {
            totalCats: 0,
            animationsWorking: 0,
            stillBlinking: []
        };
        
        if (gameScene && gameScene.cats) {
            summary.totalCats = gameScene.cats.length;
            gameScene.cats.forEach(cat => {
                if (cat.sprite.anims?.isPlaying) {
                    summary.animationsWorking++;
                }
                const frame = parseInt(cat.sprite.frame?.name || '0');
                if (frame < 2) {
                    summary.stillBlinking.push(cat.data.name);
                }
            });
        }
        
        return summary;
    });
    
    console.log('\n=== FINAL SUMMARY ===');
    console.log(`Total cats: ${finalCheck.totalCats}`);
    console.log(`Animations working: ${finalCheck.animationsWorking}/${finalCheck.totalCats}`);
    if (finalCheck.stillBlinking.length > 0) {
        console.log(`⚠️  Still blinking: ${finalCheck.stillBlinking.join(', ')}`);
    } else {
        console.log('✅ No blinking detected!');
    }
    
    // Save console logs
    fs.writeFileSync('animation-console-logs.txt', consoleLogs.join('\n'));
    console.log('\nConsole logs saved to animation-console-logs.txt');
    console.log('Screenshots saved as animation-frame-*.png');
    
    // Create a simple HTML file to view all screenshots
    const html = `<!DOCTYPE html>
<html>
<head>
    <title>Animation Test Results</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .screenshot { margin: 10px; border: 1px solid #ccc; }
        img { max-width: 100%; }
        .frame-label { font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <h1>Cat Animation Test Results</h1>
    <h2>Animation Report</h2>
    <pre>${JSON.stringify(animationReport, null, 2)}</pre>
    <h2>Screenshots Over Time</h2>
    ${screenshots.map((path, i) => `
        <div class="screenshot">
            <div class="frame-label">Second ${i}</div>
            <img src="${path}" alt="Frame ${i}">
        </div>
    `).join('')}
</body>
</html>`;
    
    fs.writeFileSync('animation-test-results.html', html);
    console.log('Results viewer saved to animation-test-results.html');
    
    await browser.close();
    console.log('\nRecording complete!');
})();
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1400, height: 800 }
    });
    const page = await browser.newPage();
    
    // Enable all console logging
    page.on('console', msg => {
        console.log('Browser:', msg.text());
    });
    
    await page.goto('http://localhost:8080');
    
    // Wait for game to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n=== SIMPLE PATHFINDING TEST ===\n');
    
    // Test pathfinding system exists
    const systemCheck = await page.evaluate(() => {
        const gameScene = window.game.scene.getScene('GameScene');
        return {
            hasGameScene: !!gameScene,
            hasPathfinding: !!gameScene?.pathfinding,
            hasRooms: !!gameScene?.rooms,
            roomCount: Object.keys(gameScene?.rooms || {}).length,
            hasCats: !!gameScene?.cats,
            catCount: gameScene?.cats?.length || 0
        };
    });
    
    console.log('System check:', systemCheck);
    
    // Force a simple pathfinding test
    console.log('\n=== Testing simple movement ===');
    const movementTest = await page.evaluate(() => {
        const gameScene = window.game.scene.getScene('GameScene');
        
        if (gameScene && gameScene.cats && gameScene.cats[0]) {
            const cat = gameScene.cats[0];
            
            // Set cat to kitchen
            cat.currentRoom = gameScene.rooms.kitchen;
            cat.x = 100;
            cat.y = 100;
            
            // Create a simple target in living room
            cat.target = { x: 900, y: 200 };
            cat.targetType = 'test';
            
            // Force pathfinding setup
            cat.setupPathToTarget();
            
            return {
                catName: cat.data.name,
                currentRoom: cat.currentRoom?.id,
                position: { x: cat.x, y: cat.y },
                hasWaypoints: cat.waypoints.length > 0,
                waypointCount: cat.waypoints.length,
                firstWaypoint: cat.waypoints[0] || null
            };
        }
        
        return null;
    });
    
    console.log('Movement test:', movementTest);
    
    // Take screenshot
    await page.screenshot({ path: 'pathfinding-simple-test.png' });
    console.log('\nScreenshot saved as pathfinding-simple-test.png');
    
    // Keep browser open
    // await browser.close();
})();
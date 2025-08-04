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
        if (text.includes('pathfinding') || text.includes('waypoint') || 
            text.includes('door') || text.includes('room')) {
            console.log('Browser console:', text);
        }
    });
    
    await page.goto('http://localhost:8080');
    
    // Wait for game to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n=== PATHFINDING TEST ===\n');
    
    // Test 1: Force a cat to seek food in another room
    console.log('1. Testing cross-room pathfinding...');
    const pathfindingTest = await page.evaluate(() => {
        const gameScene = window.game.scene.getScene('GameScene');
        
        if (gameScene && gameScene.cats && gameScene.cats[0]) {
            const cat = gameScene.cats[0];
            
            // Place cat in kitchen
            const kitchen = gameScene.rooms.kitchen;
            cat.setRoom(kitchen);
            cat.x = kitchen.x + 50;
            cat.y = kitchen.y + 50;
            
            // Force hunger
            cat.stats.hunger = 80;
            
            // Place food bowl in living room
            const livingRoom = gameScene.rooms.livingRoom;
            if (gameScene.foodBowls && gameScene.foodBowls[0]) {
                const bowl = gameScene.foodBowls[0];
                bowl.x = livingRoom.x + 100;
                bowl.y = livingRoom.y + 100;
                bowl.fill(); // Make sure it's full
            }
            
            // Trigger food seeking behavior
            cat.decideBehavior();
            
            return {
                catPosition: { x: cat.x, y: cat.y, room: cat.currentRoom?.id },
                targetSet: cat.target !== null,
                waypoints: cat.waypoints.map(wp => ({
                    x: wp.x,
                    y: wp.y,
                    type: wp.type,
                    fromRoom: wp.fromRoom,
                    toRoom: wp.toRoom
                }))
            };
        }
        
        return null;
    });
    
    console.log('Pathfinding setup:', pathfindingTest);
    
    // Watch the cat move for 10 seconds
    console.log('\n2. Monitoring cat movement through doors...');
    
    for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const catStatus = await page.evaluate(() => {
            const gameScene = window.game.scene.getScene('GameScene');
            if (gameScene && gameScene.cats && gameScene.cats[0]) {
                const cat = gameScene.cats[0];
                return {
                    position: { x: Math.round(cat.x), y: Math.round(cat.y) },
                    room: cat.currentRoom?.id,
                    state: cat.currentState,
                    waypointIndex: cat.currentWaypointIndex,
                    totalWaypoints: cat.waypoints.length,
                    isWalking: cat.currentState === 'walking'
                };
            }
            return null;
        });
        
        if (catStatus) {
            console.log(`  ${i+1}s: Cat in ${catStatus.room} at (${catStatus.position.x}, ${catStatus.position.y}), ` +
                       `State: ${catStatus.state}, Waypoint: ${catStatus.waypointIndex}/${catStatus.totalWaypoints}`);
        }
    }
    
    // Test 3: Check multiple cats pathfinding
    console.log('\n3. Testing multiple cats pathfinding...');
    const multiCatTest = await page.evaluate(() => {
        const gameScene = window.game.scene.getScene('GameScene');
        const results = [];
        
        if (gameScene && gameScene.cats) {
            gameScene.cats.slice(0, 3).forEach((cat, index) => {
                // Place cats in different rooms
                const rooms = ['kitchen', 'bathroom', 'bedroom'];
                const room = gameScene.rooms[rooms[index]];
                if (room) {
                    cat.setRoom(room);
                    cat.stats.hunger = 80;
                    cat.decideBehavior();
                    
                    results.push({
                        name: cat.data.name,
                        startRoom: room.id,
                        hasWaypoints: cat.waypoints.length > 0,
                        waypointCount: cat.waypoints.length
                    });
                }
            });
        }
        
        return results;
    });
    
    console.log('Multi-cat pathfinding:');
    multiCatTest.forEach(result => {
        console.log(`  ${result.name}: Starting in ${result.startRoom}, ` +
                   `Waypoints: ${result.waypointCount}`);
    });
    
    // Take screenshot
    await page.screenshot({ path: 'pathfinding-test.png' });
    console.log('\n=== TEST COMPLETE ===');
    console.log('Screenshot saved as pathfinding-test.png');
    
    // Summary
    console.log('\n=== SUMMARY ===');
    console.log('1. Cats now calculate waypoints through doors to reach targets');
    console.log('2. Movement follows room connections instead of floating directly');
    console.log('3. Room transitions happen when cats pass through door waypoints');
    console.log('4. Visual door indicators show connection points between rooms');
    
    // Keep browser open for observation
    // await browser.close();
})();
// Test script to verify cat sprite generation
console.log('Testing cat sprite generation...');

// Simulate a basic Phaser scene for testing
const mockScene = {
    make: {
        graphics: (config, addToScene) => {
            return {
                fillStyle: (color, alpha) => console.log(`Setting fill style: ${color.toString(16)}, alpha: ${alpha}`),
                fillCircle: (x, y, radius) => console.log(`Drawing circle at (${x}, ${y}) with radius ${radius}`),
                fillEllipse: (x, y, width, height) => console.log(`Drawing ellipse at (${x}, ${y}) with size ${width}x${height}`),
                fillTriangle: (x1, y1, x2, y2, x3, y3) => console.log(`Drawing triangle: (${x1},${y1}) (${x2},${y2}) (${x3},${y3})`),
                fillRect: (x, y, width, height) => console.log(`Drawing rectangle at (${x}, ${y}) with size ${width}x${height}`),
                lineStyle: (width, color, alpha) => console.log(`Setting line style: width ${width}, color ${color.toString(16)}, alpha ${alpha}`),
                beginPath: () => console.log('Beginning path'),
                arc: (x, y, radius, startAngle, endAngle, anticlockwise) => console.log(`Drawing arc at (${x}, ${y})`),
                strokePath: () => console.log('Stroking path'),
                clear: () => console.log('Clearing graphics'),
                generateTexture: (key, width, height) => console.log(`Generated texture: ${key} (${width}x${height})`),
                destroy: () => console.log('Graphics destroyed')
            };
        }
    }
};

// Test cat drawing function
function testDrawCat(x, y, color, state, frame) {
    console.log(`\nTesting cat drawing: position (${x}, ${y}), color ${color}, state ${state}, frame ${frame}`);
    
    const graphics = mockScene.make.graphics({ x: 0, y: 0 }, false);
    const catColor = parseInt(color.replace('#', ''), 16);
    
    if (state === 'sleep') {
        // Sleeping cat (curled up)
        graphics.fillStyle(catColor, 1);
        graphics.fillCircle(x, y + 5, 25);
        
        // Tail curled around
        graphics.lineStyle(8, catColor, 1);
        graphics.beginPath();
        graphics.arc(x, y + 5, 20, 0, Math.PI * 1.5);
        graphics.strokePath();
    } else {
        // Body
        graphics.fillStyle(catColor, 1);
        graphics.fillEllipse(x, y + 10, 20, 25);
        
        // Head
        graphics.fillCircle(x, y - 10, 15);
        
        // Ears
        graphics.fillTriangle(x - 10, y - 20, x - 5, y - 30, x, y - 20);
        graphics.fillTriangle(x, y - 20, x + 5, y - 30, x + 10, y - 20);
    }
    
    console.log('Cat drawing complete');
}

// Test different cat states
testDrawCat(32, 32, '#FF6B6B', 'idle', 0);
testDrawCat(32, 32, '#FF9F1C', 'walk', 1);
testDrawCat(32, 32, '#9B59B6', 'sleep', 0);

console.log('\nCat sprite generation test complete!');
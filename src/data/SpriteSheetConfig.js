export const SPRITE_CONFIG = {
    frameWidth: 32,
    frameHeight: 30,
    columnsPerRow: 32,
    validColumns: 8,  // Only first 8 columns have sprites
    
    // Animation definitions that apply to ALL cats
    animations: {
        idle: {
            row: 0,
            frames: 8,
            frameRate: 4,
            repeat: -1
        },
        idle_stand: {
            row: 0,
            startCol: 4,
            frames: 4,
            frameRate: 3,
            repeat: -1
        },
        idle_down: {
            row: 0,
            frames: 8,
            frameRate: 3,
            repeat: -1
        },
        idle_up: {
            row: 4,
            frames: 4,
            frameRate: 3,
            repeat: -1
        },
        walk_down: {
            row: 1,
            frames: 8,
            frameRate: 8,
            repeat: -1
        },
        walk_left: {
            row: 2,
            frames: 8,
            frameRate: 8,
            repeat: -1
        },
        walk_right: {
            row: 3,
            frames: 8,
            frameRate: 8,
            repeat: -1
        },
        walk_up: {
            row: 7,  // Row 7 has the cat walking away (back view with tail)
            frames: 8,
            frameRate: 8,
            repeat: -1
        },
        sleep: {
            row: 5,
            frames: 8,
            frameRate: 2,
            repeat: -1
        },
        eat: {
            row: 6,
            frames: 8,
            frameRate: 4,
            repeat: -1
        },
        groom: {
            row: 7,
            frames: 8,
            frameRate: 3,
            repeat: 0
        },
        play: {
            row: 8,
            frames: 8,
            frameRate: 6,
            repeat: -1
        },
        run: {
            row: 9,
            frames: 8,
            frameRate: 12,
            repeat: -1
        },
        jump: {
            row: 10,
            frames: 8,
            frameRate: 10,
            repeat: 0
        }
    }
};

// Helper function to calculate frame indices
export function getFrameIndices(animConfig) {
    const { row, frames, startCol = 0 } = animConfig;
    const startFrame = row * SPRITE_CONFIG.columnsPerRow + startCol;
    const endFrame = startFrame + frames - 1;
    return { start: startFrame, end: endFrame };
}

// Get list of all animation names
export function getAnimationNames() {
    return Object.keys(SPRITE_CONFIG.animations);
}

// Validate sprite sheet dimensions
export function validateSpriteSheet(texture) {
    const expectedWidth = SPRITE_CONFIG.columnsPerRow * SPRITE_CONFIG.frameWidth;
    const expectedHeight = 16 * SPRITE_CONFIG.frameHeight; // 16 rows typical
    
    const actualWidth = texture.source[0].width;
    const actualHeight = texture.source[0].height;
    
    if (actualWidth !== expectedWidth || actualHeight !== expectedHeight) {
        console.warn(`Sprite sheet dimensions mismatch:
            Expected: ${expectedWidth}x${expectedHeight}
            Actual: ${actualWidth}x${actualHeight}`);
        return false;
    }
    
    return true;
}
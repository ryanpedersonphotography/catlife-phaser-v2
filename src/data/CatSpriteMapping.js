// Mapping of original cats to available sprite sheets
export const CAT_SPRITE_MAPPING = {
    gusty: {
        spriteSheet: 'orange', // Orange cat
        frames: ['orange_0', 'orange_1', 'orange_2', 'orange_3'],
        animations: {
            idle: { frames: [0, 1], fps: 2 },
            walk: { frames: [0, 1, 2, 3], fps: 8 },
            sleep: { frames: [2, 3], fps: 1 }
        }
    },
    
    snicker: {
        spriteSheet: 'brown', // Brown cat
        frames: ['brown_0', 'brown_1', 'brown_2', 'brown_3', 'brown_4', 'brown_5', 'brown_6', 'brown_7', 'brown_8'],
        animations: {
            idle: { frames: [0, 1], fps: 2 },
            walk: { frames: [2, 3, 4, 5], fps: 8 },
            sleep: { frames: [6, 7], fps: 1 }
        }
    },
    
    rudy: {
        spriteSheet: 'red', // Red cat for aggressive Rudy
        frames: ['red_0', 'red_1'],
        animations: {
            idle: { frames: [0, 1], fps: 2 },
            walk: { frames: [0, 1], fps: 8 },
            sleep: { frames: [0, 1], fps: 1 }
        }
    },
    
    scampi: {
        spriteSheet: 'yellow', // Yellow cat
        frames: ['yellow_0'],
        animations: {
            idle: { frames: [0], fps: 1 },
            walk: { frames: [0], fps: 1 },
            sleep: { frames: [0], fps: 1 }
        }
    },
    
    stinkylee: {
        spriteSheet: 'indigo', // Indigo for mysterious Stinky Lee
        frames: ['indigo_0'],
        animations: {
            idle: { frames: [0], fps: 1 },
            walk: { frames: [0], fps: 1 },
            sleep: { frames: [0], fps: 1 }
        }
    },
    
    jonah: {
        spriteSheet: 'blue', // Blue for gentle Jonah
        frames: ['blue_0', 'blue_1', 'blue_2', 'blue_3'],
        animations: {
            idle: { frames: [0, 1], fps: 2 },
            walk: { frames: [0, 1, 2, 3], fps: 8 },
            sleep: { frames: [2, 3], fps: 1 }
        }
    },
    
    tink: {
        spriteSheet: 'pink', // Pink for special Tink
        frames: ['pink_0'],
        animations: {
            idle: { frames: [0], fps: 1 },
            walk: { frames: [0], fps: 1 },
            sleep: { frames: [0], fps: 1 }
        }
    },
    
    lucy: {
        spriteSheet: 'dark', // Dark gray for feisty Lucy
        frames: ['dark_0'],
        animations: {
            idle: { frames: [0], fps: 1 },
            walk: { frames: [0], fps: 1 },
            sleep: { frames: [0], fps: 1 }
        }
    },
    
    giselle: {
        spriteSheet: 'creme', // Elegant creme color
        frames: ['creme_0', 'creme_1'],
        animations: {
            idle: { frames: [0, 1], fps: 2 },
            walk: { frames: [0, 1], fps: 8 },
            sleep: { frames: [0, 1], fps: 1 }
        }
    }
};

// Get sprite configuration for a cat
export function getCatSpriteConfig(catId) {
    return CAT_SPRITE_MAPPING[catId] || null;
}

// Get all sprite sheets that need to be loaded
export function getRequiredSpriteSheets() {
    const sheets = new Set();
    Object.values(CAT_SPRITE_MAPPING).forEach(config => {
        sheets.add(config.spriteSheet);
    });
    return Array.from(sheets);
}

// Get frame configuration for animations
export function getCatAnimationFrames(catId, animationType) {
    const config = getCatSpriteConfig(catId);
    if (!config || !config.animations[animationType]) return null;
    
    const anim = config.animations[animationType];
    return {
        frames: anim.frames.map(f => `${config.spriteSheet}_${f}`),
        frameRate: anim.fps,
        repeat: animationType === 'sleep' || animationType === 'idle' ? -1 : 0
    };
}
import { SPRITE_CONFIG, getFrameIndices } from '../data/SpriteSheetConfig';

export default class AnimationFactory {
    constructor(scene) {
        this.scene = scene;
        this.createdAnimations = new Set();
    }
    
    // Create all animations for a single cat
    createCatAnimations(catName) {
        const spriteKey = `cat_${catName}`;
        
        // Verify sprite sheet exists
        if (!this.scene.textures.exists(spriteKey)) {
            console.error(`Sprite sheet ${spriteKey} not loaded!`);
            return false;
        }
        
        const texture = this.scene.textures.get(spriteKey);
        console.log(`Creating animations for ${catName}:`, {
            totalFrames: texture.frameTotal,
            sourceSize: `${texture.source[0].width}x${texture.source[0].height}`
        });
        
        let successCount = 0;
        let failCount = 0;
        
        // Create each animation from config
        Object.entries(SPRITE_CONFIG.animations).forEach(([animName, config]) => {
            const frames = getFrameIndices(config);
            const animKey = `${spriteKey}_${animName}`;
            
            // Skip if already created
            if (this.createdAnimations.has(animKey)) {
                return;
            }
            
            try {
                this.scene.anims.create({
                    key: animKey,
                    frames: this.scene.anims.generateFrameNumbers(spriteKey, frames),
                    frameRate: config.frameRate,
                    repeat: config.repeat
                });
                this.createdAnimations.add(animKey);
                successCount++;
            } catch (error) {
                console.error(`Failed to create animation ${animName} for ${catName}:`, error);
                failCount++;
            }
        });
        
        // Create legacy walk animation (for backward compatibility)
        const walkKey = `${spriteKey}_walk`;
        if (!this.createdAnimations.has(walkKey)) {
            const walkDown = getFrameIndices(SPRITE_CONFIG.animations.walk_down);
            try {
                this.scene.anims.create({
                    key: walkKey,
                    frames: this.scene.anims.generateFrameNumbers(spriteKey, walkDown),
                    frameRate: 8,
                    repeat: -1
                });
                this.createdAnimations.add(walkKey);
                successCount++;
            } catch (error) {
                console.error(`Failed to create legacy walk animation for ${catName}:`, error);
                failCount++;
            }
        }
        
        console.log(`${catName}: Created ${successCount} animations, ${failCount} failures`);
        return failCount === 0;
    }
    
    // Create animations for all cats
    createAllCatAnimations(catNames) {
        console.log(`Creating animations for ${catNames.length} cats...`);
        const results = {};
        
        catNames.forEach(catName => {
            results[catName] = this.createCatAnimations(catName);
        });
        
        const successCount = Object.values(results).filter(r => r === true).length;
        console.log(`Animation creation complete: ${successCount}/${catNames.length} cats successful`);
        
        return results;
    }
    
    // Verify animations exist for a cat
    verifyAnimations(catName) {
        const spriteKey = `cat_${catName}`;
        const missing = [];
        const found = [];
        
        Object.keys(SPRITE_CONFIG.animations).forEach(animName => {
            const fullKey = `${spriteKey}_${animName}`;
            if (!this.scene.anims.exists(fullKey)) {
                missing.push(animName);
            } else {
                found.push(animName);
            }
        });
        
        // Check legacy walk
        if (!this.scene.anims.exists(`${spriteKey}_walk`)) {
            missing.push('walk (legacy)');
        }
        
        if (missing.length > 0) {
            console.warn(`${catName} missing animations:`, missing);
        } else {
            console.log(`${catName} has all ${found.length} animations`);
        }
        
        return {
            catName,
            found: found.length,
            missing: missing.length,
            isComplete: missing.length === 0,
            missingList: missing
        };
    }
    
    // Verify all cats have animations
    verifyAllAnimations(catNames) {
        console.log('Verifying all cat animations...');
        const results = catNames.map(catName => this.verifyAnimations(catName));
        
        const complete = results.filter(r => r.isComplete).length;
        const incomplete = results.filter(r => !r.isComplete);
        
        console.log(`Animation verification: ${complete}/${catNames.length} cats complete`);
        
        if (incomplete.length > 0) {
            console.warn('Incomplete cats:', incomplete.map(r => ({
                cat: r.catName,
                missing: r.missingList
            })));
        }
        
        return results;
    }
    
    // Get animation info for debugging
    getAnimationInfo(catName, animName) {
        const spriteKey = `cat_${catName}`;
        const animKey = `${spriteKey}_${animName}`;
        
        if (!this.scene.anims.exists(animKey)) {
            return null;
        }
        
        const anim = this.scene.anims.get(animKey);
        const config = SPRITE_CONFIG.animations[animName];
        
        return {
            key: animKey,
            frameCount: anim.frames.length,
            frameRate: anim.frameRate,
            repeat: anim.repeat,
            config: config,
            frameIndices: getFrameIndices(config)
        };
    }
    
    // Clean up animations (useful for scene transitions)
    cleanupAnimations(catNames = null) {
        if (!catNames) {
            // Clear all tracked animations
            this.createdAnimations.clear();
            return;
        }
        
        // Clear specific cat animations
        catNames.forEach(catName => {
            const spriteKey = `cat_${catName}`;
            Object.keys(SPRITE_CONFIG.animations).forEach(animName => {
                const animKey = `${spriteKey}_${animName}`;
                this.createdAnimations.delete(animKey);
            });
            this.createdAnimations.delete(`${spriteKey}_walk`);
        });
    }
}
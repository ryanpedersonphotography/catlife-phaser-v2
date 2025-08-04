import { Scene } from 'phaser';
import { COLORS } from '../data/Constants';
import { getAllCats } from '../data/CatDatabase';

export default class PreloadScene extends Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    init() {
        // Update loading screen
        this.loadingBar = document.getElementById('loading-bar');
        this.loadingText = document.getElementById('loading-text');
        console.log('PreloadScene: Initialized', { loadingBar: this.loadingBar, loadingText: this.loadingText });
    }

    preload() {
        // Set up load progress
        this.load.on('progress', (value) => {
            if (this.loadingBar) {
                this.loadingBar.style.width = `${value * 100}%`;
            }
        });

        this.load.on('fileprogress', (file) => {
            if (this.loadingText) {
                this.loadingText.textContent = `Loading: ${file.key}`;
            }
        });

        this.load.on('complete', () => {
            console.log('PreloadScene: Load complete');
            // Hide HTML loading screen
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                console.log('PreloadScene: Hiding loading screen');
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        });

        this.load.on('loaderror', (file) => {
            console.error('PreloadScene: Failed to load file:', file.key, file.src, file);
            if (this.loadingText) {
                this.loadingText.textContent = `Error loading: ${file.key}`;
                this.loadingText.style.color = '#ff6b6b';
            }
        });

        // Load real sprite assets
        this.loadRealAssets();
    }

    create() {
        console.log('PreloadScene: Create phase starting');
        console.log('Loaded textures:', Object.keys(this.textures.list));
        
        // Check if cat sprites loaded
        const catColors = ['orange', 'black', 'gray', 'brown', 'pink', 'blue', 'green', 'yellow', 'white', 'calico', 'red'];
        catColors.forEach(color => {
            const key = `cat_${color}`;  // Fixed: Use the actual loaded key
            const exists = this.textures.exists(key);
            console.log(`Texture ${key} exists: ${exists}`);
            if (exists) {
                const texture = this.textures.get(key);
                console.log(`  Texture ${key} frames: ${texture.frameTotal}`);
                // Check first frame
                const frame = texture.get(0);
                console.log(`  Frame 0 dimensions: ${frame.width}x${frame.height}`);
            }
        });
        
        console.log('PreloadScene: Generate missing assets');
        // Generate all missing textures (must be done in create, not preload)
        this.generateMissingAssets();
        this.generateRoomBackgrounds();
        
        console.log('PreloadScene: Generate proper cat sprites');
        // Generate cat sprites with proper cat artwork (override the PNG files)
        this.generateCatSprites();
        
        console.log('PreloadScene: Creating animations');
        // Create animations
        this.createAnimations();
        
        console.log('PreloadScene: Starting MainMenuScene');
        // Move to main menu
        this.scene.start('MainMenuScene');
    }

    loadRealAssets() { 
        console.log('LoadRealAssets: Starting to load all assets');
        
        // Set the base path for all assets
        this.load.setPath('assets/sprites/');
        console.log('Base path set to:', this.load.path);
        
        // Map of cat colors to sprite sheet files
        const catSpriteSheets = {
            'orange': 'orange_0.png',
            'black': 'black_0.png',
            'gray': 'grey_0.png',
            'brown': 'brown_0.png',
            'pink': 'pink_0.png',
            'blue': 'blue_0.png',
            'green': 'teal_0.png',  // Using teal as green
            'yellow': 'yellow_0.png',
            'white': 'white_0.png',
            'calico': 'calico_0.png',
            'red': 'red_0.png'
        };
        
        // Load cat sprite sheets
        Object.entries(catSpriteSheets).forEach(([color, filename]) => {
            const key = `cat_${color}`;
            console.log(`Loading sprite sheet: ${key} from ${filename}`);
            
            // Each sprite sheet has 64x60 pixel sprites in a grid (480px / 8 rows = 60px per row)
            this.load.spritesheet(key, filename, {
                frameWidth: 64,
                frameHeight: 60,
                margin: 0,
                spacing: 0
            });
        });
        
        // Load game object sprites (only those that exist as files)
        this.load.image('food_bowl_empty', 'food_bowl_empty.png');
        this.load.image('litter_box_clean', 'litter_box_clean.png');
        
        // Load UI elements
        this.load.image('ui_panel', 'ui_panel.png');
        this.load.image('particle_star', 'particle_star.png');
        this.load.image('particle_heart', 'particle_heart.png');
        this.load.image('particle_sparkle', 'particle_sparkle.png');
        this.load.image('icon_heart', 'icon_heart.png');
    }

    // Map cat colors to available sprite colors (original 9 cats)
    getClosestSpriteColor(hexColor) {
        const colorMap = {
            '#FF9F1C': 'orange',    // Gusty - orange
            '#8B4513': 'brown',     // Snicker - brown
            '#E74C3C': 'red',       // Rudy - red
            '#FDD835': 'yellow',    // Scampi - yellow
            '#4A148C': 'pink',      // Stinky Lee - indigo (use pink for now)
            '#2196F3': 'blue',      // Jonah - blue
            '#E91E63': 'pink',      // Tink - pink
            '#424242': 'gray',      // Lucy - dark gray
            '#F5F5DC': 'white'      // Giselle - creme (use white)
        };
        
        return colorMap[hexColor] || 'gray';
    }

    generateCatSprites() {
        console.log('Setting up cat sprites from loaded sprite sheets...');
        // This method is no longer needed - the color mapping happens in Cat.js
        // when each cat is created. The sprite sheets are already loaded at this point.
    }


    generateRoomBackgrounds() {
        console.log('Generating room backgrounds...');
        const rooms = {
            kitchen: { color: 0xFFE5CC, width: 350, height: 250 },
            diningRoom: { color: 0xF0E5CF, width: 350, height: 250 },
            livingRoom: { color: 0xE8D5C4, width: 400, height: 250 },
            hallway: { color: 0xD2B48C, width: 1140, height: 80 },
            bathroom: { color: 0xB4E4FF, width: 350, height: 200 },
            bedroom: { color: 0xD4C5F9, width: 770, height: 200 },
            outside: { color: 0x90EE90, width: 300, height: 570 }
        };

        Object.entries(rooms).forEach(([roomId, config]) => {
            const graphics = this.make.graphics({ x: 0, y: 0 }, false);
            
            // Background
            graphics.fillStyle(config.color, 0.5);
            graphics.fillRect(0, 0, config.width, config.height);
            
            // Border
            graphics.lineStyle(2, config.color, 0.8);
            graphics.strokeRect(1, 1, config.width - 2, config.height - 2);
            
            // Add some texture
            graphics.fillStyle(config.color, 0.1);
            for (let i = 0; i < 10; i++) {
                const x = Math.random() * config.width;
                const y = Math.random() * config.height;
                graphics.fillCircle(x, y, Math.random() * 20 + 10);
            }
            
            graphics.generateTexture(`room_${roomId}`, config.width, config.height);
            graphics.destroy();
        });
    }

    generateUIElements() {
        // Button texture
        const buttonGraphics = this.make.graphics({ x: 0, y: 0 }, false);
        buttonGraphics.fillStyle(COLORS.PRIMARY, 1);
        buttonGraphics.fillRoundedRect(0, 0, 200, 50, 10);
        buttonGraphics.generateTexture('ui_button', 200, 50);
        buttonGraphics.destroy();

        // Panel texture
        const panelGraphics = this.make.graphics({ x: 0, y: 0 }, false);
        panelGraphics.fillStyle(COLORS.DARK, 0.9);
        panelGraphics.fillRoundedRect(0, 0, 300, 400, 15);
        panelGraphics.lineStyle(2, COLORS.PRIMARY, 1);
        panelGraphics.strokeRoundedRect(0, 0, 300, 400, 15);
        panelGraphics.generateTexture('ui_panel', 300, 400);
        panelGraphics.destroy();

        // Icons
        this.generateIcon('icon_heart', 0xff6b6b, 'heart');
        this.generateIcon('icon_food', 0x48bb78, 'circle');
        this.generateIcon('icon_water', 0x4299e1, 'drop');
        this.generateIcon('icon_sleep', 0x9f7aea, 'moon');
        this.generateIcon('icon_play', 0xf6ad55, 'star');
        this.generateIcon('icon_clean', 0x4299e1, 'sparkle');
    }

    generateIcon(key, color, shape) {
        const graphics = this.make.graphics({ x: 0, y: 0 }, false);
        graphics.fillStyle(color, 1);
        
        switch(shape) {
            case 'heart':
                // Draw heart shape using beginPath and curves
                graphics.beginPath();
                graphics.moveTo(16, 20);
                graphics.arc(12, 12, 4, 0, Math.PI, true);
                graphics.arc(20, 12, 4, 0, Math.PI, true);
                graphics.lineTo(16, 20);
                graphics.closePath();
                graphics.fillPath();
                break;
            case 'circle':
                graphics.fillCircle(16, 16, 12);
                break;
            case 'drop':
                graphics.fillEllipse(16, 20, 10, 12);
                graphics.fillTriangle(16, 10, 12, 16, 20, 16);
                break;
            case 'moon':
                graphics.fillCircle(16, 16, 12);
                graphics.fillStyle(COLORS.DARK, 1);
                graphics.fillCircle(20, 16, 10);
                break;
            case 'star':
                // Draw a simple star shape
                graphics.beginPath();
                graphics.moveTo(16, 6);   // top point
                graphics.lineTo(11, 14);  // bottom left
                graphics.lineTo(21, 10);  // right middle
                graphics.lineTo(11, 10);  // left middle
                graphics.lineTo(21, 14);  // bottom right
                graphics.closePath();
                graphics.fillPath();
                break;
            case 'sparkle':
                graphics.fillCircle(16, 16, 8);
                graphics.fillStyle(0xffffff, 0.8);
                graphics.fillCircle(14, 14, 3);
                break;
        }
        
        graphics.generateTexture(key, 32, 32);
        graphics.destroy();
    }

    generateGameObjects() {
        // Food bowl
        const bowlGraphics = this.make.graphics({ x: 0, y: 0 }, false);
        bowlGraphics.fillStyle(0x8b6914, 1);
        bowlGraphics.fillEllipse(32, 35, 28, 15);
        bowlGraphics.fillStyle(0x654321, 1);
        bowlGraphics.fillEllipse(32, 32, 24, 12);
        bowlGraphics.generateTexture('food_bowl_empty', 64, 64);
        
        // Full food bowl
        bowlGraphics.fillStyle(0x8b4513, 1);
        for (let i = 0; i < 8; i++) {
            const x = 32 + (Math.random() - 0.5) * 16;
            const y = 30 + (Math.random() - 0.5) * 6;
            bowlGraphics.fillCircle(x, y, 3);
        }
        bowlGraphics.generateTexture('food_bowl_full', 64, 64);
        bowlGraphics.destroy();

        // Litter box
        const boxGraphics = this.make.graphics({ x: 0, y: 0 }, false);
        boxGraphics.fillStyle(0x696969, 1);
        boxGraphics.fillRoundedRect(0, 10, 64, 44, 5);
        boxGraphics.fillStyle(0xf5deb3, 1);
        boxGraphics.fillRect(5, 35, 54, 15);
        boxGraphics.generateTexture('litter_box_clean', 64, 64);
        
        // Dirty litter box
        boxGraphics.fillStyle(0x8b4513, 0.8);
        boxGraphics.fillCircle(20, 40, 4);
        boxGraphics.fillCircle(40, 38, 3);
        boxGraphics.generateTexture('litter_box_dirty', 64, 64);
        boxGraphics.destroy();

        // Toys
        const toyGraphics = this.make.graphics({ x: 0, y: 0 }, false);
        toyGraphics.fillStyle(0xff69b4, 1);
        toyGraphics.fillCircle(16, 16, 10);
        toyGraphics.fillStyle(0xffffff, 0.5);
        toyGraphics.fillCircle(13, 13, 4);
        toyGraphics.generateTexture('toy_ball', 32, 32);
        
        toyGraphics.clear();
        toyGraphics.fillStyle(0x98fb98, 1);
        toyGraphics.fillRect(8, 8, 16, 16);
        toyGraphics.lineStyle(2, 0x228b22, 1);
        for (let i = 0; i < 3; i++) {
            toyGraphics.lineBetween(8, 10 + i * 6, 24, 10 + i * 6);
            toyGraphics.lineBetween(10 + i * 6, 8, 10 + i * 6, 24);
        }
        toyGraphics.generateTexture('toy_mouse', 32, 32);
        toyGraphics.destroy();
    }

    generateParticles() {
        // Heart particle
        const heartGraphics = this.make.graphics({ x: 0, y: 0 }, false);
        heartGraphics.fillStyle(0xff69b4, 1);
        // Draw simple heart shape
        heartGraphics.beginPath();
        heartGraphics.moveTo(8, 12);
        heartGraphics.arc(6, 8, 2, 0, Math.PI, true);
        heartGraphics.arc(10, 8, 2, 0, Math.PI, true);
        heartGraphics.lineTo(8, 12);
        heartGraphics.closePath();
        heartGraphics.fillPath();
        heartGraphics.generateTexture('particle_heart', 16, 16);
        heartGraphics.destroy();

        // Star particle
        const starGraphics = this.make.graphics({ x: 0, y: 0 }, false);
        starGraphics.fillStyle(0xffd700, 1);
        starGraphics.fillCircle(8, 8, 4);
        starGraphics.fillStyle(0xffffff, 0.8);
        starGraphics.fillCircle(7, 7, 2);
        starGraphics.generateTexture('particle_star', 16, 16);
        starGraphics.destroy();

        // Sparkle particle
        const sparkleGraphics = this.make.graphics({ x: 0, y: 0 }, false);
        sparkleGraphics.fillStyle(0xffffff, 1);
        sparkleGraphics.fillRect(7, 0, 2, 16);
        sparkleGraphics.fillRect(0, 7, 16, 2);
        sparkleGraphics.fillStyle(0xffffff, 0.5);
        sparkleGraphics.fillRect(3, 3, 10, 10);
        sparkleGraphics.generateTexture('particle_sparkle', 16, 16);
        sparkleGraphics.destroy();
    }

    generateMissingAssets() {
        console.log('PreloadScene: Generating missing assets');
        
        // Only generate assets that weren't loaded as files
        // Generate game objects (bowls, litter boxes, toys)
        this.generateGameObjects();
        
        // Generate icons that we don't have as files
        this.generateIcon('icon_food', 0x48bb78, 'circle');
        this.generateIcon('icon_water', 0x4299e1, 'drop');
        this.generateIcon('icon_sleep', 0x9f7aea, 'moon');
        this.generateIcon('icon_play', 0xf6ad55, 'star');
        this.generateIcon('icon_clean', 0x4299e1, 'sparkle');
        
        // Generate toy sprites (these are always generated)
        this.generateToySprites();
        
        // Don't regenerate particles that exist as files - only generate missing ones
        // The particle files exist so we skip generation
        
        // Generate UI buttons
        const buttonGraphics = this.make.graphics({ x: 0, y: 0 }, false);
        buttonGraphics.fillStyle(0x667eea, 1);
        buttonGraphics.fillRoundedRect(0, 0, 200, 50, 10);
        buttonGraphics.generateTexture('ui_button', 200, 50);
        buttonGraphics.destroy();
        
        console.log('PreloadScene: Finished generating missing assets');
    }
    
    generateToySprites() {
        const toyGraphics = this.make.graphics({ x: 0, y: 0 }, false);
        toyGraphics.fillStyle(0xff69b4, 1);
        toyGraphics.fillCircle(16, 16, 10);
        toyGraphics.fillStyle(0xffffff, 0.5);
        toyGraphics.fillCircle(13, 13, 4);
        toyGraphics.generateTexture('toy_ball', 32, 32);
        
        toyGraphics.clear();
        toyGraphics.fillStyle(0x98fb98, 1);
        toyGraphics.fillRect(8, 8, 16, 16);
        toyGraphics.generateTexture('toy_mouse', 32, 32);
        toyGraphics.destroy();
    }
    
    createAnimations() {
        console.log('Creating animations for cat sprite sheets...');
        
        // Create animations for each loaded sprite sheet
        const catColors = ['orange', 'black', 'gray', 'brown', 'pink', 'blue', 'green', 'yellow', 'white', 'calico', 'red'];
        
        catColors.forEach(color => {
            const spriteKey = `cat_${color}`;
            
            if (this.textures.exists(spriteKey)) {
                const texture = this.textures.get(spriteKey);
                const frameCount = texture.frameTotal;
                console.log(`Creating animations for ${spriteKey} with ${frameCount} frames`);
                // Based on the sprite sheet layout (16 frames per row at 64x60):
                // Row 1 (frames 0-15): Sitting down
                // Row 2 (frames 16-31): Looking around  
                // Row 3 (frames 32-47): Laying down
                // Row 4 (frames 48-63): Walking
                // Row 5 (frames 64-79): Running
                // Row 6 (frames 80-95): Running 2.0
                // Row 7 (frames 96-111): Side walk
                // Row 8 (frames 112-127): Sitting 2.0
                
                // Ensure frame ranges don't exceed available frames
                const safeFrameEnd = (endFrame) => Math.min(endFrame, frameCount - 1);
                
                // Idle/Sitting animation - use first few frames of sitting
                if (frameCount > 0) {
                    this.anims.create({
                        key: `${spriteKey}_idle`,
                        frames: this.anims.generateFrameNumbers(spriteKey, {
                            start: 0,
                            end: safeFrameEnd(3)
                        }),
                        frameRate: 4,
                        repeat: -1
                    });
                }
                
                // Walking animation - use walking frames (if we have enough frames)
                if (frameCount > 48) {
                    this.anims.create({
                        key: `${spriteKey}_walk`,
                        frames: this.anims.generateFrameNumbers(spriteKey, {
                            start: 48,
                            end: safeFrameEnd(55)
                        }),
                        frameRate: 8,
                        repeat: -1
                    });
                } else {
                    // Fallback to idle frames for walking
                    this.anims.create({
                        key: `${spriteKey}_walk`,
                        frames: this.anims.generateFrameNumbers(spriteKey, {
                            start: 0,
                            end: safeFrameEnd(3)
                        }),
                        frameRate: 6,
                        repeat: -1
                    });
                }
                
                // Sleeping/Laying animation - use laying down frames (if available)
                if (frameCount > 32) {
                    this.anims.create({
                        key: `${spriteKey}_sleep`,
                        frames: this.anims.generateFrameNumbers(spriteKey, {
                            start: 32,
                            end: safeFrameEnd(35)
                        }),
                        frameRate: 2,
                        repeat: -1
                    });
                } else {
                    // Fallback to idle frames for sleeping
                    this.anims.create({
                        key: `${spriteKey}_sleep`,
                        frames: this.anims.generateFrameNumbers(spriteKey, {
                            start: 0,
                            end: safeFrameEnd(1)
                        }),
                        frameRate: 1,
                        repeat: -1
                    });
                }
                
                console.log(`Created animations for ${spriteKey}`);
            }
        });
    }
}
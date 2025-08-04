import { Scene } from 'phaser';
import { COLORS } from '../data/Constants';
import { getRequiredSpriteSheets } from '../data/CatSpriteMapping';

export default class OriginalPreloadScene extends Scene {
    constructor() {
        super({ key: 'OriginalPreloadScene' });
    }

    init() {
        // Update loading screen
        this.loadingBar = document.getElementById('loading-bar');
        this.loadingText = document.getElementById('loading-text');
        console.log('OriginalPreloadScene: Initialized');
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
            console.log('OriginalPreloadScene: Load complete');
            // Hide HTML loading screen
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        });

        this.load.on('loaderror', (file) => {
            console.error('OriginalPreloadScene: Failed to load file:', file.key, file.src);
            if (this.loadingText) {
                this.loadingText.textContent = `Error loading: ${file.key}`;
                this.loadingText.style.color = '#ff6b6b';
            }
        });

        // Load sprites for original cats
        this.loadOriginalCatAssets();
    }

    create() {
        console.log('OriginalPreloadScene: Create phase starting');
        
        // Generate missing textures
        this.generateMissingAssets();
        
        // Create animations for original cats
        this.createOriginalAnimations();
        
        console.log('OriginalPreloadScene: Starting MainMenuScene');
        // Move to main menu
        this.scene.start('MainMenuScene');
    }

    loadOriginalCatAssets() {
        console.log('Loading original cat assets...');
        
        // Set the base path for all assets
        this.load.setPath('assets/sprites/');
        
        // Map of original cat sprite colors to actual sprite files
        const originalCatSprites = {
            'orange': ['orange_0.png', 'orange_1.png', 'orange_2.png', 'orange_3.png'],
            'brown': ['brown_0.png', 'brown_1.png', 'brown_2.png', 'brown_3.png', 'brown_4.png', 'brown_5.png', 'brown_6.png', 'brown_7.png', 'brown_8.png'],
            'red': ['red_0.png', 'red_1.png'],
            'yellow': ['yellow_0.png'],
            'indigo': ['indigo_0.png'],
            'blue': ['blue_0.png', 'blue_1.png', 'blue_2.png', 'blue_3.png'],
            'pink': ['pink_0.png'],
            'dark': ['dark_0.png'],
            'creme': ['creme_0.png', 'creme_1.png']
        };
        
        // Load individual sprite images for each cat color
        Object.entries(originalCatSprites).forEach(([color, files]) => {
            files.forEach((filename, index) => {
                const key = `${color}_${index}`;
                console.log(`Loading sprite: ${key} from ${filename}`);
                this.load.image(key, filename);
            });
        });
        
        // Load game object sprites
        this.load.image('food_bowl_empty', 'food_bowl_empty.png');
        this.load.image('litter_box_clean', 'litter_box_clean.png');
        
        // Load UI elements
        this.load.image('ui_panel', 'ui_panel.png');
        this.load.image('particle_star', 'particle_star.png');
        this.load.image('particle_heart', 'particle_heart.png');
        this.load.image('particle_sparkle', 'particle_sparkle.png');
        this.load.image('icon_heart', 'icon_heart.png');
        
        // Also load the SVG cat sprites for original cats if available
        const originalCatNames = ['gusty', 'snicker', 'rudy', 'scampi', 'stinkylee', 'jonah', 'tink', 'lucy', 'giselle'];
        originalCatNames.forEach(name => {
            try {
                this.load.image(`cat_${name}_svg`, `cat_${name}.svg`);
            } catch (e) {
                console.warn(`SVG not found for ${name}, using pixel sprite`);
            }
        });
    }

    generateMissingAssets() {
        console.log('Generating missing assets...');
        
        // Generate room backgrounds
        this.generateRoomBackgrounds();
        
        // Generate UI elements if needed
        this.generateUIElements();
    }

    generateRoomBackgrounds() {
        const roomBackgrounds = {
            'kitchen': { color: 0xFFE5CC, width: 400, height: 300 },
            'livingRoom': { color: 0xE8D5C4, width: 450, height: 300 },
            'bedroom': { color: 0xD4C5F9, width: 400, height: 250 },
            'bathroom': { color: 0xB4E4FF, width: 450, height: 250 },
            'outside': { color: 0x90EE90, width: 200, height: 600 }
        };
        
        Object.entries(roomBackgrounds).forEach(([roomId, config]) => {
            const graphics = this.add.graphics();
            graphics.fillStyle(config.color);
            graphics.fillRect(0, 0, config.width, config.height);
            graphics.lineStyle(3, 0x333333);
            graphics.strokeRect(0, 0, config.width, config.height);
            
            graphics.generateTexture(`room_${roomId}`, config.width, config.height);
            graphics.destroy();
        });
    }

    generateUIElements() {
        // Generate energy bar
        const energyBarGraphics = this.add.graphics();
        energyBarGraphics.fillStyle(0x00ff00);
        energyBarGraphics.fillRect(0, 0, 200, 20);
        energyBarGraphics.lineStyle(2, 0x000000);
        energyBarGraphics.strokeRect(0, 0, 200, 20);
        energyBarGraphics.generateTexture('energy_bar', 200, 20);
        energyBarGraphics.destroy();
        
        // Generate door
        const doorGraphics = this.add.graphics();
        doorGraphics.fillStyle(0x8B4513);
        doorGraphics.fillRect(0, 0, 50, 100);
        doorGraphics.lineStyle(2, 0x654321);
        doorGraphics.strokeRect(0, 0, 50, 100);
        doorGraphics.generateTexture('door', 50, 100);
        doorGraphics.destroy();
        
        // Generate mess icons
        const messGraphics = this.add.graphics();
        messGraphics.fillStyle(0x8B4513);
        messGraphics.fillCircle(15, 15, 10);
        messGraphics.generateTexture('mess_poop', 30, 30);
        messGraphics.clear();
        messGraphics.fillStyle(0xFFFF00);
        messGraphics.fillCircle(15, 15, 8);
        messGraphics.generateTexture('mess_pee', 30, 30);
        messGraphics.destroy();
    }

    createOriginalAnimations() {
        console.log('Creating original cat animations...');
        
        const originalCatSprites = {
            'orange': { frames: 4, name: 'gusty' },
            'brown': { frames: 9, name: 'snicker' },
            'red': { frames: 2, name: 'rudy' },
            'yellow': { frames: 1, name: 'scampi' },
            'indigo': { frames: 1, name: 'stinkylee' },
            'blue': { frames: 4, name: 'jonah' },
            'pink': { frames: 1, name: 'tink' },
            'dark': { frames: 1, name: 'lucy' },
            'creme': { frames: 2, name: 'giselle' }
        };
        
        // Create animations for each cat color
        Object.entries(originalCatSprites).forEach(([color, config]) => {
            // Idle animation
            if (config.frames >= 2) {
                this.anims.create({
                    key: `${color}_idle`,
                    frames: this.anims.generateFrameNames(color, { 
                        start: 0, 
                        end: Math.min(1, config.frames - 1),
                        prefix: `${color}_`
                    }),
                    frameRate: 2,
                    repeat: -1
                });
                
                // Walk animation
                this.anims.create({
                    key: `${color}_walk`,
                    frames: this.anims.generateFrameNames(color, { 
                        start: 0, 
                        end: config.frames - 1,
                        prefix: `${color}_`
                    }),
                    frameRate: 8,
                    repeat: -1
                });
                
                // Sleep animation (slower)
                this.anims.create({
                    key: `${color}_sleep`,
                    frames: this.anims.generateFrameNames(color, { 
                        start: Math.max(0, config.frames - 2), 
                        end: config.frames - 1,
                        prefix: `${color}_`
                    }),
                    frameRate: 1,
                    repeat: -1
                });
            } else {
                // Single frame animations for cats with only one sprite
                ['idle', 'walk', 'sleep'].forEach(animType => {
                    this.anims.create({
                        key: `${color}_${animType}`,
                        frames: [{ key: `${color}_0` }],
                        frameRate: 1,
                        repeat: 0
                    });
                });
            }
        });
        
        console.log('Original cat animations created');
    }
}
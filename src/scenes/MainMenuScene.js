import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../data/Constants';
import { getAllCats } from '../data/CatDatabase';

export default class MainMenuScene extends Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        console.log('MainMenuScene: create() called');
        // Background gradient
        this.createBackground();
        console.log('MainMenuScene: Background created');
        
        // Title
        this.createTitle();
        
        // Menu options
        this.createMenu();
        
        // Decorative cats
        this.createDecorations();
        
        // Version info
        this.add.text(GAME_WIDTH - 10, GAME_HEIGHT - 10, 'v2.0.0', {
            fontSize: '14px',
            color: '#ffffff',
            alpha: 0.5
        }).setOrigin(1, 1);
    }

    createBackground() {
        // Create gradient background
        const graphics = this.add.graphics();
        const colors = [COLORS.PRIMARY, COLORS.SECONDARY];
        
        for (let i = 0; i < GAME_HEIGHT; i++) {
            const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                Phaser.Display.Color.IntegerToColor(colors[0]),
                Phaser.Display.Color.IntegerToColor(colors[1]),
                GAME_HEIGHT,
                i
            );
            
            graphics.fillStyle(
                Phaser.Display.Color.GetColor(color.r, color.g, color.b),
                0.8
            );
            graphics.fillRect(0, i, GAME_WIDTH, 1);
        }
        
        // Add floating particles
        for (let i = 0; i < 20; i++) {
            const particle = this.add.image(
                Math.random() * GAME_WIDTH,
                Math.random() * GAME_HEIGHT,
                'particle_star'
            );
            
            particle.setAlpha(0.1 + Math.random() * 0.2);
            particle.setScale(0.5 + Math.random() * 0.5);
            
            this.tweens.add({
                targets: particle,
                y: particle.y - 100,
                alpha: 0,
                duration: 3000 + Math.random() * 3000,
                repeat: -1,
                onRepeat: () => {
                    particle.x = Math.random() * GAME_WIDTH;
                    particle.y = GAME_HEIGHT + 50;
                    particle.setAlpha(0.1 + Math.random() * 0.2);
                }
            });
        }
    }

    createTitle() {
        // Main title
        const title = this.add.text(GAME_WIDTH / 2, 150, 'Cat Life', {
            fontSize: '84px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Subtitle
        const subtitle = this.add.text(GAME_WIDTH / 2, 220, 'Special Needs Cat Caretaker', {
            fontSize: '28px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Animations
        this.tweens.add({
            targets: title,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
        
        this.tweens.add({
            targets: subtitle,
            alpha: 0.7,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
    }

    createMenu() {
        const menuItems = [
            { text: 'New Game', action: () => this.startNewGame() },
            { text: 'Continue', action: () => this.continueGame() },
            { text: 'How to Play', action: () => this.showHowToPlay() },
            { text: 'Settings', action: () => this.showSettings() },
            { text: 'Credits', action: () => this.showCredits() }
        ];
        
        const startY = 350;
        const spacing = 70;
        
        menuItems.forEach((item, index) => {
            const button = this.createMenuButton(
                GAME_WIDTH / 2,
                startY + index * spacing,
                item.text,
                item.action
            );
            
            // Stagger animation
            this.tweens.add({
                targets: button,
                alpha: { from: 0, to: 1 },
                x: { from: GAME_WIDTH / 2 - 100, to: GAME_WIDTH / 2 },
                duration: 500,
                delay: index * 100,
                ease: 'Back.out'
            });
        });
    }

    createMenuButton(x, y, text, callback) {
        const container = this.add.container(x, y);
        
        // Larger button for touch
        const btnWidth = 300;
        const btnHeight = 70;
        
        // Button background
        const bg = this.add.graphics();
        bg.fillStyle(COLORS.PRIMARY, 0.8);
        bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);
        container.add(bg);
        
        // Button text (larger for readability)
        const buttonText = this.add.text(0, 0, text, {
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        container.add(buttonText);
        
        // Make interactive with larger hit area
        container.setSize(btnWidth, btnHeight);
        container.setInteractive({ useHandCursor: true });
        
        container.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(COLORS.PRIMARY, 1);
            bg.fillRoundedRect(-btnWidth/2 - 10, -btnHeight/2 - 5, btnWidth + 20, btnHeight + 10, 40);
            bg.lineStyle(3, COLORS.WHITE, 1);
            bg.strokeRoundedRect(-btnWidth/2 - 10, -btnHeight/2 - 5, btnWidth + 20, btnHeight + 10, 40);
            buttonText.setScale(1.05);
        });
        
        container.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(COLORS.PRIMARY, 0.8);
            bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);
            buttonText.setScale(1);
        });
        
        container.on('pointerdown', () => {
            bg.clear();
            bg.fillStyle(COLORS.SECONDARY, 1);
            bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);
            
            this.tweens.add({
                targets: container,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    bg.clear();
                    bg.fillStyle(COLORS.PRIMARY, 0.8);
                    bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);
                    callback();
                }
            });
        });
        
        return container;
    }

    createDecorations() {
        // Add cats walking around
        const cats = getAllCats();
        const positions = [
            { x: 100, y: 600 },
            { x: 300, y: 650 },
            { x: 900, y: 620 },
            { x: 1100, y: 660 }
        ];
        
        positions.forEach((pos, index) => {
            if (index < cats.length) {
                // Create a static sprite (no animation for menu)
                // Use color-based texture instead of per-cat texture
                const colorMap = {
                    '#FF6B6B': 'pink',
                    '#FF9F1C': 'orange',
                    '#9B59B6': 'pink',
                    '#F39C12': 'orange',
                    '#7F8C8D': 'gray',
                    '#E74C3C': 'orange',
                    '#2C3E50': 'gray',
                    '#000000': 'black',
                    '#ECF0F1': 'gray',
                    '#34495E': 'gray',
                    '#8B4513': 'brown',
                    '#5D6D7E': 'gray',
                    '#D35400': 'orange',
                    '#F8BBD0': 'pink',
                    '#FFAB00': 'orange',
                    '#FDD835': 'yellow',
                    '#43A047': 'green',
                    '#E91E63': 'pink',
                    '#FF5722': 'orange',
                    '#FDD835': 'yellow'
                };
                const spriteColor = colorMap[cats[index].color] || 'gray';
                const spriteSheetKey = `cat_${spriteColor}`;
                const cat = this.add.image(pos.x, pos.y, spriteSheetKey, 0);
                cat.setScale(0.8);
                
                // Simple bob animation instead of walking
                this.tweens.add({
                    targets: cat,
                    y: pos.y - 10,
                    duration: 1000 + Math.random() * 500,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                
                // Occasional flip
                this.time.addEvent({
                    delay: 3000 + Math.random() * 2000,
                    callback: () => {
                        this.tweens.add({
                            targets: cat,
                            scaleX: cat.scaleX * -1,
                            duration: 300
                        });
                    },
                    loop: true
                });
            }
        });
    }

    startNewGame() {
        // Show character creation or difficulty selection
        this.createNewGameDialog();
    }

    continueGame() {
        // Check if there's a saved game
        const savedGame = localStorage.getItem('catlife_gamestate');
        if (savedGame) {
            this.scene.start('GameScene', { loadSave: true });
        } else {
            this.showMessage('No saved game found!');
        }
    }

    showHowToPlay() {
        // Create how to play overlay
        const overlay = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.8)
            .setOrigin(0)
            .setInteractive();
        
        const panel = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'ui_panel')
            .setScale(2);
        
        const title = this.add.text(GAME_WIDTH / 2, 200, 'How to Play', {
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        const instructions = [
            'Care for 9 special needs cats',
            'Keep them fed and happy',
            'Clean litter boxes regularly',
            'Give medications on time',
            'Ensure they get enough sleep',
            'Manage the door for outdoor cats',
            'Earn points for good care'
        ];
        
        instructions.forEach((text, index) => {
            this.add.text(GAME_WIDTH / 2, 280 + index * 40, text, {
                fontSize: '20px',
                color: '#ffffff'
            }).setOrigin(0.5);
        });
        
        const closeButton = this.createMenuButton(
            GAME_WIDTH / 2,
            GAME_HEIGHT - 150,
            'Close',
            () => {
                overlay.destroy();
                panel.destroy();
                title.destroy();
                instructions.forEach((_, i) => {
                    this.children.list[this.children.list.length - 1].destroy();
                });
                closeButton.destroy();
            }
        );
    }

    showSettings() {
        // Settings will be implemented
        this.showMessage('Settings coming soon!');
    }

    showCredits() {
        // Credits will be implemented
        this.showMessage('Created with love for all special needs cats!');
    }

    createNewGameDialog() {
        const overlay = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.8)
            .setOrigin(0)
            .setInteractive();
        
        const panel = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'ui_panel')
            .setScale(1.5);
        
        const title = this.add.text(GAME_WIDTH / 2, 250, 'Select Difficulty', {
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        const difficulties = [
            { name: 'Easy', desc: 'Relaxed pace, forgiving cats', multiplier: 0.5 },
            { name: 'Normal', desc: 'Balanced challenge', multiplier: 1 },
            { name: 'Hard', desc: 'Demanding cats, strict timing', multiplier: 1.5 }
        ];
        
        difficulties.forEach((diff, index) => {
            const button = this.createMenuButton(
                GAME_WIDTH / 2,
                350 + index * 80,
                diff.name,
                () => {
                    this.registry.set('difficulty', diff.name.toLowerCase());
                    this.registry.set('difficultyMultiplier', diff.multiplier);
                    this.scene.start('GameScene', { newGame: true });
                }
            );
            
            this.add.text(GAME_WIDTH / 2, 380 + index * 80, diff.desc, {
                fontSize: '16px',
                color: '#cccccc'
            }).setOrigin(0.5);
        });
    }

    showMessage(text) {
        const message = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 50, text, {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: message,
            alpha: 0,
            duration: 2000,
            delay: 1000,
            onComplete: () => message.destroy()
        });
    }
}
import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../data/Constants';

export default class OriginalMainMenuScene extends Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        // Background gradient
        this.createBackground();
        
        // Title
        this.createTitle();
        
        // Menu options
        this.createMenu();
        
        // Game info
        this.createGameInfo();
        
        // Version info
        this.add.text(GAME_WIDTH - 10, GAME_HEIGHT - 10, 'Original v1.0', {
            fontSize: '14px',
            color: '#ffffff',
            alpha: 0.5
        }).setOrigin(1, 1);
    }

    createBackground() {
        // Dark background like original
        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x2a2a2a);
        
        // Add floating cat emojis
        const catEmojis = ['🐱', '😸', '🐈', '😻', '🐈‍⬛', '😾', '😺', '😹', '😼'];
        
        for (let i = 0; i < 15; i++) {
            const emoji = this.add.text(
                Math.random() * GAME_WIDTH,
                Math.random() * GAME_HEIGHT,
                catEmojis[Math.floor(Math.random() * catEmojis.length)],
                { fontSize: '32px' }
            );
            
            emoji.setAlpha(0.1);
            
            this.tweens.add({
                targets: emoji,
                y: emoji.y - 100,
                alpha: 0,
                duration: 5000 + Math.random() * 5000,
                repeat: -1,
                onRepeat: () => {
                    emoji.x = Math.random() * GAME_WIDTH;
                    emoji.y = GAME_HEIGHT + 50;
                    emoji.setAlpha(0.1);
                    emoji.setText(catEmojis[Math.floor(Math.random() * catEmojis.length)]);
                }
            });
        }
    }

    createTitle() {
        // Main title with retro feel
        const title = this.add.text(GAME_WIDTH / 2, 120, '🐱 CATLIFE 🐱', {
            fontSize: '72px',
            fontStyle: 'bold',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 4,
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        // Subtitle
        const subtitle = this.add.text(GAME_WIDTH / 2, 180, 'Special Needs Cat Caretaker', {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        // Glowing effect
        this.tweens.add({
            targets: title,
            alpha: 0.8,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
    }

    createMenu() {
        const menuY = 300;
        const buttonSpacing = 80;
        
        // Difficulty selection first
        this.add.text(GAME_WIDTH / 2, menuY - 40, 'Select Difficulty:', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        const difficulties = [
            { name: 'EASY', key: 'easy', color: '#00ff00' },
            { name: 'NORMAL', key: 'normal', color: '#ffff00' },
            { name: 'HARD', key: 'hard', color: '#ff0000' }
        ];
        
        this.selectedDifficulty = 'normal';
        this.difficultyButtons = {};
        
        difficulties.forEach((diff, index) => {
            const button = this.add.text(
                GAME_WIDTH / 2 - 200 + (index * 200), 
                menuY,
                diff.name,
                {
                    fontSize: '18px',
                    color: diff.color,
                    backgroundColor: diff.key === this.selectedDifficulty ? '#333333' : '#000000',
                    padding: { x: 20, y: 10 },
                    fontFamily: 'monospace'
                }
            ).setOrigin(0.5);
            
            button.setInteractive({ useHandCursor: true });
            button.on('pointerdown', () => this.selectDifficulty(diff.key));
            button.on('pointerover', () => {
                button.setScale(1.1);
                button.setBackgroundColor('#444444');
            });
            button.on('pointerout', () => {
                button.setScale(1.0);
                button.setBackgroundColor(diff.key === this.selectedDifficulty ? '#333333' : '#000000');
            });
            
            this.difficultyButtons[diff.key] = button;
        });
        
        // Game mode selection
        this.add.text(GAME_WIDTH / 2, menuY + 80, 'Select Game Mode:', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        const modes = [
            { name: '🏆 CHALLENGE', key: 'challenge', desc: 'Game ends at -50 score' },
            { name: '♾️ ENDLESS', key: 'endless', desc: 'Play forever, no game over' }
        ];
        
        this.selectedGameMode = 'challenge';
        this.gameModeButtons = {};
        
        modes.forEach((mode, index) => {
            const button = this.add.text(
                GAME_WIDTH / 2 - 200 + (index * 400),
                menuY + 120,
                mode.name,
                {
                    fontSize: '18px',
                    color: '#ffffff',
                    backgroundColor: mode.key === this.selectedGameMode ? '#333333' : '#000000',
                    padding: { x: 20, y: 10 },
                    fontFamily: 'monospace'
                }
            ).setOrigin(0.5);
            
            const desc = this.add.text(
                GAME_WIDTH / 2 - 200 + (index * 400),
                menuY + 150,
                mode.desc,
                {
                    fontSize: '12px',
                    color: '#cccccc',
                    fontFamily: 'monospace'
                }
            ).setOrigin(0.5);
            
            button.setInteractive({ useHandCursor: true });
            button.on('pointerdown', () => this.selectGameMode(mode.key));
            button.on('pointerover', () => {
                button.setScale(1.1);
                button.setBackgroundColor('#444444');
            });
            button.on('pointerout', () => {
                button.setScale(1.0);
                button.setBackgroundColor(mode.key === this.selectedGameMode ? '#333333' : '#000000');
            });
            
            this.gameModeButtons[mode.key] = { button, desc };
        });
        
        // Start Game button
        const startButton = this.add.text(GAME_WIDTH / 2, menuY + 220, 'START GAME', {
            fontSize: '28px',
            color: '#000000',
            backgroundColor: '#00ff00',
            padding: { x: 30, y: 15 },
            fontFamily: 'monospace',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        startButton.setInteractive({ useHandCursor: true });
        startButton.on('pointerdown', () => this.startGame());
        startButton.on('pointerover', () => {
            startButton.setScale(1.1);
            startButton.setBackgroundColor('#44ff44');
        });
        startButton.on('pointerout', () => {
            startButton.setScale(1.0);
            startButton.setBackgroundColor('#00ff00');
        });
        
        // Add player name input (simulated)
        this.playerName = 'Cat Lover';
        const nameLabel = this.add.text(GAME_WIDTH / 2, menuY + 280, `Player: ${this.playerName}`, {
            fontSize: '16px',
            color: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
    }

    createGameInfo() {
        // Left panel - Original Cats
        const leftPanel = this.add.graphics();
        leftPanel.fillStyle(0x000000, 0.8);
        leftPanel.fillRoundedRect(20, 250, 200, 250, 10);
        
        this.add.text(30, 260, 'ORIGINAL CATS:', {
            fontSize: '16px',
            color: '#00ff00',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        });
        
        const originalCats = [
            '🐱 Gusty - steals food',
            '😸 Snicker - poops everywhere', 
            '😾 Rudy - fights others',
            '😹 Scampi - pees everywhere',
            '😼 Stinky Lee - mysterious',
            '😺 Jonah - gentle soul',
            '🐈 Tink - needs attention',
            '🐈‍⬛ Lucy - independent',
            '😻 Giselle - elegant'
        ];
        
        originalCats.forEach((cat, index) => {
            this.add.text(30, 285 + (index * 18), cat, {
                fontSize: '11px',
                color: '#ffffff',
                fontFamily: 'monospace'
            });
        });
        
        // Right panel - Game Features
        const rightPanel = this.add.graphics();
        rightPanel.fillStyle(0x000000, 0.8);
        rightPanel.fillRoundedRect(GAME_WIDTH - 220, 250, 200, 250, 10);
        
        this.add.text(GAME_WIDTH - 210, 260, 'GAME FEATURES:', {
            fontSize: '16px',
            color: '#00ff00',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        });
        
        const features = [
            '• Energy system',
            '• Cat conflicts',
            '• Special behaviors',
            '• Mess cleaning',
            '• Door mechanics',
            '• Scoring system',
            '• Day/night cycle',
            '• Save/load game',
            '• Multiple difficulties'
        ];
        
        features.forEach((feature, index) => {
            this.add.text(GAME_WIDTH - 210, 285 + (index * 18), feature, {
                fontSize: '11px',
                color: '#ffffff',
                fontFamily: 'monospace'
            });
        });
    }

    selectDifficulty(difficulty) {
        // Update selected difficulty
        Object.entries(this.difficultyButtons).forEach(([key, button]) => {
            button.setBackgroundColor(key === difficulty ? '#333333' : '#000000');
        });
        this.selectedDifficulty = difficulty;
    }

    selectGameMode(gameMode) {
        // Update selected game mode
        Object.entries(this.gameModeButtons).forEach(([key, data]) => {
            data.button.setBackgroundColor(key === gameMode ? '#333333' : '#000000');
        });
        this.selectedGameMode = gameMode;
    }

    startGame() {
        // Flash effect
        const flash = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xffffff);
        flash.setAlpha(0);
        
        this.tweens.add({
            targets: flash,
            alpha: 0.8,
            duration: 100,
            onComplete: () => {
                this.tweens.add({
                    targets: flash,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => {
                        // Start the original game
                        this.scene.start('OriginalGameScene', {
                            difficulty: this.selectedDifficulty,
                            gameMode: this.selectedGameMode,
                            playerName: this.playerName
                        });
                    }
                });
            }
        });
    }
}
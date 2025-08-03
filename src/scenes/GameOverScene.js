import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../data/Constants';

export default class GameOverScene extends Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    init(data) {
        this.reason = data.reason || 'Game Over';
        this.finalScore = data.score || 0;
        this.daysCompleted = data.days || 0;
        this.catsHelped = data.catsHelped || 0;
    }
    
    create() {
        // Background
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000)
            .setOrigin(0);
        
        // Sad cat animation
        const sadCat = this.add.sprite(GAME_WIDTH / 2, 200, 'cat_felix');
        sadCat.setScale(2);
        sadCat.setTint(0x999999);
        
        // Falling tear animation
        this.time.addEvent({
            delay: 1000,
            callback: () => this.createTear(sadCat.x, sadCat.y + 20),
            loop: true
        });
        
        // Game Over text
        const gameOverText = this.add.text(GAME_WIDTH / 2, 350, 'GAME OVER', {
            fontSize: '64px',
            fontStyle: 'bold',
            color: '#ff6666'
        }).setOrigin(0.5);
        
        // Reason
        this.add.text(GAME_WIDTH / 2, 420, this.reason, {
            fontSize: '24px',
            color: '#cccccc'
        }).setOrigin(0.5);
        
        // Stats container
        this.createStatsDisplay();
        
        // Buttons
        this.createButtons();
        
        // Play sad sound if available
        if (this.sound.get('sad_meow')) {
            this.sound.play('sad_meow');
        }
    }
    
    createTear(x, y) {
        const tear = this.add.circle(x, y, 3, 0x3366ff, 0.8);
        
        this.tweens.add({
            targets: tear,
            y: y + 100,
            alpha: 0,
            duration: 2000,
            onComplete: () => tear.destroy()
        });
    }
    
    createStatsDisplay() {
        const statsY = 500;
        
        // Background for stats
        const statsBg = this.add.graphics();
        statsBg.fillStyle(COLORS.DARK, 0.8);
        statsBg.fillRoundedRect(GAME_WIDTH / 2 - 250, statsY - 30, 500, 200, 15);
        
        // Title
        this.add.text(GAME_WIDTH / 2, statsY, 'Final Statistics', {
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Stats
        const stats = [
            { label: 'Final Score', value: this.finalScore, icon: 'S' },
            { label: 'Days Survived', value: this.daysCompleted, icon: 'D' },
            { label: 'Cats Helped', value: this.catsHelped, icon: 'C' }
        ];
        
        stats.forEach((stat, index) => {
            const y = statsY + 50 + (index * 35);
            
            // Icon
            this.add.text(GAME_WIDTH / 2 - 180, y, stat.icon, {
                fontSize: '24px'
            }).setOrigin(0.5);
            
            // Label
            this.add.text(GAME_WIDTH / 2 - 140, y, stat.label, {
                fontSize: '20px',
                color: '#ffffff'
            }).setOrigin(0, 0.5);
            
            // Value
            this.add.text(GAME_WIDTH / 2 + 140, y, stat.value.toString(), {
                fontSize: '24px',
                fontStyle: 'bold',
                color: '#ffd700'
            }).setOrigin(1, 0.5);
        });
    }
    
    createButtons() {
        const buttonY = 750;
        
        // Try Again button
        const tryAgainBtn = this.add.text(GAME_WIDTH / 2 - 150, buttonY, 'Try Again', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: COLORS.SUCCESS,
            padding: { x: 30, y: 15 }
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true });
        
        tryAgainBtn.on('pointerover', () => {
            tryAgainBtn.setScale(1.1);
            this.tweens.add({
                targets: tryAgainBtn,
                backgroundColor: COLORS.ACCENT,
                duration: 200
            });
        });
        
        tryAgainBtn.on('pointerout', () => {
            tryAgainBtn.setScale(1);
            tryAgainBtn.setBackgroundColor(COLORS.SUCCESS);
        });
        
        tryAgainBtn.on('pointerdown', () => this.restartGame());
        
        // Main Menu button
        const menuBtn = this.add.text(GAME_WIDTH / 2 + 150, buttonY, 'Main Menu', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: COLORS.PRIMARY,
            padding: { x: 30, y: 15 }
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true });
        
        menuBtn.on('pointerover', () => {
            menuBtn.setScale(1.1);
        });
        
        menuBtn.on('pointerout', () => {
            menuBtn.setScale(1);
        });
        
        menuBtn.on('pointerdown', () => this.returnToMenu());
    }
    
    restartGame() {
        // Clear save data for fresh start
        const gameState = this.registry.get('gameState');
        if (gameState) {
            gameState.deleteSave();
        }
        
        // Start new game
        this.scene.stop();
        this.scene.start('GameScene');
        this.scene.start('UIScene');
    }
    
    returnToMenu() {
        this.scene.stop();
        this.scene.start('MainMenuScene');
    }
}
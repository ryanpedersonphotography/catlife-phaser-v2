import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, DEPTHS } from '../data/Constants';

export default class PauseScene extends Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        // Semi-transparent overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        // Pause menu container
        const menuX = GAME_WIDTH / 2;
        const menuY = GAME_HEIGHT / 2;
        
        // Menu background
        const menuBg = this.add.graphics();
        menuBg.fillStyle(COLORS.DARK, 0.95);
        menuBg.fillRoundedRect(menuX - 250, menuY - 200, 500, 400, 20);
        
        // Title
        this.add.text(menuX, menuY - 150, 'PAUSED', {
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Menu options
        const options = [
            { text: 'Resume', y: -50, action: () => this.resumeGame() },
            { text: 'Settings', y: 0, action: () => this.openSettings() },
            { text: 'Save Game', y: 50, action: () => this.saveGame() },
            { text: 'Main Menu', y: 100, action: () => this.returnToMenu() }
        ];
        
        options.forEach(option => {
            this.createMenuButton(menuX, menuY + option.y, option.text, option.action);
        });
        
        // Quick stats
        this.showQuickStats(menuX - 200, menuY - 100);
        
        // ESC to resume hint
        this.add.text(menuX, menuY + 170, 'Press ESC to resume', {
            fontSize: '16px',
            color: '#cccccc'
        }).setOrigin(0.5);
        
        // Listen for ESC key
        this.input.keyboard.on('keydown-ESC', () => this.resumeGame());
    }
    
    createMenuButton(x, y, text, callback) {
        const button = this.add.text(x, y, text, {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: COLORS.PRIMARY,
            padding: { x: 40, y: 10 }
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true });
        
        button.on('pointerover', () => {
            button.setScale(1.1);
            button.setBackgroundColor(COLORS.ACCENT);
        });
        
        button.on('pointerout', () => {
            button.setScale(1);
            button.setBackgroundColor(COLORS.PRIMARY);
        });
        
        button.on('pointerdown', callback);
    }
    
    showQuickStats(x, y) {
        const gameScene = this.scene.get('GameScene');
        if (!gameScene || !gameScene.gameState) return;
        
        const stats = [
            `Day: ${gameScene.gameState.currentDay}`,
            `Score: ${gameScene.gameState.score}`,
            `Energy: ${gameScene.gameState.playerEnergy}/${gameScene.gameState.maxPlayerEnergy}`,
            `Cats: ${gameScene.cats ? gameScene.cats.length : 0}`
        ];
        
        const statsText = this.add.text(x, y, stats.join('\n'), {
            fontSize: '18px',
            color: '#cccccc',
            lineSpacing: 5
        });
    }
    
    resumeGame() {
        const gameScene = this.scene.get('GameScene');
        gameScene.scene.resume();
        this.scene.stop();
    }
    
    openSettings() {
        // TODO: Implement settings scene
        console.log('Settings not implemented yet');
    }
    
    saveGame() {
        const gameScene = this.scene.get('GameScene');
        gameScene.gameState.saveGame();
        
        // Show save confirmation
        const saveText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 100, 'Game Saved!', {
            fontSize: '32px',
            color: '#66ff66',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: saveText,
            alpha: 0,
            y: GAME_HEIGHT - 150,
            duration: 2000,
            onComplete: () => saveText.destroy()
        });
    }
    
    returnToMenu() {
        // Stop all scenes and return to main menu
        this.scene.stop('GameScene');
        this.scene.stop('UIScene');
        this.scene.stop();
        this.scene.start('MainMenuScene');
    }
}
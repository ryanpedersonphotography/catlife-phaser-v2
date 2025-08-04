import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './data/Constants';
import BootScene from './scenes/BootScene';
import PreloadScene from './scenes/PreloadScene';
import MainMenuScene from './scenes/MainMenuScene';
import GameScene from './scenes/GameScene';
import UIScene from './scenes/UIScene';
import PauseScene from './scenes/PauseScene';
import GameOverScene from './scenes/GameOverScene';
import DaySummaryScene from './scenes/DaySummaryScene';

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    dom: {
        createContainer: true
    },
    backgroundColor: '#2d3748',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        min: {
            width: 320,
            height: 180
        },
        max: {
            width: 2048,
            height: 1152
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    input: {
        activePointers: 3, // Support multi-touch
        windowEvents: false
    },
    scene: [
        BootScene,
        PreloadScene,
        MainMenuScene,
        GameScene,
        UIScene,
        PauseScene,
        GameOverScene,
        DaySummaryScene
    ]
};

// Create game instance
window.addEventListener('load', () => {
    console.log('DOM loaded, creating Phaser game');
    console.log('Game config:', config);
    const game = new Phaser.Game(config);
    console.log('Phaser game created:', game);
    
    // Handle focus/blur for pausing
    window.addEventListener('blur', () => {
        const gameScene = game.scene.getScene('GameScene');
        if (gameScene && game.scene.isActive('GameScene')) {
            game.scene.pause('GameScene');
            game.scene.start('PauseScene');
        }
    });
    
    // Prevent right-click context menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // Add game instance to window for debugging
    window.game = game;
});
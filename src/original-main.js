import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './data/Constants';
import BootScene from './scenes/BootScene';
import OriginalPreloadScene from './scenes/OriginalPreloadScene';
import OriginalMainMenuScene from './scenes/OriginalMainMenuScene';
import OriginalGameScene from './scenes/OriginalGameScene';
import UIScene from './scenes/UIScene';
import PauseScene from './scenes/PauseScene';
import GameOverScene from './scenes/GameOverScene';
import DaySummaryScene from './scenes/DaySummaryScene';

// Game configuration for Original CatLife
const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    dom: {
        createContainer: true
    },
    backgroundColor: '#2a2a2a', // Dark background like original
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        min: {
            width: 800,
            height: 600
        },
        max: {
            width: 2048,
            height: 1536
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
        activePointers: 3,
        windowEvents: false
    },
    scene: [
        BootScene,
        OriginalPreloadScene,
        OriginalMainMenuScene,
        OriginalGameScene,
        UIScene,
        PauseScene,
        GameOverScene,
        DaySummaryScene
    ]
};

// Create game instance
window.addEventListener('load', () => {
    const game = new Phaser.Game(config);
    
    // Handle focus/blur for pausing
    window.addEventListener('blur', () => {
        const gameScene = game.scene.getScene('OriginalGameScene');
        if (gameScene && game.scene.isActive('OriginalGameScene')) {
            game.scene.pause('OriginalGameScene');
            game.scene.start('PauseScene');
        }
    });
    
    // Prevent right-click context menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // Add game instance to window for debugging
    window.game = game;
    
    // Add original game specific debug helpers
    window.originalGame = {
        getCats: () => {
            const scene = game.scene.getScene('OriginalGameScene');
            return scene ? scene.cats : {};
        },
        getRooms: () => {
            const scene = game.scene.getScene('OriginalGameScene');
            return scene ? scene.rooms : {};
        },
        getEnergy: () => {
            const scene = game.scene.getScene('OriginalGameScene');
            return scene ? scene.energy : 0;
        },
        getScore: () => {
            const scene = game.scene.getScene('OriginalGameScene');
            return scene ? scene.score : 0;
        },
        toggleDoor: () => {
            const scene = game.scene.getScene('OriginalGameScene');
            if (scene) scene.toggleDoor();
        }
    };
});
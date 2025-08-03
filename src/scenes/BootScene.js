import { Scene } from 'phaser';

export default class BootScene extends Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load any assets needed for the preload scene itself
        // This is typically minimal - just what's needed to show a loading screen
    }

    create() {
        // Set up any global game settings
        this.setupGlobalSettings();
        
        // Move to preload scene
        this.scene.start('PreloadScene');
    }

    setupGlobalSettings() {
        // Enable multi-touch
        this.input.addPointer(3);
        
        // Set up global registry values
        this.registry.set('soundEnabled', true);
        this.registry.set('musicEnabled', true);
        this.registry.set('difficulty', 'normal');
        this.registry.set('currentDay', 1);
        this.registry.set('playerScore', 0);
        this.registry.set('isDoorOpen', false);
        
        // Load saved settings if they exist
        this.loadSettings();
    }

    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('catlife_settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                Object.keys(settings).forEach(key => {
                    this.registry.set(key, settings[key]);
                });
            }
        } catch (e) {
            console.warn('Failed to load settings:', e);
        }
    }
}
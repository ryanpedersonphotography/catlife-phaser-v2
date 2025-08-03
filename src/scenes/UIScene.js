import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, DEPTHS, COLORS } from '../data/Constants';

export default class UIScene extends Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        const gameScene = this.scene.get('GameScene');
        
        // Create UI elements
        this.createTopBar();
        this.createBottomBar();
        this.createCatInfoPanel();
        
        // Listen to events from game scene
        gameScene.events.on('show-cat-info', this.showCatInfo, this);
        gameScene.events.on('update-ui', this.updateUI, this);
        
        // Update UI every frame
        this.time.addEvent({
            delay: 100,
            callback: this.updateUI,
            callbackScope: this,
            loop: true
        });
    }

    createTopBar() {
        // Background
        const topBar = this.add.graphics();
        topBar.fillStyle(COLORS.DARK, 0.9);
        topBar.fillRect(0, 0, GAME_WIDTH, 80);
        topBar.setDepth(DEPTHS.UI_BACKGROUND);
        
        // Time display
        this.timeText = this.add.text(20, 20, 'Day 1 - 7:00 AM', {
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setDepth(DEPTHS.UI_TEXT);
        
        this.periodText = this.add.text(20, 50, 'Morning', {
            fontSize: '18px',
            color: '#cccccc'
        }).setDepth(DEPTHS.UI_TEXT);
        
        // Score
        const scoreIcon = this.add.image(300, 40, 'particle_star').setScale(2);
        this.scoreText = this.add.text(340, 40, 'Score: 0', {
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#ffd700'
        }).setOrigin(0, 0.5).setDepth(DEPTHS.UI_TEXT);
        
        // Energy bar
        this.createEnergyBar(600, 40);
        
        // Buttons
        this.createTopButtons();
    }

    createEnergyBar(x, y) {
        // Energy icon
        this.add.image(x - 30, y, 'icon_heart').setScale(1.5).setDepth(DEPTHS.UI_ELEMENTS);
        
        // Bar background
        const barBg = this.add.graphics();
        barBg.fillStyle(0x333333, 1);
        barBg.fillRoundedRect(x, y - 15, 200, 30, 15);
        barBg.setDepth(DEPTHS.UI_BACKGROUND);
        
        // Bar fill
        this.energyBar = this.add.graphics();
        this.energyBar.setDepth(DEPTHS.UI_ELEMENTS);
        this.updateEnergyBar(100, 100);
        
        // Text
        this.energyText = this.add.text(x + 100, y, '100/100', {
            fontSize: '18px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5).setDepth(DEPTHS.UI_TEXT);
    }

    updateEnergyBar(current, max) {
        const percentage = current / max;
        const width = 196 * percentage;
        
        this.energyBar.clear();
        
        let color;
        if (percentage > 0.6) {
            color = COLORS.SUCCESS;
        } else if (percentage > 0.3) {
            color = COLORS.WARNING;
        } else {
            color = COLORS.DANGER;
        }
        
        this.energyBar.fillStyle(color, 1);
        this.energyBar.fillRoundedRect(602, 27, width, 26, 13);
    }

    createTopButtons() {
        const buttons = [
            { x: 950, icon: 'II', action: () => this.pauseGame() },
            { x: 1020, icon: 'S', action: () => this.openSettings() },
            { x: 1090, icon: 'Save', action: () => this.saveGame() },
            { x: 1160, icon: 'Door', action: () => this.toggleDoor() }
        ];
        
        buttons.forEach(btn => {
            const button = this.add.text(btn.x, 40, btn.icon, {
                fontSize: '32px'
            }).setOrigin(0.5)
              .setInteractive({ useHandCursor: true })
              .setDepth(DEPTHS.UI_ELEMENTS);
            
            button.on('pointerover', () => button.setScale(1.2));
            button.on('pointerout', () => button.setScale(1));
            button.on('pointerdown', btn.action);
        });
    }

    createBottomBar() {
        // Background
        const bottomBar = this.add.graphics();
        bottomBar.fillStyle(COLORS.DARK, 0.9);
        bottomBar.fillRect(0, GAME_HEIGHT - 100, GAME_WIDTH, 100);
        bottomBar.setDepth(DEPTHS.UI_BACKGROUND);
        
        // Action buttons
        const actions = [
            { x: 100, icon: 'icon_food', text: 'Feed', cost: 5 },
            { x: 250, icon: 'icon_water', text: 'Water', cost: 3 },
            { x: 400, icon: 'icon_clean', text: 'Clean', cost: 10 },
            { x: 550, icon: 'icon_play', text: 'Play', cost: 8 },
            { x: 700, icon: 'icon_sleep', text: 'Sleep', cost: 0 }
        ];
        
        actions.forEach(action => {
            this.createActionButton(action.x, GAME_HEIGHT - 50, action);
        });
        
        // Speed controls
        this.createSpeedControls();
    }

    createActionButton(x, y, action) {
        const container = this.add.container(x, y);
        
        // Button background
        const bg = this.add.graphics();
        bg.fillStyle(COLORS.PRIMARY, 0.8);
        bg.fillRoundedRect(-40, -30, 80, 60, 10);
        container.add(bg);
        
        // Icon
        const icon = this.add.image(0, -10, action.icon);
        container.add(icon);
        
        // Text
        const text = this.add.text(0, 15, action.text, {
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);
        container.add(text);
        
        // Cost
        if (action.cost > 0) {
            const cost = this.add.text(30, -25, `-${action.cost}`, {
                fontSize: '12px',
                color: '#ff6666',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            container.add(cost);
        }
        
        container.setDepth(DEPTHS.UI_ELEMENTS);
        container.setSize(80, 60);
        container.setInteractive({ useHandCursor: true });
        
        container.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(COLORS.PRIMARY, 1);
            bg.fillRoundedRect(-45, -35, 90, 70, 10);
        });
        
        container.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(COLORS.PRIMARY, 0.8);
            bg.fillRoundedRect(-40, -30, 80, 60, 10);
        });
    }

    createSpeedControls() {
        const x = GAME_WIDTH - 200;
        const y = GAME_HEIGHT - 50;
        
        this.speedText = this.add.text(x, y, 'Speed: 1x', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5).setDepth(DEPTHS.UI_TEXT);
        
        // Speed buttons
        const speeds = [0.5, 1, 2, 5];
        const buttons = ['<<', '>', '>>', '>>>'];
        
        buttons.forEach((btn, index) => {
            const button = this.add.text(x - 60 + index * 40, y + 25, btn, {
                fontSize: '24px'
            }).setOrigin(0.5)
              .setInteractive({ useHandCursor: true })
              .setDepth(DEPTHS.UI_ELEMENTS);
            
            button.on('pointerdown', () => {
                const gameScene = this.scene.get('GameScene');
                gameScene.timeManager.setSpeed(speeds[index]);
                this.speedText.setText(`Speed: ${speeds[index]}x`);
            });
        });
    }

    createCatInfoPanel() {
        // Hidden by default
        this.catInfoPanel = this.add.container(GAME_WIDTH - 300, 200);
        this.catInfoPanel.setVisible(false);
        this.catInfoPanel.setDepth(DEPTHS.UI_ELEMENTS);
        
        // Panel background
        const panelBg = this.add.image(0, 0, 'ui_panel');
        this.catInfoPanel.add(panelBg);
        
        // Cat sprite
        this.catInfoSprite = this.add.sprite(0, -120, 'cat_gusty');
        this.catInfoPanel.add(this.catInfoSprite);
        
        // Cat name
        this.catInfoName = this.add.text(0, -60, '', {
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.catInfoPanel.add(this.catInfoName);
        
        // Stats
        this.catInfoStats = this.add.text(0, 0, '', {
            fontSize: '16px',
            color: '#ffffff',
            align: 'left',
            lineSpacing: 5
        }).setOrigin(0.5);
        this.catInfoPanel.add(this.catInfoStats);
        
        // Close button
        const closeBtn = this.add.text(120, -160, 'X', {
            fontSize: '24px'
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true });
        
        closeBtn.on('pointerdown', () => {
            this.catInfoPanel.setVisible(false);
        });
        
        this.catInfoPanel.add(closeBtn);
    }

    showCatInfo(catData) {
        this.catInfoPanel.setVisible(true);
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
        const spriteColor = colorMap[catData.color] || 'gray';
        const spriteSheetKey = `cat_${spriteColor}`;
        this.catInfoSprite.setTexture(spriteSheetKey, 0);
        this.catInfoName.setText(catData.name);
        
        const conditionText = catData.specialNeeds && catData.specialNeeds.condition 
            ? catData.specialNeeds.condition 
            : 'Healthy';
            
        const stats = [
            `Age: ${catData.age} years`,
            `Condition: ${conditionText}`,
            `Happiness: ${Math.round(catData.happiness || 50)}%`,
            `Hunger: ${Math.round(catData.hunger || 50)}%`,
            `Energy: ${Math.round(catData.energy || 50)}%`,
            '',
            catData.backstory
        ].join('\n');
        
        this.catInfoStats.setText(stats);
        
        // Animate panel
        this.tweens.add({
            targets: this.catInfoPanel,
            x: GAME_WIDTH - 170,
            duration: 300,
            ease: 'Back.out'
        });
    }

    updateUI() {
        const gameScene = this.scene.get('GameScene');
        if (!gameScene || !gameScene.gameState) return;
        
        // Update time
        const time = gameScene.timeManager.getCurrentTime();
        this.timeText.setText(`Day ${gameScene.gameState.currentDay} - ${time.string}`);
        this.periodText.setText(time.period);
        
        // Update score
        this.scoreText.setText(`Score: ${gameScene.gameState.score}`);
        
        // Update energy
        const energy = gameScene.gameState.playerEnergy;
        const maxEnergy = gameScene.gameState.maxPlayerEnergy;
        this.energyText.setText(`${energy}/${maxEnergy}`);
        this.updateEnergyBar(energy, maxEnergy);
        
        // Flash energy if low
        if (energy < 20) {
            this.energyBar.setAlpha(0.5 + Math.sin(this.time.now / 200) * 0.5);
        } else {
            this.energyBar.setAlpha(1);
        }
    }

    pauseGame() {
        const gameScene = this.scene.get('GameScene');
        gameScene.scene.pause();
        this.scene.launch('PauseScene');
    }

    openSettings() {
        // Settings implementation
        console.log('Settings not implemented yet');
    }

    saveGame() {
        const gameScene = this.scene.get('GameScene');
        gameScene.gameState.saveGame();
        
        // Show save notification
        const notification = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Game Saved!', {
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(DEPTHS.TOOLTIPS);
        
        this.tweens.add({
            targets: notification,
            scale: 1.2,
            alpha: 0,
            duration: 1000,
            onComplete: () => notification.destroy()
        });
    }

    toggleDoor() {
        const gameScene = this.scene.get('GameScene');
        const isDoorOpen = !this.registry.get('isDoorOpen');
        this.registry.set('isDoorOpen', isDoorOpen);
        
        // Visual feedback
        const doorStatus = isDoorOpen ? 'Door Opened!' : 'Door Closed!';
        const notification = this.add.text(GAME_WIDTH / 2, 150, doorStatus, {
            fontSize: '32px',
            color: isDoorOpen ? '#48bb78' : '#f56565',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(DEPTHS.UI_TEXT);
        
        this.tweens.add({
            targets: notification,
            y: 100,
            alpha: 0,
            duration: 2000,
            onComplete: () => notification.destroy()
        });
    }
}
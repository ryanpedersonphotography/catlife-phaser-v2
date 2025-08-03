import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../data/Constants';

export default class DaySummaryScene extends Scene {
    constructor() {
        super({ key: 'DaySummaryScene' });
    }
    
    init(data) {
        this.day = data.day || 1;
        this.dayScore = data.score || 0;
        this.stats = data.stats || {};
    }
    
    create() {
        // Semi-transparent overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.8);
        overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        // Main container
        const container = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2);
        
        // Background panel
        const panel = this.add.graphics();
        panel.fillStyle(COLORS.DARK, 0.95);
        panel.fillRoundedRect(-350, -300, 700, 600, 20);
        container.add(panel);
        
        // Stars background animation
        this.createStarsAnimation();
        
        // Title
        const title = this.add.text(0, -250, `Day ${this.day} Complete!`, {
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#ffd700'
        }).setOrigin(0.5);
        container.add(title);
        
        // Score display with animation
        this.createScoreDisplay(container);
        
        // Stats breakdown
        this.createStatsBreakdown(container);
        
        // Rating
        this.createRating(container);
        
        // Continue button
        this.createContinueButton(container);
        
        // Play completion sound
        if (this.sound.get('day_complete')) {
            this.sound.play('day_complete');
        }
    }
    
    createStarsAnimation() {
        for (let i = 0; i < 20; i++) {
            const star = this.add.image(
                Phaser.Math.Between(100, GAME_WIDTH - 100),
                Phaser.Math.Between(100, GAME_HEIGHT - 100),
                'particle_star'
            );
            star.setScale(Phaser.Math.FloatBetween(0.3, 0.8));
            star.setAlpha(0);
            
            this.tweens.add({
                targets: star,
                alpha: { from: 0, to: 1 },
                scale: star.scale * 1.5,
                rotation: Math.PI * 2,
                duration: Phaser.Math.Between(2000, 4000),
                delay: i * 100,
                yoyo: true,
                repeat: -1
            });
        }
    }
    
    createScoreDisplay(container) {
        // Score label
        const scoreLabel = this.add.text(0, -150, 'Day Score:', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);
        container.add(scoreLabel);
        
        // Animated score counter
        const scoreText = this.add.text(0, -100, '0', {
            fontSize: '64px',
            fontStyle: 'bold',
            color: '#ffd700'
        }).setOrigin(0.5);
        container.add(scoreText);
        
        // Animate score counting up
        const scoreCounter = { value: 0 };
        this.tweens.add({
            targets: scoreCounter,
            value: this.dayScore,
            duration: 2000,
            ease: 'Cubic.out',
            onUpdate: () => {
                scoreText.setText(Math.round(scoreCounter.value));
            },
            onComplete: () => {
                // Pulse effect when complete
                this.tweens.add({
                    targets: scoreText,
                    scale: 1.2,
                    duration: 300,
                    yoyo: true
                });
            }
        });
    }
    
    createStatsBreakdown(container) {
        const startY = -20;
        
        // Stats title
        const statsTitle = this.add.text(0, startY, 'Daily Report', {
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        container.add(statsTitle);
        
        // Individual stats
        const statItems = [
            { label: 'Cats Fed', value: this.stats.catsFed || 0, icon: '🍽️', points: 10 },
            { label: 'Water Given', value: this.stats.catsWatered || 0, icon: '💧', points: 5 },
            { label: 'Litter Boxes Cleaned', value: this.stats.litterBoxesCleaned || 0, icon: '🧹', points: 15 },
            { label: 'Play Sessions', value: this.stats.catsPlayed || 0, icon: '🎾', points: 8 },
            { label: 'Medications Given', value: this.stats.medicationsGiven || 0, icon: '💊', points: 25 },
            { label: 'Special Needs Met', value: this.stats.specialNeedsMet || 0, icon: '⭐', points: 30 },
            { label: 'Accidents', value: this.stats.accidents || 0, icon: '❌', points: -50 }
        ];
        
        statItems.forEach((stat, index) => {
            const y = startY + 40 + (index * 30);
            const points = stat.value * stat.points;
            
            // Icon
            const icon = this.add.text(-250, y, stat.icon, {
                fontSize: '24px'
            }).setOrigin(0.5);
            container.add(icon);
            
            // Label
            const label = this.add.text(-210, y, stat.label, {
                fontSize: '18px',
                color: '#ffffff'
            }).setOrigin(0, 0.5);
            container.add(label);
            
            // Value
            const value = this.add.text(100, y, `x${stat.value}`, {
                fontSize: '18px',
                color: '#cccccc'
            }).setOrigin(1, 0.5);
            container.add(value);
            
            // Points
            const pointsText = this.add.text(250, y, points > 0 ? `+${points}` : points.toString(), {
                fontSize: '18px',
                fontStyle: 'bold',
                color: points >= 0 ? '#66ff66' : '#ff6666'
            }).setOrigin(1, 0.5);
            container.add(pointsText);
            
            // Animate items appearing
            icon.setAlpha(0);
            label.setAlpha(0);
            value.setAlpha(0);
            pointsText.setAlpha(0);
            
            this.tweens.add({
                targets: [icon, label, value, pointsText],
                alpha: 1,
                duration: 500,
                delay: 500 + (index * 100)
            });
        });
    }
    
    createRating(container) {
        const rating = this.getRating();
        const ratingY = 180;
        
        // Rating text
        const ratingText = this.add.text(0, ratingY, rating.text, {
            fontSize: '32px',
            fontStyle: 'bold',
            color: rating.color
        }).setOrigin(0.5);
        container.add(ratingText);
        
        // Stars
        const starY = ratingY + 40;
        for (let i = 0; i < 5; i++) {
            const star = this.add.image(-60 + (i * 30), starY, 'particle_star');
            star.setScale(0.8);
            star.setTint(i < rating.stars ? 0xffd700 : 0x333333);
            container.add(star);
            
            // Animate stars
            if (i < rating.stars) {
                this.tweens.add({
                    targets: star,
                    scale: 1,
                    duration: 300,
                    delay: 2500 + (i * 100),
                    ease: 'Back.out'
                });
            }
        }
    }
    
    getRating() {
        const percentage = (this.dayScore / 500) * 100; // Assuming 500 is perfect score
        
        if (percentage >= 90) {
            return { text: 'Perfect!', stars: 5, color: '#ffd700' };
        } else if (percentage >= 75) {
            return { text: 'Excellent!', stars: 4, color: '#66ff66' };
        } else if (percentage >= 60) {
            return { text: 'Good Job!', stars: 3, color: '#4169e1' };
        } else if (percentage >= 40) {
            return { text: 'Keep Trying!', stars: 2, color: '#ffaa00' };
        } else {
            return { text: 'Rough Day...', stars: 1, color: '#ff6666' };
        }
    }
    
    createContinueButton(container) {
        const button = this.add.text(0, 250, 'Continue to Next Day', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: COLORS.SUCCESS,
            padding: { x: 40, y: 15 }
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true });
        
        container.add(button);
        
        // Button animations
        button.setAlpha(0);
        this.tweens.add({
            targets: button,
            alpha: 1,
            y: 240,
            duration: 500,
            delay: 3000,
            ease: 'Back.out'
        });
        
        button.on('pointerover', () => {
            button.setScale(1.1);
            this.tweens.add({
                targets: button,
                backgroundColor: COLORS.ACCENT,
                duration: 200
            });
        });
        
        button.on('pointerout', () => {
            button.setScale(1);
            button.setBackgroundColor(COLORS.SUCCESS);
        });
        
        button.on('pointerdown', () => this.continueGame());
        
        // Also allow clicking anywhere after delay
        this.time.delayedCall(3500, () => {
            this.input.on('pointerdown', () => this.continueGame());
        });
    }
    
    continueGame() {
        // Resume game scene
        const gameScene = this.scene.get('GameScene');
        gameScene.scene.resume();
        
        // Stop this scene
        this.scene.stop();
    }
}
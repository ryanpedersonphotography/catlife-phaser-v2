import { GameObjects } from 'phaser';
import { DEPTHS } from '../data/Constants';

export default class FoodBowl extends GameObjects.Container {
    constructor(scene, x, y, type = 'food') {
        super(scene, x, y);
        
        this.scene = scene;
        this.type = type; // 'food' or 'water'
        this.capacity = 100;
        this.currentAmount = 0;
        
        // Create visuals
        this.createBowl();
        
        // Container is automatically added to scene when created, no need to add again
        this.setDepth(DEPTHS.OBJECTS);
        
        // Make interactive
        this.setSize(64, 64);
        this.setInteractive({ useHandCursor: true });
    }
    
    createBowl() {
        // Bowl sprite - create without adding to scene
        this.bowlSprite = new Phaser.GameObjects.Image(this.scene, 0, 0, 'food_bowl_empty');
        this.add(this.bowlSprite);
        
        // Amount indicator - create without adding to scene
        this.amountText = new Phaser.GameObjects.Text(this.scene, 0, -35, '0%', {
            fontSize: '14px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.add(this.amountText);
        
        // Type icon - create without adding to scene
        const icon = this.type === 'water' ? 'W' : 'F';
        this.typeIcon = new Phaser.GameObjects.Text(this.scene, 25, -25, icon, {
            fontSize: '20px'
        }).setOrigin(0.5);
        this.add(this.typeIcon);
    }
    
    fill() {
        this.currentAmount = this.capacity;
        this.updateDisplay();
        
        // Visual feedback
        this.scene.tweens.add({
            targets: this.bowlSprite,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 200,
            yoyo: true,
            ease: 'Bounce.out'
        });
        
        // Particle effect
        for (let i = 0; i < 5; i++) {
            const particle = this.scene.add.image(this.x, this.y, 'particle_sparkle')
                .setScale(0.5);
            
            this.scene.tweens.add({
                targets: particle,
                x: this.x + Phaser.Math.Between(-30, 30),
                y: this.y + Phaser.Math.Between(-30, 30),
                alpha: 0,
                scale: 0,
                duration: 500,
                onComplete: () => particle.destroy()
            });
        }
    }
    
    consume(amount = 10) {
        this.currentAmount = Math.max(0, this.currentAmount - amount);
        this.updateDisplay();
    }
    
    isEmpty() {
        return this.currentAmount <= 0;
    }
    
    updateDisplay() {
        const percentage = Math.round((this.currentAmount / this.capacity) * 100);
        this.amountText.setText(`${percentage}%`);
        
        // Update sprite
        if (this.currentAmount > 0) {
            this.bowlSprite.setTexture('food_bowl_full');
            
            // Tint based on amount
            if (percentage < 30) {
                this.bowlSprite.setTint(0xffcccc);
            } else {
                this.bowlSprite.clearTint();
            }
        } else {
            this.bowlSprite.setTexture('food_bowl_empty');
            this.bowlSprite.clearTint();
        }
        
        // Update text color
        if (percentage < 30) {
            this.amountText.setColor('#ff6666');
        } else if (percentage < 60) {
            this.amountText.setColor('#ffaa00');
        } else {
            this.amountText.setColor('#66ff66');
        }
    }
}
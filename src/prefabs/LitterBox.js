import { GameObjects } from 'phaser';
import { DEPTHS } from '../data/Constants';

export default class LitterBox extends GameObjects.Container {
    constructor(scene, x, y, roomId) {
        super(scene, x, y);
        
        this.scene = scene;
        this.roomId = roomId;
        this.capacity = 5;
        this.currentUses = 0;
        this.cleanliness = 100;
        
        // Create visuals
        this.createLitterBox();
        
        // Add container to scene properly
        this.scene.add.existing(this);
        this.setDepth(DEPTHS.OBJECTS);
        
        // Make interactive
        this.setSize(64, 64);
        this.setInteractive({ useHandCursor: true });
    }
    
    createLitterBox() {
        // Litter box sprite - create without adding to scene
        this.boxSprite = new Phaser.GameObjects.Image(this.scene, 0, 0, 'litter_box_clean');
        this.add(this.boxSprite);
        
        // Cleanliness indicator - create without adding to scene
        this.cleanlinessText = new Phaser.GameObjects.Text(this.scene, 0, -35, '100%', {
            fontSize: '14px',
            fontStyle: 'bold',
            color: '#66ff66',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.add(this.cleanlinessText);
        
        // Room label - create without adding to scene
        this.roomLabel = new Phaser.GameObjects.Text(this.scene, 0, 35, this.roomId, {
            fontSize: '12px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.add(this.roomLabel);
    }
    
    use() {
        this.currentUses++;
        this.cleanliness = Math.max(0, this.cleanliness - 20);
        this.updateDisplay();
        
        // Add mess visual - create without adding to scene
        const mess = new Phaser.GameObjects.Graphics(this.scene);
        mess.fillStyle(0x8B4513, 0.5);
        mess.fillCircle(
            Phaser.Math.Between(-15, 15),
            Phaser.Math.Between(-10, 10),
            3
        );
        this.add(mess);
    }
    
    clean() {
        this.currentUses = 0;
        this.cleanliness = 100;
        
        // Remove all mess visuals
        this.removeAll();
        this.createLitterBox();
        this.updateDisplay();
        
        // Visual feedback
        this.scene.tweens.add({
            targets: this,
            angle: { from: -5, to: 5 },
            duration: 100,
            yoyo: true,
            repeat: 3,
            onComplete: () => this.angle = 0
        });
        
        // Sparkle effect
        for (let i = 0; i < 8; i++) {
            const sparkle = this.scene.add.image(this.x, this.y, 'particle_sparkle')
                .setScale(0.3);
            
            const angle = (i / 8) * Math.PI * 2;
            this.scene.tweens.add({
                targets: sparkle,
                x: this.x + Math.cos(angle) * 40,
                y: this.y + Math.sin(angle) * 40,
                alpha: 0,
                scale: 0,
                duration: 600,
                onComplete: () => sparkle.destroy()
            });
        }
    }
    
    isFull() {
        return this.currentUses >= this.capacity;
    }
    
    isDirty() {
        return this.cleanliness < 50;
    }
    
    updateDisplay() {
        this.cleanlinessText.setText(`${Math.round(this.cleanliness)}%`);
        
        // Update sprite and colors based on cleanliness
        if (this.cleanliness > 70) {
            this.boxSprite.setTexture('litter_box_clean');
            this.cleanlinessText.setColor('#66ff66');
        } else if (this.cleanliness > 30) {
            this.boxSprite.setTexture('litter_box_dirty');
            this.cleanlinessText.setColor('#ffaa00');
        } else {
            this.boxSprite.setTexture('litter_box_dirty');
            this.boxSprite.setTint(0xcccccc);
            this.cleanlinessText.setColor('#ff6666');
        }
        
        // Add warning if full
        if (this.isFull()) {
            if (!this.fullWarning) {
                this.fullWarning = new Phaser.GameObjects.Text(this.scene, 0, 0, '❌', {
                    fontSize: '24px'
                }).setOrigin(0.5);
                this.add(this.fullWarning);
            }
        } else if (this.fullWarning) {
            this.fullWarning.destroy();
            this.fullWarning = null;
        }
    }
}
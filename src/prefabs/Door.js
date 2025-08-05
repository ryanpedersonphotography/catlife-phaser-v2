import { GameObjects } from 'phaser';
import { DEPTHS } from '../data/Constants';

export default class Door extends GameObjects.Container {
    constructor(scene, x, y, width, height, fromRoom, toRoom, orientation = 'horizontal') {
        super(scene, x, y);
        
        this.fromRoom = fromRoom;
        this.toRoom = toRoom;
        this.orientation = orientation;
        this.doorWidth = width;
        this.doorHeight = height;
        this.isOpen = true; // Doors are open by default (except outside door)
        
        // Special case for outside door
        if (fromRoom === 'outside' || toRoom === 'outside') {
            this.isOpen = scene.registry.get('isDoorOpen') || false;
        }
        
        // Create door frame
        this.frame = scene.add.rectangle(0, 0, width + 6, height + 6, 0x654321, 1);
        this.add(this.frame);
        
        // Create door panel
        this.panel = scene.add.rectangle(0, 0, width, height, 0x8B4513, 1);
        this.add(this.panel);
        
        // Create door knob
        const knobX = orientation === 'horizontal' ? width * 0.3 : 0;
        const knobY = orientation === 'vertical' ? height * 0.3 : 0;
        this.knob = scene.add.circle(knobX, knobY, 3, 0xFFD700, 1);
        this.add(this.knob);
        
        // Make door interactive
        this.setSize(width + 20, height + 20);
        this.setInteractive({ useHandCursor: true });
        
        // Door interaction
        this.on('pointerdown', this.toggleDoor, this);
        this.on('pointerover', this.onHover, this);
        this.on('pointerout', this.onHoverEnd, this);
        
        scene.add.existing(this);
        this.setDepth(DEPTHS.ROOMS + 2);
        
        // Update visual state
        this.updateVisual();
        
        // Add to scene's doors array
        if (!scene.doors) {
            scene.doors = [];
        }
        scene.doors.push(this);
    }
    
    toggleDoor() {
        // Special handling for outside door
        if (this.fromRoom === 'outside' || this.toRoom === 'outside') {
            const isDoorOpen = !this.scene.registry.get('isDoorOpen');
            this.scene.registry.set('isDoorOpen', isDoorOpen);
            this.isOpen = isDoorOpen;
            
            // Update all outside doors
            this.scene.doors.forEach(door => {
                if (door.fromRoom === 'outside' || door.toRoom === 'outside') {
                    door.isOpen = isDoorOpen;
                    door.updateVisual();
                }
            });
            
            // Show notification
            const status = isDoorOpen ? 'Outside Door Opened!' : 'Outside Door Closed!';
            this.scene.showNotification(status, isDoorOpen ? 0x48bb78 : 0xf56565);
        } else {
            // Regular doors toggle individually
            this.isOpen = !this.isOpen;
            this.updateVisual();
            
            const status = this.isOpen ? 'Door Opened!' : 'Door Closed!';
            this.scene.showNotification(status, this.isOpen ? 0x48bb78 : 0xf56565);
        }
        
        // Play door sound if available
        if (this.scene.sound && this.scene.sound.play) {
            // this.scene.sound.play('door_sound');
        }
    }
    
    updateVisual() {
        if (this.isOpen) {
            // Open door - make it semi-transparent and greenish
            this.panel.setFillStyle(0x90EE90, 0.3);
            this.frame.setFillStyle(0x654321, 0.5);
            this.knob.setVisible(false);
        } else {
            // Closed door - solid brown
            this.panel.setFillStyle(0x8B4513, 1);
            this.frame.setFillStyle(0x654321, 1);
            this.knob.setVisible(true);
        }
    }
    
    onHover() {
        this.setScale(1.1);
        
        // Show tooltip
        const text = this.isOpen ? 'Click to close door' : 'Click to open door';
        const tooltip = this.scene.add.text(this.x, this.y - 30, text, {
            fontSize: '14px',
            backgroundColor: '#000000',
            padding: { x: 5, y: 5 }
        }).setOrigin(0.5).setDepth(DEPTHS.TOOLTIPS);
        
        this.tooltip = tooltip;
    }
    
    onHoverEnd() {
        this.setScale(1);
        
        if (this.tooltip) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
    }
    
    checkAccess(fromRoomId, toRoomId) {
        // Check if this door connects the specified rooms
        const connects = (this.fromRoom === fromRoomId && this.toRoom === toRoomId) ||
                        (this.fromRoom === toRoomId && this.toRoom === fromRoomId);
        
        return connects && this.isOpen;
    }
    
    getBlockedMessage() {
        if (this.fromRoom === 'outside' || this.toRoom === 'outside') {
            return 'The outside door is closed!';
        }
        return 'This door is closed!';
    }
}
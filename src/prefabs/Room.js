import { GameObjects } from 'phaser';
import { DEPTHS } from '../data/Constants';

export default class Room extends GameObjects.Container {
    constructor(scene, roomData) {
        super(scene, roomData.x, roomData.y);
        
        this.scene = scene;
        this.id = roomData.id;
        this.roomData = roomData;
        this.width = roomData.width;
        this.height = roomData.height;
        
        // Create room visuals
        this.createRoom();
        
        // Add container to scene properly
        this.scene.add.existing(this);
        this.setDepth(DEPTHS.ROOMS);
    }
    
    createRoom() {
        // Room background - create without adding to scene
        this.background = new Phaser.GameObjects.Image(this.scene, 0, 0, `room_${this.id}`)
            .setOrigin(0);
        this.add(this.background);
        
        // Room label - create without adding to scene
        this.label = new Phaser.GameObjects.Text(
            this.scene,
            this.width / 2,
            20,
            this.roomData.name,
            {
                fontSize: '20px',
                fontStyle: 'bold',
                color: '#000000',
                backgroundColor: '#ffffff',
                padding: { x: 10, y: 5 }
            }
        ).setOrigin(0.5);
        this.add(this.label);
        
        // Add decorations based on room type
        this.addDecorations();
        
        // Make interactive for debugging
        this.background.setInteractive();
        this.background.on('pointerdown', () => {
            console.log(`Clicked room: ${this.id}`);
        });
    }
    
    addDecorations() {
        // Add room-specific decorations
        switch(this.id) {
            case 'kitchen':
                this.addKitchenDecorations();
                break;
            case 'livingRoom':
                this.addLivingRoomDecorations();
                break;
            case 'bedroom':
                this.addBedroomDecorations();
                break;
            case 'bathroom':
                this.addBathroomDecorations();
                break;
            case 'outside':
                this.addOutsideDecorations();
                break;
        }
    }
    
    addKitchenDecorations() {
        // Counter - create without adding to scene
        const counter = new Phaser.GameObjects.Graphics(this.scene);
        counter.fillStyle(0x8B6B47, 1);
        counter.fillRect(10, 100, this.width - 20, 30);
        this.add(counter);
        
        // Sink - create without adding to scene
        const sink = new Phaser.GameObjects.Graphics(this.scene);
        sink.fillStyle(0xC0C0C0, 1);
        sink.fillCircle(100, 115, 20);
        sink.fillStyle(0x808080, 1);
        sink.fillCircle(100, 115, 15);
        this.add(sink);
    }
    
    addLivingRoomDecorations() {
        // Sofa - create without adding to scene
        const sofa = new Phaser.GameObjects.Graphics(this.scene);
        sofa.fillStyle(0x4169E1, 1);
        sofa.fillRoundedRect(50, 100, 200, 80, 10);
        sofa.fillStyle(0x6495ED, 1);
        sofa.fillRoundedRect(60, 110, 180, 60, 5);
        this.add(sofa);
        
        // TV - create without adding to scene
        const tv = new Phaser.GameObjects.Graphics(this.scene);
        tv.fillStyle(0x000000, 1);
        tv.fillRect(300, 50, 80, 60);
        tv.fillStyle(0x333333, 1);
        tv.fillRect(305, 55, 70, 50);
        this.add(tv);
    }
    
    addBedroomDecorations() {
        // Beds (visual only, actual cat beds are separate objects) - create without adding to scene
        const bed1 = new Phaser.GameObjects.Graphics(this.scene);
        bed1.fillStyle(0x8B4513, 1);
        bed1.fillRoundedRect(100, 100, 150, 80, 10);
        bed1.fillStyle(0xFFFFFF, 1);
        bed1.fillRoundedRect(110, 110, 130, 60, 5);
        this.add(bed1);
        
        // Nightstand - create without adding to scene
        const nightstand = new Phaser.GameObjects.Graphics(this.scene);
        nightstand.fillStyle(0x654321, 1);
        nightstand.fillRect(260, 120, 40, 40);
        this.add(nightstand);
    }
    
    addBathroomDecorations() {
        // Toilet - create without adding to scene
        const toilet = new Phaser.GameObjects.Graphics(this.scene);
        toilet.fillStyle(0xFFFFFF, 1);
        toilet.fillEllipse(250, 100, 40, 50);
        toilet.fillRect(230, 100, 40, 40);
        this.add(toilet);
        
        // Sink - create without adding to scene
        const sink = new Phaser.GameObjects.Graphics(this.scene);
        sink.fillStyle(0xFFFFFF, 1);
        sink.fillRoundedRect(50, 50, 60, 40, 10);
        sink.fillStyle(0xC0C0C0, 1);
        sink.fillCircle(80, 70, 15);
        this.add(sink);
    }
    
    addOutsideDecorations() {
        // Trees
        for (let i = 0; i < 3; i++) {
            const tree = new Phaser.GameObjects.Graphics(this.scene);
            const x = 50 + i * 80;
            const y = 100 + Math.random() * 50;
            
            // Trunk
            tree.fillStyle(0x8B4513, 1);
            tree.fillRect(x - 10, y, 20, 40);
            
            // Leaves
            tree.fillStyle(0x228B22, 1);
            tree.fillCircle(x, y - 20, 30);
            tree.fillCircle(x - 15, y - 10, 25);
            tree.fillCircle(x + 15, y - 10, 25);
            
            this.add(tree);
        }
        
        // Flowers
        for (let i = 0; i < 10; i++) {
            const flower = new Phaser.GameObjects.Graphics(this.scene);
            const x = Math.random() * this.width;
            const y = 200 + Math.random() * (this.height - 250);
            
            flower.fillStyle(0xFF69B4, 1);
            flower.fillCircle(x, y, 5);
            flower.fillStyle(0xFFFF00, 1);
            flower.fillCircle(x, y, 2);
            
            this.add(flower);
        }
    }
    
    contains(x, y) {
        return x >= this.x && x <= this.x + this.width &&
               y >= this.y && y <= this.y + this.height;
    }
    
    highlight(active) {
        if (active) {
            this.background.setTint(0xccffcc);
        } else {
            this.background.clearTint();
        }
    }
}
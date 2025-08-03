import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, DEPTHS, ROOM_TYPES } from '../data/Constants';
import { ROOM_LAYOUT } from '../data/RoomLayout';
import { getAllCats } from '../data/CatDatabase';
import Cat from '../prefabs/Cat';
import Room from '../prefabs/Room';
import LitterBox from '../prefabs/LitterBox';
import FoodBowl from '../prefabs/FoodBowl';
import GameState from '../systems/GameState';
import TimeManager from '../systems/TimeManager';
import NeedManager from '../systems/NeedManager';

export default class GameScene extends Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.isNewGame = data.newGame || false;
        this.loadSave = data.loadSave || false;
    }

    create() {
        // Initialize systems
        this.gameState = new GameState(this);
        this.timeManager = new TimeManager(this);
        this.needManager = new NeedManager(this);
        
        // Game containers
        this.rooms = {};
        this.cats = [];
        this.objects = [];
        this.foodBowls = [];
        this.waterBowls = [];
        this.litterBoxes = [];
        this.toys = [];
        
        // Create game world
        this.createBackground();
        this.createRooms();
        this.createObjects();
        this.createCats();
        
        // Set up UI (runs in parallel scene)
        this.scene.launch('UIScene');
        
        // Set up input
        this.setupInput();
        
        // Load saved cat states if any
        const savedCatStates = this.gameState.loadGame();
        if (savedCatStates) {
            this.loadCatStates(savedCatStates);
        }
        
        // Show welcome message
        this.showNotification(`Welcome to Day ${this.gameState.currentDay}!`);
    }

    update(time, delta) {
        // Update cats
        if (this.cats) {
            this.cats.forEach(cat => cat.update(time, delta));
        }
        
        // Update UI
        this.events.emit('update-ui');
    }

    createRooms() {
        this.rooms = {};
        
        Object.entries(ROOM_LAYOUT).forEach(([roomId, roomData]) => {
            const room = new Room(this, roomData);
            this.rooms[roomId] = room;
        });
    }

    createObjects() {
        this.litterBoxes = [];
        this.foodBowls = [];
        this.waterBowls = [];
        this.toys = [];
        
        // Create objects based on room layout
        Object.entries(ROOM_LAYOUT).forEach(([roomId, roomData]) => {
            if (roomData.objects.litterBoxes) {
                roomData.objects.litterBoxes.forEach(pos => {
                    const litterBox = new LitterBox(this, pos.x, pos.y, roomId);
                    this.litterBoxes.push(litterBox);
                });
            }
            
            if (roomData.objects.foodBowls) {
                roomData.objects.foodBowls.forEach(pos => {
                    const foodBowl = new FoodBowl(this, pos.x, pos.y, 'food');
                    this.foodBowls.push(foodBowl);
                });
            }
            
            if (roomData.objects.waterBowls) {
                roomData.objects.waterBowls.forEach(pos => {
                    const waterBowl = new FoodBowl(this, pos.x, pos.y, 'water');
                    this.waterBowls.push(waterBowl);
                });
            }
            
            if (roomData.objects.toys) {
                roomData.objects.toys.forEach(pos => {
                    const toy = this.add.image(pos.x, pos.y, 'toy_ball')
                        .setInteractive()
                        .setDepth(DEPTHS.OBJECTS);
                    this.toys.push(toy);
                });
            }
        });
    }

    createCats() {
        this.cats = [];
        const allCats = getAllCats();
        
        allCats.forEach(catData => {
            const cat = new Cat(this, catData);
            this.cats.push(cat);
            
            // Place cat in their favorite room
            const room = this.rooms[catData.preferences.favoriteRoom];
            if (room) {
                cat.setRoom(room);
            }
        });
    }

    setupInput() {
        // Click on objects
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            if (gameObject instanceof FoodBowl) {
                this.handleFoodBowlClick(gameObject);
            } else if (gameObject instanceof LitterBox) {
                this.handleLitterBoxClick(gameObject);
            } else if (gameObject instanceof Cat) {
                this.handleCatClick(gameObject);
            }
        });
        
        // Drag cats
        this.input.on('dragstart', (pointer, gameObject) => {
            if (gameObject instanceof Cat) {
                gameObject.startDrag();
            }
        });
        
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject instanceof Cat) {
                gameObject.drag(dragX, dragY);
            }
        });
        
        this.input.on('dragend', (pointer, gameObject) => {
            if (gameObject instanceof Cat) {
                gameObject.endDrag();
            }
        });
    }

    handleFoodBowlClick(bowl) {
        if (bowl.isEmpty()) {
            // Check if player has energy
            const energyCost = 5;
            if (this.gameState.playerEnergy >= energyCost) {
                bowl.fill();
                this.gameState.useEnergy(energyCost);
                this.gameState.score += 5;
                this.gameState.trackAction('feed');
                this.showNotification('Bowl filled! +5 points');
            } else {
                this.showNotification('Not enough energy!');
            }
        }
    }

    handleLitterBoxClick(litterBox) {
        if (litterBox.isDirty()) {
            const energyCost = 10;
            if (this.gameState.playerEnergy >= energyCost) {
                litterBox.clean();
                this.gameState.useEnergy(energyCost);
                this.gameState.score += 10;
                this.gameState.trackAction('clean');
                this.showNotification('Litter box cleaned! +10 points');
            } else {
                this.showNotification('Not enough energy!');
            }
        }
    }

    handleCatClick(cat) {
        // Show cat info panel
        this.events.emit('show-cat-info', cat.data);
    }

    showNotification(text) {
        const notification = this.add.text(GAME_WIDTH / 2, 100, text, {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setDepth(DEPTHS.UI_TEXT);
        
        this.tweens.add({
            targets: notification,
            y: 50,
            alpha: 0,
            duration: 2000,
            onComplete: () => notification.destroy()
        });
    }

    checkGameState() {
        // Check if any cat is critically unhappy
        const unhappyCats = this.cats.filter(cat => cat.stats.happiness < 20);
        if (unhappyCats.length >= 3) {
            this.gameOver('Too many unhappy cats!');
        }
        
        // Check player energy
        if (this.gameState.playerEnergy <= 0) {
            this.gameOver('You collapsed from exhaustion!');
        }
        
        // Check score
        if (this.gameState.score < -50) {
            this.gameOver('Your score is too low!');
        }
    }

    gameOver(reason) {
        this.scene.pause();
        this.scene.stop('UIScene');
        this.scene.start('GameOverScene', {
            reason: reason,
            score: this.gameState.totalScore,
            days: this.gameState.currentDay,
            catsHelped: this.gameState.catsAdopted
        });
    }

    endDay() {
        this.timeManager.stop();
        
        // Calculate day score
        const dayStats = this.calculateDayStats();
        
        // Show day summary
        this.scene.pause();
        this.scene.launch('DaySummaryScene', {
            day: this.gameState.currentDay,
            stats: dayStats,
            onContinue: () => this.startNewDay()
        });
    }

    calculateDayStats() {
        let happyCats = 0;
        let fedCats = 0;
        let cleanCats = 0;
        
        this.cats.forEach(cat => {
            if (cat.happiness > 70) happyCats++;
            if (cat.hunger < 30) fedCats++;
            if (cat.cleanliness > 70) cleanCats++;
        });
        
        return {
            happyCats,
            fedCats,
            cleanCats,
            totalCats: this.cats.length,
            dayScore: (happyCats * 10) + (fedCats * 5) + (cleanCats * 5)
        };
    }

    startNewDay() {
        this.gameState.currentDay++;
        this.gameState.playerEnergy = 100;
        this.timeManager.reset();
        this.timeManager.start();
        
        // Reset some cat stats
        this.cats.forEach(cat => {
            cat.dailyReset();
        });
        
        this.scene.resume();
        this.scene.resume('UIScene');
    }

    // Helper methods for other systems
    getRoomAt(x, y) {
        for (const room of Object.values(this.rooms)) {
            if (room.contains(x, y)) {
                return room;
            }
        }
        return null;
    }

    getCatsInRoom(roomId) {
        return this.cats.filter(cat => cat.currentRoom?.id === roomId);
    }

    getNearestObject(x, y, type) {
        let objects;
        switch(type) {
            case 'food':
                objects = this.foodBowls;
                break;
            case 'water':
                objects = this.waterBowls;
                break;
            case 'litter':
                objects = this.litterBoxes;
                break;
            case 'toy':
                objects = this.toys;
                break;
            default:
                return null;
        }
        
        let nearest = null;
        let minDistance = Infinity;
        
        objects.forEach(obj => {
            const distance = Phaser.Math.Distance.Between(x, y, obj.x, obj.y);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = obj;
            }
        });
        
        return nearest;
    }
    
    createBackground() {
        // Create sky gradient
        const graphics = this.add.graphics();
        
        // Sky gradient
        const skyColors = [0x87CEEB, 0xE0F6FF];
        for (let i = 0; i < GAME_HEIGHT; i++) {
            const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                Phaser.Display.Color.ValueToColor(skyColors[0]),
                Phaser.Display.Color.ValueToColor(skyColors[1]),
                GAME_HEIGHT,
                i
            );
            graphics.fillStyle(color.color);
            graphics.fillRect(0, i, GAME_WIDTH, 1);
        }
        
        // Lighting overlay (will be tinted by TimeManager)
        this.lightingOverlay = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0)
            .setOrigin(0)
            .setDepth(DEPTHS.LIGHTING);
    }
    
    loadCatStates(savedStates) {
        savedStates.forEach(savedCat => {
            const cat = this.cats.find(c => c.id === savedCat.id);
            if (cat) {
                // Restore stats
                Object.assign(cat.stats, savedCat.stats);
                
                // Restore room
                if (savedCat.currentRoom) {
                    const room = this.rooms[savedCat.currentRoom];
                    if (room) cat.setRoom(room);
                }
                
                // Restore special states
                cat.lastMedicationTime = savedCat.medicationGiven ? Date.now() : null;
                cat.morningRoutineComplete = savedCat.morningRoutineComplete;
            }
        });
    }
    
    showNotification(text, type = 'info') {
        let color, bgColor;
        
        switch(type) {
            case 'success':
                color = '#ffffff';
                bgColor = '#48bb78';
                break;
            case 'warning':
                color = '#000000';
                bgColor = '#f6e05e';
                break;
            case 'error':
                color = '#ffffff';
                bgColor = '#f56565';
                break;
            default:
                color = '#ffffff';
                bgColor = '#4299e1';
        }
        
        const notification = this.add.text(GAME_WIDTH / 2, 100, text, {
            fontSize: '24px',
            color: color,
            backgroundColor: bgColor,
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setDepth(DEPTHS.UI_TEXT);
        
        this.tweens.add({
            targets: notification,
            y: 50,
            alpha: 0,
            duration: 3000,
            onComplete: () => notification.destroy()
        });
    }
}
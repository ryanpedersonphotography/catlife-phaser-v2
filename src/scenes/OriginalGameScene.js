import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, DEPTHS, ROOM_TYPES, GAME_MECHANICS, CAT_BEHAVIORS } from '../data/Constants';
import { ORIGINAL_ROOM_LAYOUT, OUTSIDE_AREA, DOOR_CONFIG, getAllRooms } from '../data/OriginalRoomLayout';
import { getAllOriginalCats, getInitialStats } from '../data/OriginalCatData';
import { getCatSpriteConfig } from '../data/CatSpriteMapping';
import Cat from '../prefabs/Cat';
import Room from '../prefabs/Room';
import LitterBox from '../prefabs/LitterBox';
import FoodBowl from '../prefabs/FoodBowl';
import GameState from '../systems/GameState';
import TimeManager from '../systems/TimeManager';
import NeedManager from '../systems/NeedManager';

export default class OriginalGameScene extends Scene {
    constructor() {
        super({ key: 'OriginalGameScene' });
    }

    init(data) {
        this.difficulty = data.difficulty || 'normal';
        this.playerName = data.playerName || 'Cat Lover';
        this.gameMode = data.gameMode || 'challenge';
    }

    create() {
        // Initialize game state
        this.gameState = new GameState(this);
        this.timeManager = new TimeManager(this);
        this.needManager = new NeedManager(this);
        
        // Game properties from original
        this.energy = GAME_MECHANICS.ENERGY.MAX;
        this.score = 0;
        this.doorOpen = false;
        
        // Collections
        this.rooms = {};
        this.cats = {};
        this.messes = [];
        this.conflicts = [];
        this.catsOutside = [];
        this.catsWaitingToGoOut = [];
        this.catsWaitingToComeIn = [];
        
        // Create game world
        this.createBackground();
        this.createRooms();
        this.createDoor();
        this.createOriginalCats();
        
        // Set up UI
        this.scene.launch('UIScene', { 
            gameScene: this,
            showEnergy: true,
            showScore: true 
        });
        
        // Set up input
        this.setupInput();
        
        // Start game loops
        this.startGameLoops();
        
        // Welcome message
        this.showNotification(`Welcome ${this.playerName}! Take care of your special needs cats!`);
    }

    createBackground() {
        // House background
        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x2a2a2a);
    }

    createRooms() {
        // Create the 4 main rooms
        Object.entries(ORIGINAL_ROOM_LAYOUT).forEach(([roomId, roomData]) => {
            const room = this.add.group();
            
            // Room background
            const roomBg = this.add.rectangle(
                roomData.x + roomData.width / 2,
                roomData.y + roomData.height / 2,
                roomData.width,
                roomData.height,
                roomData.color
            );
            roomBg.setStrokeStyle(3, 0x333333);
            
            // Room label
            const label = this.add.text(
                roomData.x + roomData.width / 2,
                roomData.y + 20,
                roomData.name,
                { fontSize: '20px', color: '#333', fontWeight: 'bold' }
            ).setOrigin(0.5);
            
            // Create room objects
            if (roomData.objects) {
                // Food bowl (kitchen only)
                if (roomData.objects.foodBowl) {
                    const fb = roomData.objects.foodBowl;
                    const foodBowl = new FoodBowl(this, fb.x + roomData.x, fb.y + roomData.y);
                    foodBowl.maxFood = fb.maxFood;
                    foodBowl.currentFood = fb.currentFood;
                    roomData.foodBowlRef = foodBowl;
                }
                
                // Litter boxes
                if (roomData.objects.litterBoxes) {
                    roomData.litterBoxRefs = [];
                    roomData.objects.litterBoxes.forEach(lb => {
                        const litterBox = new LitterBox(
                            this, 
                            lb.x + roomData.x, 
                            lb.y + roomData.y,
                            roomId
                        );
                        litterBox.cleanliness = lb.cleanliness;
                        litterBox.maxCapacity = lb.maxCapacity;
                        litterBox.currentUses = lb.currentUses;
                        roomData.litterBoxRefs.push(litterBox);
                    });
                }
            }
            
            this.rooms[roomId] = {
                ...roomData,
                graphics: room,
                background: roomBg,
                label: label,
                cats: [],
                messes: []
            };
        });
        
        // Create outside area
        const outsideBg = this.add.rectangle(
            OUTSIDE_AREA.x + OUTSIDE_AREA.width / 2,
            OUTSIDE_AREA.y + OUTSIDE_AREA.height / 2,
            OUTSIDE_AREA.width,
            OUTSIDE_AREA.height,
            OUTSIDE_AREA.color
        );
        outsideBg.setStrokeStyle(3, 0x006600);
        
        this.add.text(
            OUTSIDE_AREA.x + OUTSIDE_AREA.width / 2,
            OUTSIDE_AREA.y + 20,
            'Outside',
            { fontSize: '20px', color: '#006600', fontWeight: 'bold' }
        ).setOrigin(0.5);
    }

    createDoor() {
        // Door between living room and outside
        this.door = this.add.rectangle(
            DOOR_CONFIG.position.x,
            DOOR_CONFIG.position.y,
            DOOR_CONFIG.width,
            DOOR_CONFIG.height,
            0x8B4513
        );
        this.door.setStrokeStyle(2, 0x654321);
        this.door.setInteractive();
        
        // Door state indicator
        this.doorStateText = this.add.text(
            DOOR_CONFIG.position.x,
            DOOR_CONFIG.position.y - 60,
            'Door: CLOSED',
            { fontSize: '14px', color: '#654321', fontWeight: 'bold' }
        ).setOrigin(0.5);
        
        // Door interaction
        this.door.on('pointerdown', () => this.toggleDoor());
    }

    createOriginalCats() {
        const allCats = getAllOriginalCats();
        
        allCats.forEach(catData => {
            const roomData = this.rooms[catData.startRoom];
            if (!roomData) return;
            
            // Create cat sprite
            const cat = this.add.sprite(
                roomData.x + 50 + Math.random() * (roomData.width - 100),
                roomData.y + 50 + Math.random() * (roomData.height - 100),
                catData.sprite + '_0'
            );
            
            cat.setScale(2); // Scale up for visibility
            cat.setInteractive();
            
            // Set up cat data
            cat.catId = catData.id;
            cat.catData = {
                ...catData,
                ...getInitialStats(catData.id),
                currentRoom: catData.startRoom,
                x: cat.x,
                y: cat.y
            };
            
            // Cat label
            cat.nameLabel = this.add.text(
                cat.x,
                cat.y - 40,
                catData.name,
                { fontSize: '14px', color: '#000', backgroundColor: '#fff', padding: { x: 4, y: 2 } }
            ).setOrigin(0.5);
            
            // Add to room
            roomData.cats.push(cat);
            this.cats[catData.id] = cat;
            
            // Set up interactions
            cat.on('pointerdown', () => this.onCatClicked(cat));
            cat.on('pointerover', () => this.onCatHover(cat, true));
            cat.on('pointerout', () => this.onCatHover(cat, false));
        });
        
        // Check initial conflicts
        this.checkAllConflicts();
    }

    onCatClicked(cat) {
        this.selectedCat = cat;
        this.showCatActions(cat);
    }

    onCatHover(cat, isHovering) {
        cat.setScale(isHovering ? 2.2 : 2);
    }

    showCatActions(cat) {
        const actions = this.getCatActions(cat);
        this.events.emit('show-cat-actions', { cat: cat.catData, actions });
    }

    getCatActions(cat) {
        const actions = [];
        const catData = cat.catData;
        
        // Feed action
        if (!catData.fed && catData.currentRoom === 'kitchen') {
            actions.push({
                name: 'Feed',
                cost: GAME_MECHANICS.ENERGY.FEED_COST,
                callback: () => this.feedCat(cat)
            });
        }
        
        // Play action
        actions.push({
            name: 'Play',
            cost: GAME_MECHANICS.ENERGY.PLAY_COST,
            callback: () => this.playWithCat(cat)
        });
        
        // Pet action
        actions.push({
            name: 'Pet',
            cost: GAME_MECHANICS.ENERGY.PET_COST,
            callback: () => this.petCat(cat)
        });
        
        // Move action
        const adjacentRooms = this.getAdjacentRooms(catData.currentRoom);
        adjacentRooms.forEach(roomId => {
            actions.push({
                name: `Move to ${this.rooms[roomId].name}`,
                cost: GAME_MECHANICS.ENERGY.MOVE_CAT_COST,
                callback: () => this.moveCat(cat, roomId)
            });
        });
        
        // Special actions for Tink
        if (catData.id === 'tink' && catData.needsExtra) {
            actions.push({
                name: 'Give Extra Attention',
                cost: GAME_MECHANICS.ENERGY.PET_COST * 2,
                callback: () => this.giveExtraAttention(cat)
            });
        }
        
        return actions;
    }

    toggleDoor() {
        if (this.energy < GAME_MECHANICS.ENERGY.DOOR_COST) {
            this.showNotification('Not enough energy to operate door!');
            return;
        }
        
        this.doorOpen = !this.doorOpen;
        this.energy -= GAME_MECHANICS.ENERGY.DOOR_COST;
        
        this.door.setFillStyle(this.doorOpen ? 0x90EE90 : 0x8B4513);
        this.doorStateText.setText(`Door: ${this.doorOpen ? 'OPEN' : 'CLOSED'}`);
        
        if (this.doorOpen) {
            this.processCatsWaitingAtDoor();
        }
        
        this.updateUI();
    }

    feedCat(cat) {
        if (this.energy < GAME_MECHANICS.ENERGY.FEED_COST) {
            this.showNotification('Not enough energy!');
            return;
        }
        
        const foodBowl = this.rooms.kitchen.foodBowlRef;
        if (!foodBowl || foodBowl.currentFood <= 0) {
            this.showNotification('No food in bowl! Refill it first.');
            return;
        }
        
        this.energy -= GAME_MECHANICS.ENERGY.FEED_COST;
        foodBowl.currentFood--;
        cat.catData.fed = true;
        cat.catData.hunger = Math.max(0, cat.catData.hunger - 50);
        cat.catData.happiness = Math.min(100, cat.catData.happiness + 20);
        
        this.score += GAME_MECHANICS.SCORING.FEED_CAT;
        
        // Check if Gusty steals food
        if (cat.catData.id !== 'gusty' && this.cats.gusty && this.cats.gusty.catData.currentRoom === 'kitchen') {
            this.showNotification(`Gusty stole ${cat.catData.name}'s food!`);
            this.cats.gusty.catData.fed = true;
            cat.catData.fed = false;
        }
        
        this.showNotification(`Fed ${cat.catData.name}!`);
        this.updateUI();
    }

    playWithCat(cat) {
        if (this.energy < GAME_MECHANICS.ENERGY.PLAY_COST) {
            this.showNotification('Not enough energy!');
            return;
        }
        
        this.energy -= GAME_MECHANICS.ENERGY.PLAY_COST;
        cat.catData.happiness = Math.min(100, cat.catData.happiness + 30);
        this.score += GAME_MECHANICS.SCORING.PLAY_WITH_CAT;
        
        this.showNotification(`Played with ${cat.catData.name}!`);
        this.updateUI();
    }

    petCat(cat) {
        if (this.energy < GAME_MECHANICS.ENERGY.PET_COST) {
            this.showNotification('Not enough energy!');
            return;
        }
        
        this.energy -= GAME_MECHANICS.ENERGY.PET_COST;
        cat.catData.happiness = Math.min(100, cat.catData.happiness + 10);
        this.score += GAME_MECHANICS.SCORING.PET_CAT;
        
        this.showNotification(`Petted ${cat.catData.name}!`);
        this.updateUI();
    }

    moveCat(cat, toRoomId) {
        if (this.energy < GAME_MECHANICS.ENERGY.MOVE_CAT_COST) {
            this.showNotification('Not enough energy!');
            return;
        }
        
        // Remove from current room
        const fromRoom = this.rooms[cat.catData.currentRoom];
        fromRoom.cats = fromRoom.cats.filter(c => c !== cat);
        
        // Add to new room
        const toRoom = this.rooms[toRoomId];
        toRoom.cats.push(cat);
        cat.catData.currentRoom = toRoomId;
        
        // Update position
        cat.x = toRoom.x + 50 + Math.random() * (toRoom.width - 100);
        cat.y = toRoom.y + 50 + Math.random() * (toRoom.height - 100);
        cat.nameLabel.x = cat.x;
        cat.nameLabel.y = cat.y - 40;
        
        this.energy -= GAME_MECHANICS.ENERGY.MOVE_CAT_COST;
        
        this.showNotification(`Moved ${cat.catData.name} to ${toRoom.name}`);
        this.checkAllConflicts();
        this.updateUI();
    }

    giveExtraAttention(cat) {
        if (this.energy < GAME_MECHANICS.ENERGY.PET_COST * 2) {
            this.showNotification('Not enough energy!');
            return;
        }
        
        this.energy -= GAME_MECHANICS.ENERGY.PET_COST * 2;
        cat.catData.happiness = 100;
        cat.catData.health = Math.min(100, cat.catData.health + 10);
        this.score += GAME_MECHANICS.SCORING.SPECIAL_CARE_BONUS;
        
        this.showNotification(`Gave extra attention to ${cat.catData.name}! They're so happy!`);
        this.updateUI();
    }

    checkAllConflicts() {
        this.conflicts = [];
        
        Object.values(this.rooms).forEach(room => {
            const catsInRoom = room.cats || [];
            
            for (let i = 0; i < catsInRoom.length; i++) {
                for (let j = i + 1; j < catsInRoom.length; j++) {
                    const cat1 = catsInRoom[i];
                    const cat2 = catsInRoom[j];
                    
                    if (cat1.catData.conflicts.includes(cat2.catData.id) ||
                        cat2.catData.conflicts.includes(cat1.catData.id)) {
                        this.conflicts.push({
                            cat1: cat1.catData.id,
                            cat2: cat2.catData.id,
                            room: room.id
                        });
                        
                        // Visual indicator
                        room.background.setStrokeStyle(5, 0xff0000);
                    }
                }
            }
        });
    }

    startGameLoops() {
        // Cat behavior loop
        this.time.addEvent({
            delay: 5000,
            callback: this.updateCatBehaviors,
            callbackScope: this,
            loop: true
        });
        
        // Mess generation loop
        this.time.addEvent({
            delay: 10000,
            callback: this.generateMesses,
            callbackScope: this,
            loop: true
        });
        
        // Conflict damage loop
        this.time.addEvent({
            delay: 3000,
            callback: this.applyConflictDamage,
            callbackScope: this,
            loop: true
        });
    }

    updateCatBehaviors() {
        Object.values(this.cats).forEach(cat => {
            const catData = cat.catData;
            
            // Hunger increases
            catData.hunger = Math.min(100, catData.hunger + 5);
            
            // Happiness decreases if hungry
            if (catData.hunger > 70) {
                catData.happiness = Math.max(0, catData.happiness - 5);
            }
            
            // Poop urgency increases
            if (catData.fed) {
                catData.poopUrgency = Math.min(100, catData.poopUrgency + 10);
            }
        });
    }

    generateMesses() {
        const difficultyMultiplier = GAME_MECHANICS.DIFFICULTY[this.difficulty.toUpperCase()].messFrequency;
        
        Object.values(this.cats).forEach(cat => {
            const catData = cat.catData;
            
            // Snicker poops everywhere
            if (catData.id === 'snicker' && Math.random() < 0.3 * difficultyMultiplier) {
                this.createMess('poop', catData.currentRoom, cat.x, cat.y);
            }
            
            // Scampi pees everywhere
            if (catData.id === 'scampi' && Math.random() < 0.3 * difficultyMultiplier) {
                this.createMess('pee', catData.currentRoom, cat.x, cat.y);
            }
            
            // Normal bathroom behavior
            if (catData.poopUrgency > 80 && Math.random() < 0.5) {
                if (catData.bathroomPreference === 'anywhere' || 
                    (catData.bathroomPreference === 'outside' && catData.currentRoom !== 'outside')) {
                    this.createMess('poop', catData.currentRoom, cat.x, cat.y);
                }
                catData.poopUrgency = 0;
                catData.hasPoopedToday = true;
            }
        });
    }

    createMess(type, roomId, x, y) {
        const messData = GAME_MECHANICS.MESS_TYPES[type.toUpperCase()];
        const mess = this.add.text(x, y, messData.emoji, { fontSize: '24px' });
        mess.setInteractive();
        mess.messType = type;
        mess.roomId = roomId;
        
        mess.on('pointerdown', () => this.cleanMess(mess));
        
        this.rooms[roomId].messes.push(mess);
        this.messes.push(mess);
        
        this.score -= messData.penalty;
        this.updateUI();
    }

    cleanMess(mess) {
        if (this.energy < GAME_MECHANICS.ENERGY.CLEAN_COST) {
            this.showNotification('Not enough energy to clean!');
            return;
        }
        
        this.energy -= GAME_MECHANICS.ENERGY.CLEAN_COST;
        this.score += GAME_MECHANICS.SCORING.CLEAN_MESS;
        
        // Remove mess
        const room = this.rooms[mess.roomId];
        room.messes = room.messes.filter(m => m !== mess);
        this.messes = this.messes.filter(m => m !== mess);
        mess.destroy();
        
        this.showNotification('Cleaned up the mess!');
        this.updateUI();
    }

    applyConflictDamage() {
        this.conflicts.forEach(conflict => {
            const cat1 = this.cats[conflict.cat1];
            const cat2 = this.cats[conflict.cat2];
            
            if (cat1 && cat2) {
                cat1.catData.happiness = Math.max(0, cat1.catData.happiness - GAME_MECHANICS.CONFLICT.DAMAGE_PER_TICK);
                cat2.catData.happiness = Math.max(0, cat2.catData.happiness - GAME_MECHANICS.CONFLICT.DAMAGE_PER_TICK);
                
                cat1.catData.health = Math.max(0, cat1.catData.health - GAME_MECHANICS.CONFLICT.DAMAGE_PER_TICK);
                cat2.catData.health = Math.max(0, cat2.catData.health - GAME_MECHANICS.CONFLICT.DAMAGE_PER_TICK);
                
                this.score -= GAME_MECHANICS.SCORING.CONFLICT_PENALTY;
            }
        });
        
        this.updateUI();
    }

    getAdjacentRooms(currentRoom) {
        const room = this.rooms[currentRoom];
        return room ? room.connections : [];
    }

    processCatsWaitingAtDoor() {
        // Handle cats waiting to go out/in
        this.catsWaitingToGoOut.forEach(catId => {
            const cat = this.cats[catId];
            if (cat && cat.catData.currentRoom === 'livingRoom') {
                this.moveCatOutside(cat);
            }
        });
        
        this.catsWaitingToComeIn.forEach(catId => {
            const cat = this.cats[catId];
            if (cat && this.catsOutside.includes(catId)) {
                this.moveCatInside(cat);
            }
        });
        
        this.catsWaitingToGoOut = [];
        this.catsWaitingToComeIn = [];
    }

    moveCatOutside(cat) {
        // Implementation for moving cat outside
        this.catsOutside.push(cat.catData.id);
        cat.catData.currentRoom = 'outside';
        cat.visible = false;
        cat.nameLabel.visible = false;
    }

    moveCatInside(cat) {
        // Implementation for moving cat inside
        this.catsOutside = this.catsOutside.filter(id => id !== cat.catData.id);
        this.moveCat(cat, 'livingRoom');
        cat.visible = true;
        cat.nameLabel.visible = true;
    }

    setupInput() {
        // Keyboard shortcuts
        this.input.keyboard.on('keydown-D', () => this.toggleDoor());
        this.input.keyboard.on('keydown-ESC', () => this.scene.pause());
    }

    showNotification(message) {
        this.events.emit('show-notification', message);
    }

    updateUI() {
        this.events.emit('update-stats', {
            energy: this.energy,
            score: this.score,
            cats: Object.values(this.cats).map(c => c.catData)
        });
    }

    update(time, delta) {
        // Update time
        this.timeManager.update(delta);
        
        // Check for game over in challenge mode
        if (this.gameMode === 'challenge' && this.score < -50) {
            this.scene.start('GameOverScene', { score: this.score });
        }
    }
}
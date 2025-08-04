import { GameObjects } from 'phaser';
import { CAT_STATES, NEED_TYPES, DEPTHS } from '../data/Constants';

export default class Cat extends GameObjects.Container {
    constructor(scene, catData) {
        super(scene, 0, 0);

        this.scene = scene;
        this.data = catData;
        this.id = catData.id;

        // Stats
        this.stats = {
            happiness: 50,
            hunger: 50,
            thirst: 50,
            bathroom: 50,
            energy: 100,
            cleanliness: 100,
            health: 100
        };

        // State
        this.currentState = CAT_STATES.IDLE;
        this.currentRoom = null;
        this.target = null;
        this.isDragging = false;

        // Behavior
        this.behaviorTimer = 0;
        this.behaviorCooldown = 0;
        this.lastMedicationTime = null;

        // Special needs
        this.medicationNeeded = false;
        this.morningRoutineComplete = false;

        // Create sprite
        this.createSprite();

        // Add container to scene properly
        this.scene.add.existing(this);
        this.setDepth(DEPTHS.CATS);

        // Set the hit area for the container to match the sprite bounds
        // This avoids the black rectangle issue while keeping interaction on the container
        const hitArea = new Phaser.Geom.Rectangle(
            -this.sprite.width * this.sprite.scaleX / 2,
            -this.sprite.height * this.sprite.scaleY / 2,
            this.sprite.width * this.sprite.scaleX,
            this.sprite.height * this.sprite.scaleY
        );
        
        this.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
        this.input.draggable = true;
        this.input.cursor = 'pointer';
        
        // Set up drag events on the container
        this.on('dragstart', () => this.startDrag());
        this.on('drag', (pointer, dragX, dragY) => {
            this.x = dragX;
            this.y = dragY;
        });
        this.on('dragend', () => this.endDrag());
        
        // Also make the container clickable
        this.on('pointerdown', () => {
            console.log(`Cat ${this.data.name} clicked!`);
            if (this.scene.handleCatClick) {
                this.scene.handleCatClick(this);
            } else {
                console.error('handleCatClick not found on scene');
            }
        });

        // AI will start in update loop
    }

    createFallbackSprite(color) {
        console.log(`Cat ${this.data.name}: Creating fallback sprite with color ${color}`);
        
        // Create a simple colored rectangle as fallback
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(parseInt(this.data.color.replace('#', '0x'), 16), 1);
        graphics.fillRoundedRect(-16, -20, 32, 40, 8);
        graphics.generateTexture(`fallback_cat_${this.data.id}`, 32, 40);
        graphics.destroy();
        
        // Create sprite with fallback texture
        this.sprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, `fallback_cat_${this.data.id}`);
        this.sprite.setScale(1.5);
        
        this.add(this.sprite);
        
        // Store sprite sheet key for animations (even though we don't have animations)
        this.spriteSheetKey = `fallback_cat_${this.data.id}`;
        
        // Create name label and status indicators
        this.createNameLabelAndStatus();
    }

    createNameLabelAndStatus() {
        // Name label
        this.nameLabel = new Phaser.GameObjects.Text(this.scene, 0, -40, this.data.name, {
            fontSize: '14px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.add(this.nameLabel);

        // Status indicators
        this.createStatusIndicators();
    }

    createSprite() {
        console.log(`Cat ${this.data.name}: createSprite() called`);
        
        // Check if sprite already exists
        if (this.sprite) {
            console.warn(`Cat ${this.data.name}: Sprite already exists! Removing old sprite.`);
            this.remove(this.sprite);
            this.sprite.destroy();
        }
        
        // Use cat name directly for sprite key since each cat has their own sprite
        const catName = this.data.name.toLowerCase().replace(/\s+/g, '');
        const spriteSheetKey = `cat_${catName}`;

        console.log(`Cat ${this.data.name}: Creating sprite with unique texture ${spriteSheetKey}`);

        // Verify texture exists before creating sprite
        if (!this.scene.textures.exists(spriteSheetKey)) {
            console.error(`Cat ${this.data.name}: Texture ${spriteSheetKey} does not exist!`);
            console.log('Available textures:', Object.keys(this.scene.textures.list));
            // Use a fallback texture or create a simple colored rectangle
            this.createFallbackSprite(this.data.color);
            return;
        }

        // Create sprite from sprite sheet and set to first frame
        console.log(`Cat ${this.data.name}: Creating sprite from sprite sheet`);
        this.sprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, spriteSheetKey, 0);
        this.sprite.setScale(3); // Scale up more since sprites are now 32x30 instead of 64x60
        
        // Debug: Check sprite texture
        console.log(`Cat ${this.data.name}: Sprite texture info:`, {
            textureKey: this.sprite.texture.key,
            frameKey: this.sprite.frame.name,
            frameWidth: this.sprite.frame.width,
            frameHeight: this.sprite.frame.height,
            sourceWidth: this.sprite.frame.source.width,
            sourceHeight: this.sprite.frame.source.height
        });
        
        // Debug: Check children before adding sprite
        console.log(`Cat ${this.data.name}: Container children before add:`, this.list.length);
        
        this.add(this.sprite);
        
        // Debug: Check children after adding sprite
        console.log(`Cat ${this.data.name}: Container children after add:`, this.list.length);

        // Store sprite sheet key for animations BEFORE using it
        this.spriteSheetKey = spriteSheetKey;

        // Create name label and status indicators
        this.createNameLabelAndStatus();

        // Set initial frame and start idle animation
        if (this.sprite instanceof Phaser.GameObjects.Sprite) {
            this.sprite.setFrame(0);
            this.playAnimation('idle');
        }
        // Images don't need frame or animation setup

        // Ensure sprite is visible
        this.sprite.setVisible(true);
        this.sprite.setAlpha(1);

        // Debug visibility
        console.log(`Cat ${this.data.name} sprite:`, {
            texture: spriteSheetKey,
            frame: this.sprite.frame.name,
            visible: this.sprite.visible,
            alpha: this.sprite.alpha,
            x: this.x,
            y: this.y,
            width: this.sprite.width,
            height: this.sprite.height
        });
    }

    playAnimation(animKey) {
        // Skip animations for image sprites
        if (!(this.sprite instanceof Phaser.GameObjects.Sprite)) {
            return;
        }
        
        const fullAnimKey = `${this.spriteSheetKey}_${animKey}`;
        if (this.sprite && this.scene.anims.exists(fullAnimKey)) {
            console.log(`Cat ${this.data.name}: Playing animation ${fullAnimKey}`);
            this.sprite.play(fullAnimKey);
            this.currentAnimation = animKey;
        } else {
            console.warn(`Cat ${this.data.name}: Animation ${fullAnimKey} does not exist.`);
            // Fallback to a static frame
            if (this.sprite && this.sprite.texture.key !== `fallback_cat_${this.data.id}`) {
                this.sprite.setFrame(this.getStaticFrame());
            }
        }
    }

    createStatusIndicators() {
        // Mood indicator
        this.moodIndicator = new Phaser.GameObjects.Text(this.scene, -30, 20, '', {
            fontSize: '20px'
        }).setOrigin(0.5);
        this.add(this.moodIndicator);

        // Need indicator
        this.needIndicator = new Phaser.GameObjects.Text(this.scene, 30, 20, '', {
            fontSize: '20px'
        }).setOrigin(0.5);
        this.add(this.needIndicator);

        // Update indicators
        this.updateStatusIndicators();
    }

    updateStatusIndicators() {
        // Mood based on happiness
        let mood = '';
        if (this.stats.happiness > 70) mood = ':)';
        else if (this.stats.happiness > 40) mood = ':|';
        else mood = ':(';
        this.moodIndicator.setText(mood);

        // Primary need
        let need = '';
        if (this.stats.hunger > 70) need = 'Food';
        else if (this.stats.thirst > 70) need = 'Water';
        else if (this.stats.bathroom > 70) need = 'WC';
        else if (this.stats.energy < 30) need = 'Zzz';
        else if (this.medicationNeeded) need = 'Med';
        this.needIndicator.setText(need);
    }

    update(time, delta) {
        // Update stats over time
        this.updateStats(delta);

        // Update behavior
        this.updateBehavior(delta);

        // Update animations
        this.updateAnimation();

        // Update status indicators
        this.updateStatusIndicators();

        // Check special conditions
        this.checkSpecialConditions();
    }

    updateStats(delta) {
        const deltaSeconds = delta / 1000;
        const difficultyMultiplier = this.scene.registry.get('difficultyMultiplier') || 1;

        // Increase needs over time
        this.stats.hunger += (2 * difficultyMultiplier * deltaSeconds);
        this.stats.thirst += (3 * difficultyMultiplier * deltaSeconds);
        this.stats.bathroom += (1.5 * difficultyMultiplier * deltaSeconds);

        // Decrease energy over time (more if active)
        const energyLoss = this.currentState === CAT_STATES.PLAYING ? 3 : 1;
        this.stats.energy -= (energyLoss * deltaSeconds);

        // Affect happiness based on needs
        if (this.stats.hunger > 80 || this.stats.thirst > 80) {
            this.stats.happiness -= (1 * deltaSeconds);
        }
        if (this.stats.bathroom > 90) {
            this.stats.happiness -= (2 * deltaSeconds);
        }

        // Clamp values
        Object.keys(this.stats).forEach(stat => {
            this.stats[stat] = Phaser.Math.Clamp(this.stats[stat], 0, 100);
        });
    }

    updateBehavior(delta) {
        this.behaviorTimer += delta;

        if (this.behaviorTimer > this.behaviorCooldown && !this.isDragging) {
            this.decideBehavior();
            this.behaviorTimer = 0;
            this.behaviorCooldown = Phaser.Math.Between(3000, 8000);
        }

        // Execute current behavior
        this.executeBehavior(delta);
    }

    decideBehavior() {
        // Priority system for behaviors
        if (this.stats.hunger > 70) {
            this.seekFood();
        } else if (this.stats.thirst > 70) {
            this.seekWater();
        } else if (this.stats.bathroom > 80) {
            this.seekLitterBox();
        } else if (this.stats.energy < 30) {
            this.seekSleep();
        } else if (Math.random() < 0.3) {
            this.wander();
        } else if (Math.random() < 0.2) {
            this.seekPlay();
        }
    }

    executeBehavior(delta) {
        if (this.target && !this.isDragging) {
            // Move towards target
            const distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);

            if (distance > 50) {
                // Move towards target
                const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
                const speed = 50 * (delta / 1000);

                this.x += Math.cos(angle) * speed;
                this.y += Math.sin(angle) * speed;

                // Face direction
                this.sprite.setFlipX(Math.cos(angle) < 0);

                this.setState(CAT_STATES.WALKING);
            } else {
                // Reached target
                this.handleTargetReached();
            }
        }
    }

    seekFood() {
        const bowl = this.scene.getNearestObject(this.x, this.y, 'food');
        if (bowl && !bowl.isEmpty()) {
            this.target = bowl;
            this.targetType = 'food';
        }
    }

    seekWater() {
        const bowl = this.scene.getNearestObject(this.x, this.y, 'water');
        if (bowl && !bowl.isEmpty()) {
            this.target = bowl;
            this.targetType = 'water';
        }
    }

    seekLitterBox() {
        const litterBox = this.scene.getNearestObject(this.x, this.y, 'litter');
        if (litterBox && !litterBox.isFull()) {
            this.target = litterBox;
            this.targetType = 'litter';
        }
    }

    seekSleep() {
        // Go to favorite sleep spot
        const room = this.scene.rooms[this.data.preferences.favoriteRoom];
        if (room) {
            this.target = {
                x: room.x + room.width / 2,
                y: room.y + room.height / 2
            };
            this.targetType = 'sleep';
        }
    }

    seekPlay() {
        const toy = this.scene.getNearestObject(this.x, this.y, 'toy');
        if (toy) {
            this.target = toy;
            this.targetType = 'play';
        }
    }

    wander() {
        // Pick random location in current room
        if (this.currentRoom) {
            this.target = {
                x: this.currentRoom.x + Phaser.Math.Between(50, this.currentRoom.width - 50),
                y: this.currentRoom.y + Phaser.Math.Between(50, this.currentRoom.height - 50)
            };
            this.targetType = 'wander';
        }
    }

    handleTargetReached() {
        switch(this.targetType) {
            case 'food':
                this.eat();
                break;
            case 'water':
                this.drink();
                break;
            case 'litter':
                this.useLitterBox();
                break;
            case 'sleep':
                this.sleep();
                break;
            case 'play':
                this.play();
                break;
        }

        this.target = null;
        this.targetType = null;
    }

    eat() {
        if (this.target && !this.target.isEmpty()) {
            this.setState(CAT_STATES.EATING);
            this.stats.hunger = Math.max(0, this.stats.hunger - 30);
            this.stats.happiness += 10;
            this.target.consume();

            // Eating animation
            this.scene.time.delayedCall(2000, () => {
                this.setState(CAT_STATES.IDLE);
            });
        }
    }

    drink() {
        if (this.target && !this.target.isEmpty()) {
            this.setState(CAT_STATES.EATING);
            this.stats.thirst = Math.max(0, this.stats.thirst - 30);
            this.target.consume();

            this.scene.time.delayedCall(1500, () => {
                this.setState(CAT_STATES.IDLE);
            });
        }
    }

    useLitterBox() {
        if (this.target && !this.target.isFull()) {
            this.setState(CAT_STATES.USING_LITTER);
            this.stats.bathroom = 0;
            this.stats.happiness += 5;
            this.target.use();

            this.scene.time.delayedCall(3000, () => {
                this.setState(CAT_STATES.IDLE);
            });
        }
    }

    sleep() {
        this.setState(CAT_STATES.SLEEPING);

        // Regenerate energy while sleeping
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.stats.energy = Math.min(100, this.stats.energy + 10);
                if (this.stats.energy >= 90) {
                    this.setState(CAT_STATES.IDLE);
                }
            },
            repeat: 10
        });
    }

    play() {
        this.setState(CAT_STATES.PLAYING);
        this.stats.happiness += 15;
        this.stats.energy -= 10;

        // Play animation
        this.scene.tweens.add({
            targets: this.sprite,
            rotation: Math.PI * 2,
            duration: 1000,
            onComplete: () => {
                this.sprite.rotation = 0;
                this.setState(CAT_STATES.IDLE);
            }
        });
    }

    setState(state) {
        if (this.currentState === state) return;

        this.currentState = state;
        this.updateAnimation();
    }

    updateAnimation() {
        // Use proper animations with the new sprite sheets
        const animName = this.getAnimationName();
        if (animName !== this.currentAnimation) {
            this.playAnimation(animName);
        }
    }

    getAnimationName() {
        switch(this.currentState) {
            case CAT_STATES.IDLE:
                return 'idle';
            case CAT_STATES.WALKING:
                return 'walk';
            case CAT_STATES.SLEEPING:
                return 'sleep';
            case CAT_STATES.EATING:
                return 'idle'; // Use idle animation for eating
            case CAT_STATES.PLAYING:
                return 'walk'; // Use walk animation for playing
            default:
                return 'idle';
        }
    }

    getStaticFrame() {
        switch(this.currentState) {
            case CAT_STATES.IDLE:
                return 0;
            case CAT_STATES.WALKING:
                return 2;
            case CAT_STATES.SLEEPING:
                return 6;
            case CAT_STATES.EATING:
                return 1;
            case CAT_STATES.PLAYING:
                return 3;
            default:
                return 0;
        }
    }

    checkSpecialConditions() {
        // Check medication times
        if (this.data.specialNeeds && this.data.specialNeeds.medication) {
            const currentHour = this.scene.timeManager.getCurrentTime().hour;
            const medTime = this.data.specialNeeds.medicationTime;

            if (Array.isArray(medTime)) {
                this.medicationNeeded = medTime.includes(currentHour);
            } else {
                this.medicationNeeded = currentHour === medTime;
            }
        }

        // Check Tink's morning routine
        if (this.id === 'tink') {
            const time = this.scene.timeManager.getCurrentTime();
            if (time.period === 'Morning' && !this.morningRoutineComplete) {
                // Must stay in bathroom
                if (this.currentRoom?.id !== 'bathroom') {
                    this.stats.happiness -= 5;
                }
            } else if (time.period !== 'Morning') {
                this.morningRoutineComplete = false;
            }
        }
    }

    setRoom(room) {
        this.currentRoom = room;

        // Set position to center of room
        this.x = room.x + room.width / 2;
        this.y = room.y + room.height / 2;
    }

    startDrag() {
        this.isDragging = true;
        this.setAlpha(0.8);
        this.setState(CAT_STATES.IDLE);
    }

    drag(x, y) {
        this.x = x;
        this.y = y;
    }

    endDrag() {
        this.isDragging = false;
        this.setAlpha(1);

        // Check which room we're in
        const room = this.scene.getRoomAt(this.x, this.y);
        if (room) {
            // Check if this cat can be in this room
            if (this.canBeInRoom(room)) {
                this.setRoom(room);
            } else {
                // Return to previous room
                if (this.currentRoom) {
                    this.setRoom(this.currentRoom);
                }
                this.scene.showNotification("This cat can't go there!");
            }
        }
    }

    canBeInRoom(room) {
        // Check Tink's morning routine
        if (this.id === 'tink') {
            const time = this.scene.timeManager.getCurrentTime();
            if (time.period === 'Morning' && room.id !== 'bathroom') {
                return false;
            }
        }

        // Check if room requires open door
        if (room.id === 'outside' && !this.scene.registry.get('isDoorOpen')) {
            return false;
        }

        // Check for conflicting cats
        const catsInRoom = this.scene.getCatsInRoom(room.id);
        for (const cat of catsInRoom) {
            if (this.data.conflicts.includes(cat.id)) {
                return false;
            }
        }

        return true;
    }

    dailyReset() {
        // Reset some stats for new day
        this.morningRoutineComplete = false;
        this.lastMedicationTime = null;
        this.stats.energy = Math.max(50, this.stats.energy);
    }
}

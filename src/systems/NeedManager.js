export default class NeedManager {
    constructor(scene) {
        this.scene = scene;
        
        // Need increase rates (per minute)
        this.needRates = {
            hunger: 0.8,
            thirst: 1.2,
            bathroom: 0.6,
            energy: -0.5, // Energy decreases
            cleanliness: -0.3,
            happiness: 0 // Happiness affected by other needs
        };
        
        // Thresholds for different states
        this.thresholds = {
            critical: 90,
            high: 70,
            medium: 50,
            low: 30
        };
        
        // Track time since last update
        this.lastUpdateTime = 0;
        
        // Start update loop
        this.startUpdates();
    }
    
    startUpdates() {
        // Update needs every game minute
        this.scene.time.addEvent({
            delay: 1000, // Every second (1 game minute at 1x speed)
            callback: () => this.update(1),
            callbackScope: this,
            loop: true
        });
    }
    
    update(minutesPassed) {
        if (!this.scene.cats) return;
        
        const difficultyMultiplier = this.scene.registry.get('difficultyMultiplier') || 1;
        
        this.scene.cats.forEach(cat => {
            // Update each need
            this.updateCatNeeds(cat, minutesPassed, difficultyMultiplier);
            
            // Check for critical needs
            this.checkCriticalNeeds(cat);
            
            // Update happiness based on needs
            this.updateHappiness(cat);
            
            // Check for accidents
            this.checkForAccidents(cat);
        });
    }
    
    updateCatNeeds(cat, minutes, difficultyMultiplier) {
        // Hunger
        cat.stats.hunger += this.needRates.hunger * minutes * difficultyMultiplier;
        
        // Thirst
        cat.stats.thirst += this.needRates.thirst * minutes * difficultyMultiplier;
        
        // Bathroom
        cat.stats.bathroom += this.needRates.bathroom * minutes * difficultyMultiplier;
        
        // Energy (decreases, increases when sleeping)
        if (cat.currentState !== 'SLEEPING') {
            cat.stats.energy += this.needRates.energy * minutes;
        }
        
        // Cleanliness
        cat.stats.cleanliness += this.needRates.cleanliness * minutes;
        
        // Special conditions affect needs
        this.applySpecialConditions(cat, minutes);
        
        // Clamp all values
        Object.keys(cat.stats).forEach(stat => {
            cat.stats[stat] = Phaser.Math.Clamp(cat.stats[stat], 0, 100);
        });
    }
    
    applySpecialConditions(cat, minutes) {
        const catData = cat.data;
        
        // Older cats have different need rates
        if (catData.age >= 10) {
            cat.stats.energy -= 0.2 * minutes; // Tire faster
            cat.stats.hunger += 0.1 * minutes; // Need more food
        }
        
        // Special conditions
        if (catData.specialNeeds && catData.specialNeeds.condition) {
            switch(catData.specialNeeds.condition) {
            case 'FIP':
            case 'Kidney Disease':
                cat.stats.thirst += 0.5 * minutes; // Extra thirsty
                cat.stats.energy -= 0.3 * minutes; // Lower energy
                break;
                
            case 'Diabetes':
                cat.stats.hunger += 0.3 * minutes; // Hungrier
                break;
                
            case 'Anxiety':
                if (this.hasConflictingCatsNearby(cat)) {
                    cat.stats.happiness -= 0.5 * minutes;
                }
                break;
                
            case 'Three Legs':
                if (cat.currentState === 'WALKING') {
                    cat.stats.energy -= 0.3 * minutes; // Tire faster when moving
                }
                break;
            }
        }
    }
    
    updateHappiness(cat) {
        let happinessChange = 0;
        
        // Negative effects from high needs
        if (cat.stats.hunger > this.thresholds.high) {
            happinessChange -= 0.5;
        }
        if (cat.stats.thirst > this.thresholds.high) {
            happinessChange -= 0.5;
        }
        if (cat.stats.bathroom > this.thresholds.critical) {
            happinessChange -= 1.0;
        }
        if (cat.stats.energy < this.thresholds.low) {
            happinessChange -= 0.3;
        }
        if (cat.stats.cleanliness < this.thresholds.medium) {
            happinessChange -= 0.2;
        }
        
        // Positive effects
        if (cat.currentState === 'PLAYING') {
            happinessChange += 1.0;
        }
        if (cat.currentRoom?.id === cat.data.preferences.favoriteRoom) {
            happinessChange += 0.2;
        }
        
        // Apply happiness change
        cat.stats.happiness = Phaser.Math.Clamp(
            cat.stats.happiness + happinessChange,
            0,
            100
        );
    }
    
    checkCriticalNeeds(cat) {
        const criticalNeeds = [];
        
        if (cat.stats.hunger > this.thresholds.critical) {
            criticalNeeds.push('hunger');
        }
        if (cat.stats.thirst > this.thresholds.critical) {
            criticalNeeds.push('thirst');
        }
        if (cat.stats.bathroom > this.thresholds.critical) {
            criticalNeeds.push('bathroom');
        }
        if (cat.stats.energy < 10) {
            criticalNeeds.push('exhaustion');
        }
        
        // Emit warning for critical needs
        if (criticalNeeds.length > 0) {
            this.scene.events.emit('critical-need', {
                cat: cat,
                needs: criticalNeeds
            });
            
            // Show warning
            if (Math.random() < 0.1) { // 10% chance per update to show warning
                const need = criticalNeeds[0];
                const message = this.getCriticalNeedMessage(cat.data.name, need);
                this.scene.showNotification(message, 'warning');
            }
        }
    }
    
    getCriticalNeedMessage(catName, need) {
        const messages = {
            hunger: `${catName} is very hungry! 🍽️`,
            thirst: `${catName} needs water badly! 💧`,
            bathroom: `${catName} really needs the litter box! 🚽`,
            exhaustion: `${catName} is exhausted! 😴`
        };
        
        return messages[need] || `${catName} needs attention!`;
    }
    
    checkForAccidents(cat) {
        // Bathroom accidents
        if (cat.stats.bathroom >= 100) {
            // Check if near a litter box
            const nearbyLitterBox = this.scene.getNearestObject(cat.x, cat.y, 'litter');
            const distance = nearbyLitterBox ? 
                Phaser.Math.Distance.Between(cat.x, cat.y, nearbyLitterBox.x, nearbyLitterBox.y) : 
                999;
            
            if (distance > 100 || (nearbyLitterBox && nearbyLitterBox.isFull())) {
                // Have an accident
                this.handleAccident(cat, 'bathroom');
                cat.stats.bathroom = 0;
                cat.stats.happiness -= 20;
                cat.stats.cleanliness -= 30;
            }
        }
        
        // Health emergencies
        if (cat.stats.health <= 0) {
            this.handleEmergency(cat);
        }
    }
    
    handleAccident(cat, type) {
        // Track accident
        this.scene.gameState.trackAction('accident', { cat: cat.id, type: type });
        
        // Visual effect
        const mess = this.scene.add.graphics();
        mess.fillStyle(0x8B4513, 0.6);
        mess.fillCircle(cat.x, cat.y + 20, 15);
        mess.setDepth(cat.depth - 1);
        
        // Show notification
        this.scene.showNotification(
            `Oh no! ${cat.data.name} had an accident! 😿`,
            'error'
        );
        
        // Clean up after delay
        this.scene.time.delayedCall(5000, () => {
            mess.destroy();
        });
    }
    
    handleEmergency(cat) {
        // Pause game
        this.scene.scene.pause();
        
        // Show emergency dialog
        this.scene.events.emit('emergency', {
            cat: cat,
            message: `${cat.data.name} needs immediate medical attention!`
        });
        
        // If not treated, cat is lost
        this.scene.time.delayedCall(10000, () => {
            if (cat.stats.health <= 0) {
                this.scene.gameState.trackAction('lose_cat', { cat: cat.id });
                cat.destroy();
            }
        });
    }
    
    hasConflictingCatsNearby(cat) {
        let hasConflict = false;
        
        this.scene.cats.forEach(otherCat => {
            if (otherCat.id !== cat.id && cat.data.conflicts.includes(otherCat.id)) {
                const distance = Phaser.Math.Distance.Between(
                    cat.x, cat.y,
                    otherCat.x, otherCat.y
                );
                
                if (distance < 200) {
                    hasConflict = true;
                }
            }
        });
        
        return hasConflict;
    }
    
    satisfyNeed(cat, needType, amount) {
        if (cat.stats[needType] !== undefined) {
            cat.stats[needType] = Math.max(0, cat.stats[needType] - amount);
            
            // Give happiness boost for satisfied needs
            if (needType !== 'happiness') {
                cat.stats.happiness = Math.min(100, cat.stats.happiness + 5);
            }
        }
    }
    
    getNeedLevel(value) {
        if (value >= this.thresholds.critical) return 'critical';
        if (value >= this.thresholds.high) return 'high';
        if (value >= this.thresholds.medium) return 'medium';
        if (value >= this.thresholds.low) return 'low';
        return 'satisfied';
    }
    
    getCatStatus(cat) {
        const status = {
            overallHealth: 'good',
            criticalNeeds: [],
            warnings: []
        };
        
        // Check each need
        Object.entries(cat.stats).forEach(([need, value]) => {
            const level = this.getNeedLevel(value);
            
            if (level === 'critical') {
                status.criticalNeeds.push(need);
                status.overallHealth = 'critical';
            } else if (level === 'high' && status.overallHealth !== 'critical') {
                status.warnings.push(need);
                status.overallHealth = 'warning';
            }
        });
        
        return status;
    }
}
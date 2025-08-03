export default class GameState {
    constructor(scene) {
        this.scene = scene;
        
        // Game progress
        this.currentDay = 1;
        this.score = 0;
        this.totalScore = 0;
        
        // Player resources
        this.playerEnergy = 100;
        this.maxPlayerEnergy = 100;
        this.money = 100;
        
        // Game stats
        this.catsAdopted = 0;
        this.catsLost = 0;
        this.perfectDays = 0;
        this.tasksCompleted = 0;
        
        // Daily tracking
        this.dailyStats = {
            catsFed: 0,
            catsWatered: 0,
            litterBoxesCleaned: 0,
            catsPlayed: 0,
            medicationsGiven: 0,
            specialNeedsMet: 0,
            accidents: 0
        };
        
        // Settings
        this.settings = {
            difficulty: 'normal',
            autosave: true,
            soundEnabled: true,
            musicEnabled: true,
            notificationsEnabled: true
        };
        
        // Load saved data if exists
        this.loadGame();
    }
    
    startNewDay() {
        this.currentDay++;
        this.playerEnergy = this.maxPlayerEnergy;
        
        // Calculate previous day's score
        const dayScore = this.calculateDayScore();
        this.score += dayScore;
        this.totalScore += dayScore;
        
        // Check for perfect day
        if (this.dailyStats.accidents === 0 && 
            this.dailyStats.specialNeedsMet >= this.getRequiredSpecialNeeds()) {
            this.perfectDays++;
        }
        
        // Reset daily stats
        this.resetDailyStats();
        
        // Show day summary
        this.scene.scene.launch('DaySummaryScene', {
            day: this.currentDay - 1,
            score: dayScore,
            stats: { ...this.dailyStats }
        });
        
        return dayScore;
    }
    
    resetDailyStats() {
        this.dailyStats = {
            catsFed: 0,
            catsWatered: 0,
            litterBoxesCleaned: 0,
            catsPlayed: 0,
            medicationsGiven: 0,
            specialNeedsMet: 0,
            accidents: 0
        };
    }
    
    calculateDayScore() {
        let score = 0;
        
        // Base score for completing the day
        score += 100;
        
        // Bonus for each cat properly cared for
        score += this.dailyStats.catsFed * 10;
        score += this.dailyStats.catsWatered * 5;
        score += this.dailyStats.litterBoxesCleaned * 15;
        score += this.dailyStats.catsPlayed * 8;
        
        // Big bonus for medications
        score += this.dailyStats.medicationsGiven * 25;
        
        // Bonus for special needs
        score += this.dailyStats.specialNeedsMet * 30;
        
        // Penalty for accidents
        score -= this.dailyStats.accidents * 50;
        
        // Bonus for perfect day
        if (this.dailyStats.accidents === 0) {
            score += 50;
        }
        
        // Difficulty multiplier
        const difficultyMultiplier = this.getDifficultyMultiplier();
        score = Math.round(score * difficultyMultiplier);
        
        return Math.max(0, score);
    }
    
    getDifficultyMultiplier() {
        switch(this.settings.difficulty) {
            case 'easy': return 0.8;
            case 'normal': return 1.0;
            case 'hard': return 1.5;
            default: return 1.0;
        }
    }
    
    getRequiredSpecialNeeds() {
        // Count cats with special needs
        let count = 0;
        const cats = this.scene.cats;
        
        if (cats) {
            cats.forEach(cat => {
                if (cat.data.specialNeeds && 
                    (cat.data.specialNeeds.medication || cat.data.specialNeeds.condition)) {
                    count++;
                }
            });
        }
        
        return count;
    }
    
    useEnergy(amount) {
        this.playerEnergy = Math.max(0, this.playerEnergy - amount);
        
        if (this.playerEnergy <= 0) {
            // Player exhausted - end day early
            this.scene.timeManager.endDay();
        }
        
        return this.playerEnergy > 0;
    }
    
    restoreEnergy(amount) {
        this.playerEnergy = Math.min(this.maxPlayerEnergy, this.playerEnergy + amount);
    }
    
    spendMoney(amount) {
        if (this.money >= amount) {
            this.money -= amount;
            return true;
        }
        return false;
    }
    
    earnMoney(amount) {
        this.money += amount;
    }
    
    trackAction(action, data = {}) {
        switch(action) {
            case 'feed':
                this.dailyStats.catsFed++;
                this.tasksCompleted++;
                break;
            case 'water':
                this.dailyStats.catsWatered++;
                this.tasksCompleted++;
                break;
            case 'clean':
                this.dailyStats.litterBoxesCleaned++;
                this.tasksCompleted++;
                break;
            case 'play':
                this.dailyStats.catsPlayed++;
                this.tasksCompleted++;
                break;
            case 'medicate':
                this.dailyStats.medicationsGiven++;
                this.tasksCompleted++;
                break;
            case 'special_need':
                this.dailyStats.specialNeedsMet++;
                break;
            case 'accident':
                this.dailyStats.accidents++;
                break;
            case 'adopt':
                this.catsAdopted++;
                break;
            case 'lose_cat':
                this.catsLost++;
                break;
        }
        
        // Auto-save if enabled
        if (this.settings.autosave) {
            this.saveGame();
        }
    }
    
    checkAchievements() {
        const achievements = [];
        
        // Check various achievements
        if (this.perfectDays >= 7) {
            achievements.push('Perfect Week');
        }
        if (this.catsAdopted >= 10) {
            achievements.push('Cat Collector');
        }
        if (this.tasksCompleted >= 100) {
            achievements.push('Dedicated Caretaker');
        }
        if (this.totalScore >= 10000) {
            achievements.push('Master of Cats');
        }
        
        return achievements;
    }
    
    saveGame() {
        const saveData = {
            version: '2.0.0',
            timestamp: Date.now(),
            gameData: {
                currentDay: this.currentDay,
                score: this.score,
                totalScore: this.totalScore,
                playerEnergy: this.playerEnergy,
                money: this.money,
                catsAdopted: this.catsAdopted,
                catsLost: this.catsLost,
                perfectDays: this.perfectDays,
                tasksCompleted: this.tasksCompleted,
                dailyStats: { ...this.dailyStats },
                settings: { ...this.settings }
            },
            catData: this.saveCatStates()
        };
        
        localStorage.setItem('catlife_save', JSON.stringify(saveData));
        console.log('Game saved successfully');
    }
    
    loadGame() {
        const savedData = localStorage.getItem('catlife_save');
        if (!savedData) return false;
        
        try {
            const data = JSON.parse(savedData);
            
            // Check version compatibility
            if (data.version !== '2.0.0') {
                console.warn('Save data from different version');
                return false;
            }
            
            // Load game data
            const gameData = data.gameData;
            this.currentDay = gameData.currentDay || 1;
            this.score = gameData.score || 0;
            this.totalScore = gameData.totalScore || 0;
            this.playerEnergy = gameData.playerEnergy || 100;
            this.money = gameData.money || 100;
            this.catsAdopted = gameData.catsAdopted || 0;
            this.catsLost = gameData.catsLost || 0;
            this.perfectDays = gameData.perfectDays || 0;
            this.tasksCompleted = gameData.tasksCompleted || 0;
            this.dailyStats = gameData.dailyStats || this.resetDailyStats();
            this.settings = { ...this.settings, ...gameData.settings };
            
            console.log('Game loaded successfully');
            return data.catData;
        } catch (error) {
            console.error('Error loading save data:', error);
            return false;
        }
    }
    
    saveCatStates() {
        const catStates = [];
        
        if (this.scene.cats) {
            this.scene.cats.forEach(cat => {
                catStates.push({
                    id: cat.id,
                    stats: { ...cat.stats },
                    currentRoom: cat.currentRoom?.id,
                    medicationGiven: cat.lastMedicationTime !== null,
                    morningRoutineComplete: cat.morningRoutineComplete
                });
            });
        }
        
        return catStates;
    }
    
    deleteSave() {
        localStorage.removeItem('catlife_save');
        console.log('Save data deleted');
    }
}
export default class TimeManager {
    constructor(scene) {
        this.scene = scene;
        
        // Time settings
        this.currentTime = 420; // 7:00 AM in minutes (7 * 60)
        this.dayDuration = 24 * 60; // 24 hours in minutes
        this.timeSpeed = 1; // Minutes per real second
        this.isPaused = false;
        
        // Time periods
        this.timePeriods = {
            'Early Morning': { start: 5 * 60, end: 7 * 60 },
            'Morning': { start: 7 * 60, end: 12 * 60 },
            'Afternoon': { start: 12 * 60, end: 17 * 60 },
            'Evening': { start: 17 * 60, end: 21 * 60 },
            'Night': { start: 21 * 60, end: 5 * 60 }
        };
        
        // Events scheduled for specific times
        this.scheduledEvents = [];
        
        // Start time progression
        this.startTimer();
    }
    
    startTimer() {
        this.timer = this.scene.time.addEvent({
            delay: 1000 / this.timeSpeed, // Update based on speed
            callback: this.updateTime,
            callbackScope: this,
            loop: true
        });
    }
    
    updateTime() {
        if (this.isPaused) return;
        
        const previousHour = Math.floor(this.currentTime / 60);
        
        // Advance time
        this.currentTime += 1;
        
        // Check for new day
        if (this.currentTime >= this.dayDuration) {
            this.endDay();
            return;
        }
        
        const currentHour = Math.floor(this.currentTime / 60);
        
        // Check scheduled events
        this.checkScheduledEvents();
        
        // Emit hourly events
        if (currentHour !== previousHour) {
            this.scene.events.emit('hour-changed', currentHour);
            
            // Special time events
            this.checkSpecialTimes(currentHour);
        }
        
        // Update lighting based on time
        this.updateLighting();
    }
    
    checkSpecialTimes(hour) {
        switch(hour) {
            case 7:
                // Morning routine starts
                this.scene.events.emit('morning-routine-start');
                this.scene.showNotification('Morning routine time!');
                break;
                
            case 8:
            case 18:
                // Medication times
                this.scene.events.emit('medication-time', hour);
                this.scene.showNotification('Medication time!');
                break;
                
            case 12:
                // Lunch time
                this.scene.showNotification('Lunch time! Feed the hungry cats');
                break;
                
            case 21:
                // Evening wind down
                this.scene.showNotification('Evening time - cats getting sleepy');
                break;
        }
    }
    
    getCurrentTime() {
        const hours = Math.floor(this.currentTime / 60);
        const minutes = this.currentTime % 60;
        const period = this.getCurrentPeriod();
        
        // Format time string
        const displayHours = hours === 0 ? 12 : (hours > 12 ? hours - 12 : hours);
        const ampm = hours < 12 ? 'AM' : 'PM';
        const timeString = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        
        return {
            hours,
            minutes,
            totalMinutes: this.currentTime,
            string: timeString,
            period: period,
            hour: hours,
            isNight: hours >= 21 || hours < 5
        };
    }
    
    getCurrentPeriod() {
        for (const [period, times] of Object.entries(this.timePeriods)) {
            if (period === 'Night') {
                // Special case for night (crosses midnight)
                if (this.currentTime >= times.start || this.currentTime < times.end) {
                    return period;
                }
            } else {
                if (this.currentTime >= times.start && this.currentTime < times.end) {
                    return period;
                }
            }
        }
        return 'Morning';
    }
    
    setSpeed(speed) {
        this.timeSpeed = speed;
        
        // Restart timer with new speed
        if (this.timer) {
            this.timer.destroy();
        }
        
        this.startTimer();
        
        // Update UI
        this.scene.events.emit('speed-changed', speed);
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
    }
    
    skipToTime(targetHour) {
        const targetMinutes = targetHour * 60;
        
        // If target is earlier than current time, it's next day
        if (targetMinutes < this.currentTime) {
            this.endDay();
            return;
        }
        
        // Fast forward time
        while (this.currentTime < targetMinutes) {
            this.currentTime++;
            this.checkScheduledEvents();
            
            // Update cat needs faster
            this.scene.needManager.update(60); // 1 minute worth of updates
        }
        
        this.updateLighting();
        this.scene.events.emit('time-skipped', targetHour);
    }
    
    scheduleEvent(time, callback, context) {
        this.scheduledEvents.push({
            time: time,
            callback: callback,
            context: context || this,
            executed: false
        });
    }
    
    checkScheduledEvents() {
        this.scheduledEvents.forEach(event => {
            if (!event.executed && this.currentTime >= event.time) {
                event.callback.call(event.context);
                event.executed = true;
            }
        });
        
        // Clean up executed events
        this.scheduledEvents = this.scheduledEvents.filter(event => !event.executed);
    }
    
    updateLighting() {
        // Only update lighting if the overlay exists
        if (!this.scene || !this.scene.lightingOverlay) {
            return;
        }
        
        const hour = Math.floor(this.currentTime / 60);
        let tint = 0xffffff;
        let alpha = 0;
        
        // Dawn (5-7 AM)
        if (hour >= 5 && hour < 7) {
            const progress = (hour - 5) / 2;
            const color = Phaser.Display.Color.Interpolate.ColorWithRGB(
                100, 100, 150, // Night blue
                255, 200, 150, // Dawn orange
                1,
                progress
            );
            tint = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
        }
        // Day (7 AM - 5 PM)
        else if (hour >= 7 && hour < 17) {
            tint = 0xffffff;
            alpha = 0;
        }
        // Dusk (5-7 PM)
        else if (hour >= 17 && hour < 19) {
            const progress = (hour - 17) / 2;
            const color = Phaser.Display.Color.Interpolate.ColorWithRGB(
                255, 255, 255, // Day white
                255, 150, 100, // Sunset orange
                1,
                progress
            );
            tint = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
            alpha = 0.1 * progress;
        }
        // Night (7 PM - 5 AM)
        else {
            tint = 0x646496; // Night blue tint
            alpha = 0.3;
        }
        
        // Apply lighting to scene
        this.scene.lightingOverlay.setFillStyle(tint, alpha);
    }
    
    endDay() {
        this.pause();
        
        // Calculate day score
        const dayScore = this.scene.gameState.startNewDay();
        
        // Reset cats for new day
        this.scene.cats.forEach(cat => cat.dailyReset());
        
        // Reset time
        this.currentTime = 420; // 7:00 AM
        this.scheduledEvents = [];
        
        // Check for game over conditions
        if (this.scene.gameState.catsLost >= 3) {
            this.scene.scene.start('GameOverScene', {
                reason: 'Too many cats lost',
                score: this.scene.gameState.totalScore
            });
            return;
        }
        
        // Continue to next day
        this.scene.time.delayedCall(3000, () => {
            this.resume();
            this.scene.showNotification(`Day ${this.scene.gameState.currentDay} begins!`);
        });
    }
    
    getTimeUntilEvent(targetHour) {
        const targetMinutes = targetHour * 60;
        
        if (targetMinutes > this.currentTime) {
            return targetMinutes - this.currentTime;
        } else {
            // Next day
            return (this.dayDuration - this.currentTime) + targetMinutes;
        }
    }
    
    formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        } else {
            return `${mins}m`;
        }
    }
}
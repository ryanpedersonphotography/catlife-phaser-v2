// Original CatLife cats with their special traits and conflicts
export const ORIGINAL_CATS = {
    gusty: {
        id: 'gusty',
        name: 'Gusty',
        trait: 'always eats other cats\' food',
        startRoom: 'kitchen',
        color: '#FFA500', // Orange
        sprite: 'orange',
        conflicts: ['snicker'],
        bathroomPreference: 'litterbox',
        personality: {
            friendliness: 0.6,
            playfulness: 0.6,
            independence: 0.5,
            vocality: 0.5,
            sleepiness: 0.4,
            messiness: 0.7,
            aggression: 0.3
        },
        specialBehavior: {
            stealFood: true, // Will eat from other cats' bowls
            foodGreedy: true
        }
    },
    
    snicker: {
        id: 'snicker',
        name: 'Snicker',
        trait: 'poops everywhere',
        startRoom: 'livingRoom',
        color: '#8B4513', // Brown
        sprite: 'brown',
        conflicts: ['gusty'],
        bathroomPreference: 'anywhere', // Will poop anywhere
        personality: {
            friendliness: 0.7,
            playfulness: 0.7,
            independence: 0.6,
            vocality: 0.6,
            sleepiness: 0.3,
            messiness: 0.9,
            aggression: 0.2
        },
        specialBehavior: {
            poopsAnywhere: true,
            messFrequency: 'high'
        }
    },
    
    rudy: {
        id: 'rudy',
        name: 'Rudy',
        trait: 'fights with other cats',
        startRoom: 'bedroom',
        color: '#DC143C', // Crimson
        sprite: 'red',
        conflicts: ['scampi', 'stinkylee', 'lucy'],
        bathroomPreference: 'outside',
        personality: {
            friendliness: 0.3,
            playfulness: 0.4,
            independence: 0.8,
            vocality: 0.7,
            sleepiness: 0.3,
            messiness: 0.5,
            aggression: 0.9
        },
        specialBehavior: {
            aggressive: true,
            startsFights: true
        }
    },
    
    scampi: {
        id: 'scampi',
        name: 'Scampi',
        trait: 'pees everywhere',
        startRoom: 'kitchen',
        color: '#FFFF00', // Yellow
        sprite: 'yellow',
        conflicts: ['rudy'],
        bathroomPreference: 'litterbox', // Nervous, prefers litter box
        personality: {
            friendliness: 0.8,
            playfulness: 0.8,
            independence: 0.3,
            vocality: 0.6,
            sleepiness: 0.4,
            messiness: 0.85,
            aggression: 0.1
        },
        specialBehavior: {
            peesAnywhere: true,
            nervous: true,
            messFrequency: 'high'
        }
    },
    
    stinkylee: {
        id: 'stinkylee',
        name: 'Stinky Lee',
        trait: 'mysterious and aloof',
        startRoom: 'bedroom',
        color: '#4B0082', // Indigo
        sprite: 'indigo',
        conflicts: ['rudy'],
        bathroomPreference: 'outside',
        personality: {
            friendliness: 0.3,
            playfulness: 0.3,
            independence: 0.9,
            vocality: 0.2,
            sleepiness: 0.6,
            messiness: 0.4,
            aggression: 0.2
        },
        specialBehavior: {
            aloof: true,
            hidesOften: true
        }
    },
    
    jonah: {
        id: 'jonah',
        name: 'Jonah',
        trait: 'gentle soul',
        startRoom: 'livingRoom',
        color: '#87CEEB', // Sky Blue
        sprite: 'blue',
        conflicts: [], // Gets along with everyone
        bathroomPreference: 'litterbox',
        personality: {
            friendliness: 0.9,
            playfulness: 0.5,
            independence: 0.4,
            vocality: 0.4,
            sleepiness: 0.5,
            messiness: 0.2,
            aggression: 0.0
        },
        specialBehavior: {
            peacemaker: true,
            gentle: true
        }
    },
    
    tink: {
        id: 'tink',
        name: 'Tink',
        trait: 'needs extra attention, loves bathroom',
        startRoom: 'bathroom',
        color: '#FFC0CB', // Pink
        sprite: 'pink',
        conflicts: [],
        bathroomPreference: 'litterbox',
        needsExtra: true,
        favoriteRoom: 'bathroom',
        morningBathroomRequirement: true,
        personality: {
            friendliness: 0.9,
            playfulness: 0.7,
            independence: 0.2,
            vocality: 0.8,
            sleepiness: 0.4,
            messiness: 0.3,
            aggression: 0.1
        },
        specialBehavior: {
            needsExtraAttention: true,
            bathroomLover: true,
            specialCat: true,
            morningRoutine: 'bathroom'
        },
        health: 65 // Lower health - needs extra care
    },
    
    lucy: {
        id: 'lucy',
        name: 'Lucy',
        trait: 'independent and feisty',
        startRoom: 'bedroom',
        color: '#2F4F4F', // Dark Slate Gray
        sprite: 'dark',
        conflicts: ['rudy'],
        bathroomPreference: 'outside',
        personality: {
            friendliness: 0.4,
            playfulness: 0.6,
            independence: 0.85,
            vocality: 0.5,
            sleepiness: 0.35,
            messiness: 0.4,
            aggression: 0.6
        },
        specialBehavior: {
            feisty: true,
            independent: true
        }
    },
    
    giselle: {
        id: 'giselle',
        name: 'Giselle',
        trait: 'graceful and elegant',
        startRoom: 'livingRoom',
        color: '#9370DB', // Medium Purple
        sprite: 'creme', // Using creme as elegant substitute
        conflicts: [],
        bathroomPreference: 'litterbox',
        personality: {
            friendliness: 0.7,
            playfulness: 0.45,
            independence: 0.7,
            vocality: 0.3,
            sleepiness: 0.55,
            messiness: 0.1,
            aggression: 0.05
        },
        specialBehavior: {
            elegant: true,
            cleanly: true
        }
    }
};

// Helper functions
export function getOriginalCatById(id) {
    return ORIGINAL_CATS[id] || null;
}

export function getAllOriginalCats() {
    return Object.values(ORIGINAL_CATS);
}

export function getOriginalCatsByRoom(room) {
    return Object.values(ORIGINAL_CATS).filter(cat => cat.startRoom === room);
}

export function getConflictingCats(catId) {
    const cat = getOriginalCatById(catId);
    return cat ? cat.conflicts : [];
}

// Get initial stats for a cat
export function getInitialStats(catId) {
    const cat = getOriginalCatById(catId);
    return {
        health: cat.health || 75,
        happiness: 50,
        hunger: 70,
        energy: 100,
        messLevel: 0,
        hasPoopedToday: false,
        poopUrgency: 0,
        asleep: false,
        fed: false,
        sleepDebt: 0,
        totalSleepToday: 0
    };
}

// Calculate sleep needs based on personality
export function getSleepNeeds(catId) {
    const cat = getOriginalCatById(catId);
    const baseSleep = cat.personality.sleepiness * 100;
    
    // More sleepy cats need 14-16 hours, less sleepy need 10-12
    const minHours = 10 + (baseSleep / 100) * 4;
    const maxHours = 12 + (baseSleep / 100) * 4;
    
    return {
        minHours: minHours,
        maxHours: maxHours,
        napFrequency: baseSleep / 20 // 0-5 naps per day
    };
}
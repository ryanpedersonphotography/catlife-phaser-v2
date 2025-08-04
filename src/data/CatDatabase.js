export const CAT_DATABASE = {
    gusty: {
        id: 'gusty',
        name: 'Gusty',
        age: 4,
        color: '#FF9F1C', // Orange
        personality: {
            friendliness: 0.7,
            playfulness: 0.6,
            independence: 0.5,
            vocality: 0.6,
            sleepiness: 0.4
        },
        preferences: {
            favoriteRoom: 'kitchen',
            litterPreference: 'open',
            foodPreference: 'any', // Will steal others' food
            sleepSpot: 'kitchen'
        },
        conflicts: ['snicker'],
        specialTrait: 'always eats other cats\' food',
        backstory: 'Gusty is an orange cat who steals food from other cats.',
        sprite: {
            texture: 'cat_gusty',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    snicker: {
        id: 'snicker',
        name: 'Snicker',
        age: 5,
        color: '#8B4513', // Brown
        personality: {
            friendliness: 0.6,
            playfulness: 0.5,
            independence: 0.6,
            vocality: 0.5,
            sleepiness: 0.5
        },
        preferences: {
            favoriteRoom: 'livingroom',
            litterPreference: 'anywhere', // Has accidents
            foodPreference: 'wet',
            sleepSpot: 'couch'
        },
        conflicts: ['gusty'],
        specialTrait: 'poops everywhere',
        backstory: 'Snicker is a brown cat with bathroom issues.',
        sprite: {
            texture: 'cat_snicker',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    rudy: {
        id: 'rudy',
        name: 'Rudy',
        age: 6,
        color: '#E74C3C', // Red
        personality: {
            friendliness: 0.3,
            playfulness: 0.4,
            independence: 0.8,
            vocality: 0.7,
            sleepiness: 0.5
        },
        preferences: {
            favoriteRoom: 'bedroom',
            litterPreference: 'private',
            foodPreference: 'dry',
            sleepSpot: 'bed'
        },
        conflicts: ['scampi', 'stinkylee', 'lucy'],
        specialTrait: 'fights with other cats',
        aggression: 80,
        backstory: 'Rudy is an aggressive red cat who fights with others.',
        sprite: {
            texture: 'cat_rudy',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    scampi: {
        id: 'scampi',
        name: 'Scampi',
        age: 3,
        color: '#FDD835', // Yellow
        personality: {
            friendliness: 0.6,
            playfulness: 0.7,
            independence: 0.5,
            vocality: 0.6,
            sleepiness: 0.4
        },
        preferences: {
            favoriteRoom: 'kitchen',
            litterPreference: 'litterbox', // nervous, prefers litter box
            foodPreference: 'wet',
            sleepSpot: 'sunny spots'
        },
        conflicts: ['rudy'],
        specialTrait: 'pees everywhere',
        bathroomPreference: 'litterbox',
        backstory: 'Scampi is a yellow cat who marks territory inappropriately.',
        sprite: {
            texture: 'cat_scampi',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    stinkylee: {
        id: 'stinkylee',
        name: 'Stinky Lee',
        age: 7,
        color: '#4A148C', // Indigo
        personality: {
            friendliness: 0.4,
            playfulness: 0.3,
            independence: 0.9,
            vocality: 0.2,
            sleepiness: 0.7
        },
        preferences: {
            favoriteRoom: 'bedroom',
            litterPreference: 'outside', // independent, goes outside
            foodPreference: 'dry',
            sleepSpot: 'dark corners'
        },
        conflicts: ['rudy'],
        specialTrait: 'mysterious and aloof',
        bathroomPreference: 'outside',
        backstory: 'Stinky Lee is a mysterious indigo cat who prefers solitude.',
        sprite: {
            texture: 'cat_stinkylee',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    jonah: {
        id: 'jonah',
        name: 'Jonah',
        age: 5,
        color: '#2196F3', // Blue
        personality: {
            friendliness: 0.9,
            playfulness: 0.6,
            independence: 0.4,
            vocality: 0.5,
            sleepiness: 0.6
        },
        preferences: {
            favoriteRoom: 'livingroom',
            litterPreference: 'clean',
            foodPreference: 'wet',
            sleepSpot: 'couch'
        },
        conflicts: [],
        specialTrait: 'gentle soul',
        backstory: 'Jonah is a gentle blue cat who gets along with everyone.',
        sprite: {
            texture: 'cat_jonah',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    tink: {
        id: 'tink',
        name: 'Tink',
        age: 4,
        color: '#E91E63', // Pink
        personality: {
            friendliness: 0.9,
            playfulness: 0.8,
            independence: 0.2,
            vocality: 0.9,
            sleepiness: 0.3
        },
        preferences: {
            favoriteRoom: 'bathroom',
            litterPreference: 'any',
            foodPreference: 'wet',
            sleepSpot: 'bathroom'
        },
        conflicts: [],
        specialTrait: 'needs extra attention, loves bathroom',
        specialNeeds: {
            condition: 'High Maintenance',
            requirement: 'Extra attention and care',
            morningRoutine: true,
            bathroomTime: true
        },
        backstory: 'Tink is a pink cat who needs extra attention and loves the bathroom.',
        sprite: {
            texture: 'cat_tink',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    lucy: {
        id: 'lucy',
        name: 'Lucy',
        age: 6,
        color: '#424242', // Dark gray
        personality: {
            friendliness: 0.5,
            playfulness: 0.6,
            independence: 0.8,
            vocality: 0.6,
            sleepiness: 0.5
        },
        preferences: {
            favoriteRoom: 'bedroom',
            litterPreference: 'private',
            foodPreference: 'dry',
            sleepSpot: 'bed'
        },
        conflicts: ['rudy'],
        specialTrait: 'independent and feisty',
        backstory: 'Lucy is an independent dark gray cat with a feisty personality.',
        sprite: {
            texture: 'cat_lucy',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    giselle: {
        id: 'giselle',
        name: 'Giselle',
        age: 5,
        color: '#F5F5DC', // Creme
        personality: {
            friendliness: 0.8,
            playfulness: 0.5,
            independence: 0.6,
            vocality: 0.4,
            sleepiness: 0.6
        },
        preferences: {
            favoriteRoom: 'livingroom',
            litterPreference: 'clean',
            foodPreference: 'wet',
            sleepSpot: 'sunny spots'
        },
        conflicts: [],
        specialTrait: 'graceful and elegant',
        backstory: 'Giselle is an elegant creme-colored cat with graceful movements.',
        sprite: {
            texture: 'cat_giselle',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    }
};

export function getCatById(id) {
    return CAT_DATABASE[id] || null;
}

export function getAllCats() {
    return Object.values(CAT_DATABASE);
}

export function getCatsByRoom(room) {
    return Object.values(CAT_DATABASE).filter(cat => cat.preferences.favoriteRoom === room);
}

export function getConflictingCats(catId) {
    const cat = getCatById(catId);
    return cat ? cat.conflicts : [];
}

export function getCatsWithSpecialNeeds() {
    return Object.values(CAT_DATABASE).filter(cat => cat.specialNeeds);
}

export function getCatsWithTraits() {
    return Object.values(CAT_DATABASE).filter(cat => cat.specialTrait);
}
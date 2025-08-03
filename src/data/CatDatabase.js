export const CAT_DATABASE = {
    whiskers: {
        id: 'whiskers',
        name: 'Whiskers',
        age: 3,
        color: '#FF6B6B',
        personality: {
            friendliness: 0.8,
            playfulness: 0.9,
            independence: 0.4,
            vocality: 0.7,
            sleepiness: 0.3
        },
        preferences: {
            favoriteRoom: 'livingRoom',
            litterPreference: 'open',
            foodPreference: 'wet',
            sleepSpot: 'windowsill'
        },
        conflicts: [],
        backstory: 'Whiskers is a playful coral-colored cat who loves attention.',
        sprite: {
            texture: 'cat_whiskers',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    simba: {
        id: 'simba',
        name: 'Simba',
        age: 5,
        color: '#FF9F1C',
        personality: {
            friendliness: 0.9,
            playfulness: 0.8,
            independence: 0.5,
            vocality: 0.8,
            sleepiness: 0.4
        },
        preferences: {
            favoriteRoom: 'livingRoom',
            litterPreference: 'covered',
            foodPreference: 'dry',
            sleepSpot: 'couch'
        },
        conflicts: [],
        backstory: 'Simba is a majestic orange cat with a regal personality.',
        sprite: {
            texture: 'cat_simba',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    luna: {
        id: 'luna',
        name: 'Luna',
        age: 4,
        color: '#9B59B6',
        personality: {
            friendliness: 0.6,
            playfulness: 0.5,
            independence: 0.8,
            vocality: 0.4,
            sleepiness: 0.7
        },
        preferences: {
            favoriteRoom: 'bedroom',
            litterPreference: 'quiet',
            foodPreference: 'wet',
            sleepSpot: 'bed'
        },
        conflicts: [],
        backstory: 'Luna is a mysterious purple cat who prefers quiet spaces.',
        sprite: {
            texture: 'cat_luna',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    tigger: {
        id: 'tigger',
        name: 'Tigger',
        age: 2,
        color: '#F39C12',
        personality: {
            friendliness: 0.8,
            playfulness: 0.9,
            independence: 0.3,
            vocality: 0.9,
            sleepiness: 0.2
        },
        preferences: {
            favoriteRoom: 'kitchen',
            litterPreference: 'open',
            foodPreference: 'wet',
            sleepSpot: 'anywhere'
        },
        conflicts: [],
        backstory: 'Tigger is a bouncy golden kitten full of energy.',
        sprite: {
            texture: 'cat_tigger',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    smokey: {
        id: 'smokey',
        name: 'Smokey',
        age: 7,
        color: '#7F8C8D',
        personality: {
            friendliness: 0.5,
            playfulness: 0.4,
            independence: 0.9,
            vocality: 0.3,
            sleepiness: 0.8
        },
        preferences: {
            favoriteRoom: 'bedroom',
            litterPreference: 'covered',
            foodPreference: 'dry',
            sleepSpot: 'closet'
        },
        conflicts: [],
        backstory: 'Smokey is a calm gray cat who enjoys solitude.',
        sprite: {
            texture: 'cat_smokey',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    patches: {
        id: 'patches',
        name: 'Patches',
        age: 6,
        color: '#E74C3C',
        personality: {
            friendliness: 0.7,
            playfulness: 0.6,
            independence: 0.6,
            vocality: 0.5,
            sleepiness: 0.5
        },
        preferences: {
            favoriteRoom: 'livingRoom',
            litterPreference: 'open',
            foodPreference: 'wet',
            sleepSpot: 'couch'
        },
        conflicts: [],
        backstory: 'Patches has distinctive red and white markings.',
        sprite: {
            texture: 'cat_patches',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    shadow: {
        id: 'shadow',
        name: 'Shadow',
        age: 8,
        color: '#2C3E50',
        personality: {
            friendliness: 0.4,
            playfulness: 0.3,
            independence: 0.9,
            vocality: 0.2,
            sleepiness: 0.8
        },
        preferences: {
            favoriteRoom: 'hallway',
            litterPreference: 'private',
            foodPreference: 'dry',
            sleepSpot: 'dark corners'
        },
        conflicts: [],
        backstory: 'Shadow is a dark gray cat who prefers to observe from afar.',
        sprite: {
            texture: 'cat_shadow',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    oreo: {
        id: 'oreo',
        name: 'Oreo',
        age: 3,
        color: '#000000',
        personality: {
            friendliness: 0.8,
            playfulness: 0.7,
            independence: 0.5,
            vocality: 0.6,
            sleepiness: 0.4
        },
        preferences: {
            favoriteRoom: 'kitchen',
            litterPreference: 'open',
            foodPreference: 'wet',
            sleepSpot: 'sunny spots'
        },
        conflicts: [],
        backstory: 'Oreo is a black and white cat with a sweet personality.',
        sprite: {
            texture: 'cat_oreo',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    mittens: {
        id: 'mittens',
        name: 'Mittens',
        age: 5,
        color: '#ECF0F1',
        personality: {
            friendliness: 0.9,
            playfulness: 0.6,
            independence: 0.4,
            vocality: 0.7,
            sleepiness: 0.5
        },
        preferences: {
            favoriteRoom: 'bedroom',
            litterPreference: 'covered',
            foodPreference: 'wet',
            sleepSpot: 'bed'
        },
        conflicts: [],
        backstory: 'Mittens is a pristine white cat who loves to cuddle.',
        sprite: {
            texture: 'cat_mittens',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    felix: {
        id: 'felix',
        name: 'Felix',
        age: 6,
        color: '#34495E',
        personality: {
            friendliness: 0.6,
            playfulness: 0.5,
            independence: 0.7,
            vocality: 0.4,
            sleepiness: 0.6
        },
        preferences: {
            favoriteRoom: 'diningRoom',
            litterPreference: 'open',
            foodPreference: 'dry',
            sleepSpot: 'chair'
        },
        conflicts: [],
        backstory: 'Felix is a charcoal-colored cat with a classic demeanor.',
        sprite: {
            texture: 'cat_felix',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    coco: {
        id: 'coco',
        name: 'Coco',
        age: 4,
        color: '#8B4513',
        personality: {
            friendliness: 0.7,
            playfulness: 0.6,
            independence: 0.6,
            vocality: 0.5,
            sleepiness: 0.5
        },
        preferences: {
            favoriteRoom: 'livingRoom',
            litterPreference: 'covered',
            foodPreference: 'wet',
            sleepSpot: 'carpet'
        },
        conflicts: [],
        backstory: 'Coco is a warm brown cat with a sweet nature.',
        sprite: {
            texture: 'cat_coco',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    pepper: {
        id: 'pepper',
        name: 'Pepper',
        age: 5,
        color: '#5D6D7E',
        personality: {
            friendliness: 0.6,
            playfulness: 0.5,
            independence: 0.7,
            vocality: 0.4,
            sleepiness: 0.6
        },
        preferences: {
            favoriteRoom: 'kitchen',
            litterPreference: 'open',
            foodPreference: 'dry',
            sleepSpot: 'counter'
        },
        conflicts: [],
        backstory: 'Pepper is a blue-gray cat with a spicy personality.',
        sprite: {
            texture: 'cat_pepper',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    boots: {
        id: 'boots',
        name: 'Boots',
        age: 7,
        color: '#D35400',
        personality: {
            friendliness: 0.8,
            playfulness: 0.7,
            independence: 0.5,
            vocality: 0.6,
            sleepiness: 0.4
        },
        preferences: {
            favoriteRoom: 'hallway',
            litterPreference: 'covered',
            foodPreference: 'wet',
            sleepSpot: 'mat'
        },
        conflicts: [],
        backstory: 'Boots is a burnt orange cat who loves to explore.',
        sprite: {
            texture: 'cat_boots',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    bella: {
        id: 'bella',
        name: 'Bella',
        age: 3,
        color: '#F8BBD0',
        personality: {
            friendliness: 0.9,
            playfulness: 0.8,
            independence: 0.3,
            vocality: 0.8,
            sleepiness: 0.3
        },
        preferences: {
            favoriteRoom: 'bedroom',
            litterPreference: 'covered',
            foodPreference: 'wet',
            sleepSpot: 'pillow'
        },
        conflicts: [],
        backstory: 'Bella is a beautiful pink cat who loves attention.',
        sprite: {
            texture: 'cat_bella',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    milo: {
        id: 'milo',
        name: 'Milo',
        age: 4,
        color: '#FFAB00',
        personality: {
            friendliness: 0.8,
            playfulness: 0.7,
            independence: 0.5,
            vocality: 0.6,
            sleepiness: 0.4
        },
        preferences: {
            favoriteRoom: 'livingRoom',
            litterPreference: 'open',
            foodPreference: 'dry',
            sleepSpot: 'sunny spot'
        },
        conflicts: [],
        backstory: 'Milo is an amber-colored cat with a cheerful disposition.',
        sprite: {
            texture: 'cat_milo',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    nala: {
        id: 'nala',
        name: 'Nala',
        age: 6,
        color: '#FDD835',
        personality: {
            friendliness: 0.7,
            playfulness: 0.6,
            independence: 0.6,
            vocality: 0.5,
            sleepiness: 0.5
        },
        preferences: {
            favoriteRoom: 'kitchen',
            litterPreference: 'covered',
            foodPreference: 'wet',
            sleepSpot: 'windowsill'
        },
        conflicts: [],
        backstory: 'Nala is a bright yellow cat with a sunny personality.',
        sprite: {
            texture: 'cat_nala',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    oliver: {
        id: 'oliver',
        name: 'Oliver',
        age: 5,
        color: '#43A047',
        personality: {
            friendliness: 0.6,
            playfulness: 0.5,
            independence: 0.7,
            vocality: 0.4,
            sleepiness: 0.6
        },
        preferences: {
            favoriteRoom: 'diningRoom',
            litterPreference: 'open',
            foodPreference: 'dry',
            sleepSpot: 'chair'
        },
        conflicts: [],
        backstory: 'Oliver is a unique green-tinted cat with a calm nature.',
        sprite: {
            texture: 'cat_oliver',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    roxy: {
        id: 'roxy',
        name: 'Roxy',
        age: 3,
        color: '#E91E63',
        personality: {
            friendliness: 0.8,
            playfulness: 0.9,
            independence: 0.4,
            vocality: 0.8,
            sleepiness: 0.2
        },
        preferences: {
            favoriteRoom: 'livingRoom',
            litterPreference: 'open',
            foodPreference: 'wet',
            sleepSpot: 'anywhere'
        },
        conflicts: [],
        backstory: 'Roxy is a vibrant hot pink cat with lots of energy.',
        sprite: {
            texture: 'cat_roxy',
            animations: {
                idle: { frames: [0, 1], fps: 2 },
                walk: { frames: [2, 3, 4, 5], fps: 8 },
                sleep: { frames: [6, 7], fps: 1 }
            }
        }
    },
    
    chester: {
        id: 'chester',
        name: 'Chester',
        age: 8,
        color: '#FF5722',
        personality: {
            friendliness: 0.6,
            playfulness: 0.4,
            independence: 0.8,
            vocality: 0.5,
            sleepiness: 0.7
        },
        preferences: {
            favoriteRoom: 'bedroom',
            litterPreference: 'covered',
            foodPreference: 'dry',
            sleepSpot: 'bed'
        },
        conflicts: [],
        backstory: 'Chester is a deep orange cat who enjoys his independence.',
        sprite: {
            texture: 'cat_chester',
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
        color: '#FDD835',
        personality: {
            friendliness: 0.9,
            playfulness: 0.9,
            independence: 0.2,
            vocality: 0.8,
            sleepiness: 0.2
        },
        specialNeeds: {
            condition: 'Special Cat',
            requirement: 'Extra attention and care',
            reason: 'Unique personality'
        },
        preferences: {
            favoriteRoom: 'bathroom',
            litterPreference: 'any',
            foodPreference: 'any',
            sleepSpot: 'your lap'
        },
        conflicts: [],
        backstory: 'Tink is a special yellow cat with an extra loving personality.',
        sprite: {
            texture: 'cat_tink',
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
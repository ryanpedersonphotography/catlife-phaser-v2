export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const DEPTHS = {
    BACKGROUND: 0,
    ROOMS: 10,
    OBJECTS: 20,
    CATS: 30,
    UI_BACKGROUND: 100,
    UI_ELEMENTS: 110,
    UI_TEXT: 120,
    TOOLTIPS: 200,
    MODALS: 300,
    LIGHTING: 15
};

export const COLORS = {
    PRIMARY: 0x667eea,
    SECONDARY: 0x764ba2,
    SUCCESS: 0x48bb78,
    WARNING: 0xf6ad55,
    DANGER: 0xf56565,
    INFO: 0x4299e1,
    DARK: 0x2d3748,
    LIGHT: 0xf7fafc,
    WHITE: 0xffffff,
    BLACK: 0x000000
};

export const TIME_CONFIG = {
    MINUTES_PER_HOUR: 2,
    START_HOUR: 7,
    START_MINUTE: 0,
    PERIODS: {
        MORNING: { start: 6, end: 12, name: 'Morning' },
        AFTERNOON: { start: 12, end: 18, name: 'Afternoon' },
        EVENING: { start: 18, end: 22, name: 'Evening' },
        NIGHT: { start: 22, end: 6, name: 'Night' }
    }
};

export const ROOM_TYPES = {
    KITCHEN: 'kitchen',
    LIVING_ROOM: 'livingRoom',
    BEDROOM: 'bedroom',
    BATHROOM: 'bathroom',
    OUTSIDE: 'outside'
};

export const CAT_STATES = {
    IDLE: 'idle',
    WALKING: 'walking',
    EATING: 'eating',
    SLEEPING: 'sleeping',
    PLAYING: 'playing',
    USING_LITTER: 'usingLitter',
    SEEKING_ATTENTION: 'seekingAttention',
    STRESSED: 'stressed',
    SICK: 'sick'
};

export const NEED_TYPES = {
    HUNGER: 'hunger',
    THIRST: 'thirst',
    BATHROOM: 'bathroom',
    SLEEP: 'sleep',
    PLAY: 'play',
    ATTENTION: 'attention',
    HEALTH: 'health'
};

export const ANIMATIONS = {
    CAT_IDLE: 'cat_idle',
    CAT_WALK: 'cat_walk',
    CAT_SLEEP: 'cat_sleep',
    CAT_EAT: 'cat_eat',
    CAT_PLAY: 'cat_play',
    UI_BUTTON_HOVER: 'ui_button_hover',
    UI_BUTTON_CLICK: 'ui_button_click'
};

export const SOUND_KEYS = {
    MEOW_HAPPY: 'meow_happy',
    MEOW_SAD: 'meow_sad',
    MEOW_ANGRY: 'meow_angry',
    PURR: 'purr',
    EATING: 'eating',
    LITTER: 'litter',
    UI_CLICK: 'ui_click',
    UI_HOVER: 'ui_hover',
    NOTIFICATION: 'notification',
    BACKGROUND_MUSIC: 'background_music'
};

export const SAVE_KEYS = {
    GAME_STATE: 'catlife_gamestate',
    SETTINGS: 'catlife_settings',
    STATISTICS: 'catlife_statistics'
};

// Original CatLife game mechanics
export const GAME_MECHANICS = {
    DIFFICULTY: {
        EASY: { energyCost: 0.8, messFrequency: 0.7, conflictChance: 0.5 },
        NORMAL: { energyCost: 1.0, messFrequency: 1.0, conflictChance: 1.0 },
        HARD: { energyCost: 1.3, messFrequency: 1.5, conflictChance: 1.5 }
    },
    ENERGY: {
        MAX: 100,
        FEED_COST: 5,
        PLAY_COST: 10,
        CLEAN_COST: 8,
        MOVE_CAT_COST: 3,
        PET_COST: 2,
        DOOR_COST: 2
    },
    SCORING: {
        FEED_CAT: 10,
        PLAY_WITH_CAT: 15,
        CLEAN_MESS: 20,
        RESOLVE_CONFLICT: 25,
        PET_CAT: 5,
        SPECIAL_CARE_BONUS: 30, // For Tink
        ALL_CATS_FED: 50,
        ALL_CATS_HAPPY: 100,
        UNHAPPY_CAT_PENALTY: -5,
        CONFLICT_PENALTY: -10,
        MESS_PENALTY: -5
    },
    MESS_TYPES: {
        POOP: { emoji: '💩', cleanTime: 3, penalty: 10 },
        PEE: { emoji: '💦', cleanTime: 2, penalty: 5 }
    },
    CONFLICT: {
        DAMAGE_PER_TICK: 5, // Health/happiness damage
        RESOLUTION_DISTANCE: 2 // Rooms apart needed
    }
};

// Cat-specific behaviors from original game
export const CAT_BEHAVIORS = {
    FOOD_STEALING: 'foodStealing', // Gusty
    POOP_ANYWHERE: 'poopAnywhere', // Snicker
    PEE_ANYWHERE: 'peeAnywhere', // Scampi
    AGGRESSIVE: 'aggressive', // Rudy
    NEEDS_ATTENTION: 'needsAttention', // Tink
    ALOOF: 'aloof', // Stinky Lee
    GENTLE: 'gentle', // Jonah
    INDEPENDENT: 'independent', // Lucy
    ELEGANT: 'elegant' // Giselle
};
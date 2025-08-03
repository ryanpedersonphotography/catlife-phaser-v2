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
    DINING_ROOM: 'diningRoom',
    HALLWAY: 'hallway',
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
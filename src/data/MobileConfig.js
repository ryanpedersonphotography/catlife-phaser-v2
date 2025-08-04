// Mobile and tablet-specific configuration
export const MOBILE_CONFIG = {
    // Touch input settings
    TOUCH: {
        MIN_DRAG_DISTANCE: 50,
        DOUBLE_TAP_DELAY: 300,
        LONG_PRESS_DELAY: 500,
        PINCH_ZOOM_ENABLED: false
    },
    
    // UI adjustments for touch
    UI: {
        BUTTON_MIN_SIZE: 64, // Minimum 64px for touch targets
        BUTTON_PADDING: 16,
        FONT_SIZE_MULTIPLIER: 1.2, // Larger text on tablets
        ICON_SIZE_MULTIPLIER: 1.5,
        PANEL_MARGIN: 20
    },
    
    // Device-specific settings
    DEVICES: {
        IPAD: {
            SCALE_MODE: 'FIT',
            ORIENTATION_LOCK: false,
            SAFE_AREA_INSET: {
                TOP: 20,
                BOTTOM: 20,
                LEFT: 0,
                RIGHT: 0
            }
        },
        IPAD_PRO: {
            SCALE_MODE: 'FIT',
            ORIENTATION_LOCK: false,
            SAFE_AREA_INSET: {
                TOP: 24,
                BOTTOM: 20,
                LEFT: 0,
                RIGHT: 0
            }
        }
    },
    
    // Performance settings for mobile
    PERFORMANCE: {
        MAX_PARTICLES: 50,
        ENABLE_SHADOWS: false,
        ANIMATION_QUALITY: 'medium',
        SOUND_QUALITY: 'medium'
    }
};

// Helper function to detect device type
export function getDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIPad = /ipad/.test(userAgent) || 
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isIPadPro = isIPad && (window.screen.width >= 1024 && window.screen.height >= 1366);
    
    if (isIPadPro) return 'IPAD_PRO';
    if (isIPad) return 'IPAD';
    return 'DESKTOP';
}

// Helper function to get device-specific config
export function getDeviceConfig() {
    const deviceType = getDeviceType();
    return MOBILE_CONFIG.DEVICES[deviceType] || MOBILE_CONFIG.DEVICES.IPAD;
}
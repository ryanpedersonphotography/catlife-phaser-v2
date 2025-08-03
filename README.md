# Cat Life - Phaser Version 2

A virtual cat care simulation game built with Phaser 3, where you manage and care for 20 unique cats with different personalities and needs.

## Overview

This is a complete rebuild of the Cat Life game using Phaser.js with proper architecture and modern web development practices. The game features 20 unique cats, each with their own personality, preferences, and behaviors.

## Features

### Core Gameplay
- **20 Unique Cats**: Each cat has distinct personality traits, color, and preferences
- **Real-time Needs System**: Cats have hunger, thirst, bathroom, energy, and happiness needs
- **Day/Night Cycle**: Dynamic lighting and time progression
- **Room-based Layout**: 7 interconnected rooms (Kitchen, Dining Room, Living Room, Hallway, Bathroom, Bedroom, Outside)
- **Interactive Objects**: Food bowls, water bowls, litter boxes, and toys
- **Drag and Drop**: Move cats between rooms
- **Special Cat**: Tink has anxiety and requires daily medication

### Technical Features
- **Modern Architecture**: Scene-based structure with proper separation of concerns
- **Webpack Build System**: Hot reloading and modern JavaScript support
- **Procedural Sprite Generation**: Cats are drawn programmatically with animations
- **Save System**: Persistent game state using localStorage
- **Responsive UI**: Settings, save/load, and cat information panels

## Project Structure

```
catlife-phaser-v2/
├── src/
│   ├── main.js              # Entry point
│   ├── scenes/              # Phaser scenes
│   │   ├── BootScene.js     # Initial setup
│   │   ├── PreloadScene.js  # Asset loading and generation
│   │   ├── MainMenuScene.js # Title screen
│   │   ├── GameScene.js     # Main gameplay
│   │   └── UIScene.js       # UI overlay
│   ├── prefabs/             # Game objects
│   │   ├── Cat.js           # Cat entity with AI
│   │   ├── Room.js          # Room container
│   │   ├── FoodBowl.js      # Food/water bowls
│   │   └── LitterBox.js     # Litter box object
│   ├── systems/             # Game systems
│   │   ├── TimeManager.js   # Day/night cycle
│   │   ├── NeedManager.js   # Cat needs calculation
│   │   └── GameState.js     # Save/load system
│   └── data/                # Game data
│       ├── Constants.js     # Game constants
│       ├── CatDatabase.js   # All cat definitions
│       └── RoomLayout.js    # Room configurations
├── assets/                  # Game assets
│   └── sprites/            # Generated sprites
├── dist/                   # Build output
├── webpack.config.js       # Webpack configuration
├── package.json           # Dependencies
└── index.html            # Game container
```

## Development History

### Version 2.0 - Complete Phaser Rebuild
- Rebuilt from scratch using Phaser 3
- Implemented proper game architecture with scenes
- Created modular prefab system for game objects
- Added webpack for modern development workflow

### Major Fixes and Improvements
1. **Asset Loading Issues**
   - Fixed texture generation timing (moved from preload to create phase)
   - Resolved sprite sheet frame mapping
   - Added error handling for missing assets

2. **Cat Visibility**
   - Fixed sprite rendering by adding proper frame configuration
   - Added colored circle fallbacks for each cat
   - Improved procedural cat drawing with better proportions

3. **Special Needs System**
   - Fixed undefined property errors for cats without special needs
   - Added proper null checking throughout codebase
   - Tink's anxiety medication system working correctly

4. **Sprite Generation**
   - Created SVG-based sprite generation system
   - Generated unique sprites for all 20 cats
   - Implemented 8-frame animations (idle, walk, sleep)

## Technologies Used

- **Phaser 3.70.0**: Game framework
- **Webpack 5**: Module bundler
- **Babel**: JavaScript transpiler
- **ImageMagick**: Sprite generation from SVG
- **Node.js**: Build tools and development server

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm start
   ```

3. Open http://localhost:8080 in your browser

## Build

To create a production build:
```bash
npm run build
```

The built files will be in the `dist/` directory.

## Cat Database

All 20 cats with their unique characteristics:
- Whiskers (Coral) - Playful and attention-seeking
- Simba (Orange) - Friendly king of the cats
- Luna (Purple) - Mysterious night owl
- Tigger (Gold) - Energetic bouncer
- Smokey (Gray) - Lazy philosopher
- Patches (Red/White) - Social butterfly
- Shadow (Dark Gray) - Stealthy hunter
- Oreo (Black/White) - Sweet treat lover
- Mittens (White) - Proper and elegant
- Felix (Charcoal) - Lucky troublemaker
- Coco (Brown) - Gentle soul
- Pepper (Blue-Gray) - Spicy personality
- Boots (Burnt Orange) - Adventure seeker
- Bella (Pink) - Beautiful diva
- Milo (Amber) - Friendly explorer
- Nala (Yellow) - Brave lioness
- Oliver (Green) - Curious wanderer
- Roxy (Hot Pink) - Rock star attitude
- Chester (Deep Orange) - Mischievous prankster
- Tink (Yellow) - Special needs cat with anxiety

## Game Controls

- **Click on cats**: View their stats and needs
- **Drag cats**: Move them between rooms
- **Click food/water bowls**: Fill them when empty
- **Click litter boxes**: Clean when dirty
- **Settings button**: Access save/load and options
- **Pause button**: Pause the game

## Known Issues

- Cat sprites may appear as colored circles if texture generation fails
- Some animations may not play smoothly on first load
- Performance may vary with all 20 cats active

## Future Improvements

- Add more cat behaviors and interactions
- Implement cat relationships and social dynamics
- Add mini-games and activities
- Create custom cat editor
- Add achievements and progression system

## Credits

Created as a Phaser.js learning project. Inspired by virtual pet games and cat care simulations.

## License

This project is licensed under the MIT License.

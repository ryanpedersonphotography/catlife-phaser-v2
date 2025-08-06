# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with hot reloading on http://localhost:8080
- `npm run build` - Create production build in dist/ directory  
- `npm start` - Serve production build with http-server

### Asset Generation
- `./generate-sprites.sh` - Generate cat sprite sheets from SVG files (requires ImageMagick)
- `./generate-cat-sprites.sh` - Generate individual cat sprites
- `./generate-simple-cat-sprites.sh` - Generate simplified cat sprites

## Architecture

### Scene-Based Game Flow
The game uses Phaser 3's scene system with the following flow:
1. **BootScene** → Initial configuration and scaling setup
2. **PreloadScene** → Asset loading and procedural sprite generation
3. **MainMenuScene** → Title screen with start button
4. **GameScene + UIScene** → Main gameplay (runs in parallel)
5. **PauseScene/GameOverScene/DaySummaryScene** → Overlay scenes

### Core Systems

**Cat Entity System** (`src/prefabs/Cat.js`)
- Each cat has personality traits, needs (hunger, thirst, bathroom, energy, happiness), and behaviors
- Pathfinding between rooms through doors
- 8-frame animations: idle (0-1), walk (2-5), sleep (6-7)
- Special cat "Tink" requires daily medication for anxiety

**Room & Navigation** (`src/prefabs/Room.js`, `src/prefabs/Door.js`)
- 7 rooms: Kitchen, Dining Room, Living Room, Hallway, Bathroom, Bedroom, Outside
- Doors connect rooms with pathfinding constraints
- Cats must walk through doors to move between rooms

**Time & Needs** (`src/systems/TimeManager.js`, `src/systems/NeedManager.js`)
- Day/night cycle affects lighting and cat behavior
- Needs decay over time based on personality traits
- Critical needs trigger autonomous behaviors

**Save System** (`src/systems/GameState.js`)
- Uses localStorage for persistence
- Saves cat positions, needs, and game time

### Asset Pipeline

Sprites are procedurally generated or loaded from pre-generated PNG files:
- Cat sprites: 512x64px sprite sheets (8 frames of 64x64)
- Fallback: Colored circles if sprites fail to load
- SVG → PNG conversion pipeline for sprite generation

### Key Data Files

- `src/data/CatDatabase.js` - All 20 cat definitions with personalities
- `src/data/Constants.js` - Game constants (speeds, decay rates, etc.)
- `src/data/RoomLayout.js` - Room positions and connections
- `src/data/CatSpriteMapping.js` - Maps cats to sprite assets

## Important Considerations

### Asset Loading
- Texture generation moved from preload to create phase to avoid timing issues
- Always check if textures exist before using them
- Provide fallbacks for missing assets

### Special Needs System
- Always null-check `specialNeeds` property on cats
- Only "Tink" has special needs (anxiety medication)
- Other cats should have `specialNeeds: null`

### Pathfinding
- Cats must use doors to move between rooms
- Path is calculated using `Pathfinding.js` system
- Animations play during movement between rooms

### Mobile Support
- Touch input enabled with multi-pointer support
- Responsive scaling using Phaser.Scale.FIT
- UI adapts to different screen sizes
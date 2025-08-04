// Original CatLife room layout with 4 main rooms
export const ORIGINAL_ROOM_LAYOUT = {
    kitchen: {
        id: 'kitchen',
        name: 'Kitchen',
        x: 50,
        y: 50,
        width: 400,
        height: 300,
        color: 0xFFE5CC, // Light orange/beige
        objects: {
            foodBowl: {
                x: 250,
                y: 150,
                maxFood: 10,
                currentFood: 0
            },
            litterBoxes: [
                {
                    id: 'kitchen-box',
                    x: 100,
                    y: 250,
                    cleanliness: 100,
                    maxCapacity: 5,
                    currentUses: 0
                }
            ]
        },
        connections: ['livingRoom']
    },
    
    livingRoom: {
        id: 'livingRoom',
        name: 'Living Room',
        x: 500,
        y: 50,
        width: 450,
        height: 300,
        color: 0xE8D5C4, // Light brown
        objects: {
            litterBoxes: [
                {
                    id: 'livingroom-box',
                    x: 300,
                    y: 300,
                    cleanliness: 100,
                    maxCapacity: 5,
                    currentUses: 0
                }
            ],
            toys: [
                { x: 200, y: 150, type: 'ball' },
                { x: 350, y: 200, type: 'mouse' }
            ]
        },
        connections: ['kitchen', 'bedroom', 'bathroom']
    },
    
    bedroom: {
        id: 'bedroom',
        name: 'Bedroom',
        x: 50,
        y: 400,
        width: 400,
        height: 250,
        color: 0xD4C5F9, // Light purple
        objects: {
            litterBoxes: [
                {
                    id: 'bedroom-box',
                    x: 200,
                    y: 200,
                    cleanliness: 100,
                    maxCapacity: 5,
                    currentUses: 0
                }
            ],
            beds: [
                { x: 100, y: 100, type: 'cat-bed' },
                { x: 300, y: 100, type: 'cat-bed' }
            ]
        },
        connections: ['livingRoom']
    },
    
    bathroom: {
        id: 'bathroom',
        name: 'Bathroom',
        x: 500,
        y: 400,
        width: 450,
        height: 250,
        color: 0xB4E4FF, // Light blue
        objects: {
            litterBoxes: [
                {
                    id: 'bathroom-box',
                    x: 200,
                    y: 100,
                    cleanliness: 100,
                    maxCapacity: 5,
                    currentUses: 0
                }
            ],
            waterBowl: {
                x: 350,
                y: 150,
                currentWater: 100
            }
        },
        connections: ['livingRoom']
    }
};

// Door system for going outside
export const DOOR_CONFIG = {
    position: { x: 950, y: 200 },
    width: 50,
    height: 100,
    isOpen: false,
    connectedRooms: ['livingRoom', 'outside']
};

// Outside area (not a room, but a special zone)
export const OUTSIDE_AREA = {
    id: 'outside',
    name: 'Outside',
    x: 1000,
    y: 50,
    width: 200,
    height: 600,
    color: 0x90EE90, // Light green
    isSpecial: true,
    requiresDoorOpen: true,
    catsWaitingToGoOut: [],
    catsWaitingToComeIn: [],
    catsOutside: []
};

// Helper functions
export function getRoomById(roomId) {
    if (roomId === 'outside') return OUTSIDE_AREA;
    return ORIGINAL_ROOM_LAYOUT[roomId] || null;
}

export function getRoomsConnectedTo(roomId) {
    const room = getRoomById(roomId);
    return room ? room.connections : [];
}

export function canMoveBetweenRooms(fromRoomId, toRoomId, isDoorOpen = false) {
    // Special handling for outside
    if (toRoomId === 'outside' || fromRoomId === 'outside') {
        return isDoorOpen && (
            (fromRoomId === 'livingRoom' && toRoomId === 'outside') ||
            (fromRoomId === 'outside' && toRoomId === 'livingRoom')
        );
    }
    
    const fromRoom = getRoomById(fromRoomId);
    const toRoom = getRoomById(toRoomId);
    
    if (!fromRoom || !toRoom) return false;
    
    // Check if rooms are connected
    return fromRoom.connections && fromRoom.connections.includes(toRoomId);
}

export function getAllRooms() {
    return Object.values(ORIGINAL_ROOM_LAYOUT);
}

export function getIndoorRooms() {
    return Object.values(ORIGINAL_ROOM_LAYOUT);
}
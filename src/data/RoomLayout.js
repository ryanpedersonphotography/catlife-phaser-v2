import { ROOM_TYPES } from './Constants';

export const ROOM_LAYOUT = {
    [ROOM_TYPES.KITCHEN]: {
        id: ROOM_TYPES.KITCHEN,
        name: 'Kitchen',
        x: 50,
        y: 100,
        width: 350,
        height: 250,
        color: 0xFFE5CC,
        objects: {
            foodBowls: [
                { x: 100, y: 200 },
                { x: 150, y: 200 }
            ]
        },
        connections: [ROOM_TYPES.DINING_ROOM, ROOM_TYPES.HALLWAY]
    },
    
    [ROOM_TYPES.DINING_ROOM]: {
        id: ROOM_TYPES.DINING_ROOM,
        name: 'Dining Room',
        x: 420,
        y: 100,
        width: 350,
        height: 250,
        color: 0xF0E5CF,
        objects: {},
        connections: [ROOM_TYPES.KITCHEN, ROOM_TYPES.LIVING_ROOM, ROOM_TYPES.HALLWAY]
    },
    
    [ROOM_TYPES.LIVING_ROOM]: {
        id: ROOM_TYPES.LIVING_ROOM,
        name: 'Living Room',
        x: 790,
        y: 100,
        width: 400,
        height: 250,
        color: 0xE8D5C4,
        objects: {},
        connections: [ROOM_TYPES.DINING_ROOM, ROOM_TYPES.HALLWAY, ROOM_TYPES.OUTSIDE]
    },
    
    [ROOM_TYPES.HALLWAY]: {
        id: ROOM_TYPES.HALLWAY,
        name: 'Hallway',
        x: 50,
        y: 370,
        width: 1140,
        height: 80,
        color: 0xD2B48C,
        objects: {},
        connections: [ROOM_TYPES.KITCHEN, ROOM_TYPES.DINING_ROOM, ROOM_TYPES.LIVING_ROOM, 
                      ROOM_TYPES.BATHROOM, ROOM_TYPES.BEDROOM]
    },
    
    [ROOM_TYPES.BATHROOM]: {
        id: ROOM_TYPES.BATHROOM,
        name: 'Bathroom',
        x: 50,
        y: 470,
        width: 350,
        height: 200,
        color: 0xB4E4FF,
        objects: {},
        connections: [ROOM_TYPES.HALLWAY]
    },
    
    [ROOM_TYPES.BEDROOM]: {
        id: ROOM_TYPES.BEDROOM,
        name: 'Bedroom',
        x: 420,
        y: 470,
        width: 770,
        height: 200,
        color: 0xD4C5F9,
        objects: {},
        connections: [ROOM_TYPES.HALLWAY]
    },
    
    [ROOM_TYPES.OUTSIDE]: {
        id: ROOM_TYPES.OUTSIDE,
        name: 'Outside',
        x: 1210,
        y: 100,
        width: 300,
        height: 570,
        color: 0x90EE90,
        objects: {},
        connections: [ROOM_TYPES.LIVING_ROOM],
        requiresDoorOpen: true
    }
};

export function getRoomById(roomId) {
    return ROOM_LAYOUT[roomId] || null;
}

export function getRoomsConnectedTo(roomId) {
    const room = getRoomById(roomId);
    return room ? room.connections : [];
}

export function canMoveBetweenRooms(fromRoomId, toRoomId, isDoorOpen = false) {
    const fromRoom = getRoomById(fromRoomId);
    const toRoom = getRoomById(toRoomId);
    
    if (!fromRoom || !toRoom) return false;
    
    // Check if rooms are connected
    if (!fromRoom.connections.includes(toRoomId)) return false;
    
    // Check if door needs to be open
    if (toRoom.requiresDoorOpen && !isDoorOpen) return false;
    if (fromRoom.requiresDoorOpen && !isDoorOpen) return false;
    
    return true;
}
export default class Pathfinding {
    constructor(scene) {
        this.scene = scene;
        this.roomGraph = this.buildRoomGraph();
    }

    buildRoomGraph() {
        // Define room connections based on the house layout
        // Each room connects to others through doors
        const connections = {
            kitchen: ['hallway'],
            diningRoom: ['hallway'],
            livingRoom: ['hallway', 'outside'],
            hallway: ['kitchen', 'diningRoom', 'livingRoom', 'bathroom', 'bedroom'],
            bathroom: ['hallway'],
            bedroom: ['hallway'],
            outside: ['livingRoom']
        };

        // Build adjacency list with door positions
        const graph = {};
        
        Object.entries(connections).forEach(([roomId, connectedRooms]) => {
            graph[roomId] = {
                connections: connectedRooms,
                doors: this.getDoorPositions(roomId, connectedRooms)
            };
        });

        return graph;
    }

    getDoorPositions(roomId, connectedRooms) {
        const doors = {};
        const room = this.scene.rooms[roomId];
        if (!room) return doors;

        // Define door positions based on room layout
        const doorPositions = {
            kitchen: {
                hallway: { x: room.x + room.width, y: room.y + room.height / 2 }
            },
            diningRoom: {
                hallway: { x: room.x + room.width, y: room.y + room.height / 2 }
            },
            livingRoom: {
                hallway: { x: room.x, y: room.y + room.height / 2 },
                outside: { x: room.x + room.width - 50, y: room.y + room.height / 2 }
            },
            hallway: {
                kitchen: { x: room.x + 100, y: room.y },
                diningRoom: { x: room.x + 450, y: room.y },
                livingRoom: { x: room.x + 800, y: room.y },
                bathroom: { x: room.x + 100, y: room.y + room.height },
                bedroom: { x: room.x + 600, y: room.y + room.height }
            },
            bathroom: {
                hallway: { x: room.x + room.width / 2, y: room.y }
            },
            bedroom: {
                hallway: { x: room.x + room.width / 2, y: room.y }
            },
            outside: {
                livingRoom: { x: room.x, y: room.y + 100 }
            }
        };

        connectedRooms.forEach(targetRoom => {
            if (doorPositions[roomId] && doorPositions[roomId][targetRoom]) {
                doors[targetRoom] = doorPositions[roomId][targetRoom];
            }
        });

        return doors;
    }

    findPath(startRoomId, targetRoomId) {
        if (startRoomId === targetRoomId) {
            return [];
        }

        // Use BFS to find shortest path through rooms
        const queue = [[startRoomId]];
        const visited = new Set([startRoomId]);

        while (queue.length > 0) {
            const path = queue.shift();
            const currentRoom = path[path.length - 1];

            const connections = this.roomGraph[currentRoom]?.connections || [];
            
            for (const nextRoom of connections) {
                if (nextRoom === targetRoomId) {
                    return [...path, nextRoom];
                }

                if (!visited.has(nextRoom)) {
                    visited.add(nextRoom);
                    queue.push([...path, nextRoom]);
                }
            }
        }

        return null; // No path found
    }

    getWaypoints(cat, targetRoom) {
        const currentRoomId = cat.currentRoom?.id;
        const targetRoomId = targetRoom.id;

        if (!currentRoomId || !targetRoomId) {
            return [];
        }

        const roomPath = this.findPath(currentRoomId, targetRoomId);
        if (!roomPath || roomPath.length === 0) {
            return [];
        }

        const waypoints = [];
        
        // For each room transition, add door waypoints
        for (let i = 0; i < roomPath.length - 1; i++) {
            const fromRoom = roomPath[i];
            const toRoom = roomPath[i + 1];
            
            // Get door position from current room to next room
            const doorPos = this.roomGraph[fromRoom]?.doors[toRoom];
            if (doorPos) {
                waypoints.push({
                    x: doorPos.x,
                    y: doorPos.y,
                    type: 'door',
                    fromRoom,
                    toRoom
                });
            }

            // If not the last room, add a point inside the next room
            if (i < roomPath.length - 2) {
                const nextRoom = this.scene.rooms[toRoom];
                if (nextRoom) {
                    waypoints.push({
                        x: nextRoom.x + nextRoom.width / 2,
                        y: nextRoom.y + nextRoom.height / 2,
                        type: 'room_center',
                        room: toRoom
                    });
                }
            }
        }

        // Add final target position
        const finalRoom = this.scene.rooms[targetRoomId];
        if (finalRoom) {
            waypoints.push({
                x: finalRoom.x + finalRoom.width / 2,
                y: finalRoom.y + finalRoom.height / 2,
                type: 'destination',
                room: targetRoomId
            });
        }

        return waypoints;
    }

    getWaypointsToPosition(cat, targetX, targetY) {
        const currentRoomId = cat.currentRoom?.id;
        const targetRoom = this.scene.getRoomAt(targetX, targetY);
        
        if (!currentRoomId || !targetRoom) {
            return [];
        }

        if (currentRoomId === targetRoom.id) {
            // Same room, direct path
            return [{
                x: targetX,
                y: targetY,
                type: 'destination',
                room: currentRoomId
            }];
        }

        // Get waypoints to target room
        const waypoints = this.getWaypoints(cat, targetRoom);
        
        // Replace last waypoint with exact target position
        if (waypoints.length > 0) {
            waypoints[waypoints.length - 1] = {
                x: targetX,
                y: targetY,
                type: 'destination',
                room: targetRoom.id
            };
        }

        return waypoints;
    }

    canReachRoom(fromRoomId, toRoomId) {
        // Special check for outside room - requires open door
        if (toRoomId === 'outside' || fromRoomId === 'outside') {
            const isDoorOpen = this.scene.registry.get('isDoorOpen');
            if (!isDoorOpen) {
                return false;
            }
        }

        const path = this.findPath(fromRoomId, toRoomId);
        return path !== null;
    }
}
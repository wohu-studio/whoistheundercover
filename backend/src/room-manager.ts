import { Room, RoomStatus } from "../../shared/types/room";
import { GameTypeEnum } from "../../shared/types/enums";
import { Player } from "../../shared/types/player";
import { generateRoomId } from "./utils/room-id-generator";

export class RoomManager {
  private rooms: Map<string, Room> = new Map();

  async createRoom(
    hostId: string,
    hostNickname: string,
    hostSocketId: string,
    avatar?: string
  ): Promise<Room> {
    const roomId = await this.generateUniqueRoomId();
    const host: Player = {
      id: hostId,
      socketId: hostSocketId,
      nickname: hostNickname,
      avatar,
      isAlive: true,
      isHost: true,
      isPlaying: false,
      isReady: true,
      isConnected: true,
    };

    const room: Room = {
      id: roomId,
      status: RoomStatus.WAITING,
      gameType: null,
      players: [host],
      hostId: hostId,
      config: {},
    };

    this.rooms.set(roomId, room);
    return room;
  }

  async getRoom(roomId: string): Promise<Room | undefined> {
    return this.rooms.get(roomId);
  }

  async deleteRoom(roomId: string): Promise<boolean> {
    return this.rooms.delete(roomId);
  }

  async addPlayer(roomId: string, player: Player): Promise<boolean> {
    const room = await this.getRoom(roomId);
    if (!room) return false;

    if (player.isReady === undefined) {
      player.isReady = false;
    }

    const existingPlayerIndex = room.players.findIndex(p => p.id === player.id);
    if (existingPlayerIndex >= 0) {
      room.players[existingPlayerIndex].socketId = player.socketId;
      room.players[existingPlayerIndex].isConnected = true;
      return true;
    }

    room.players.push(player);
    return true;
  }

  async removePlayer(roomId: string, playerId: string): Promise<boolean> {
    const room = await this.getRoom(roomId);
    if (!room) return false;

    const index = room.players.findIndex(p => p.id === playerId);
    if (index >= 0) {
      room.players.splice(index, 1);

      if (playerId === room.hostId) {
        await this.deleteRoom(roomId);
        return true;
      }

      return true;
    }
    return false;
  }

  async updateRoomStatus(roomId: string, status: RoomStatus): Promise<boolean> {
    const room = await this.getRoom(roomId);
    if (!room) return false;
    room.status = status;
    return true;
  }

  async updateRoomGameType(
    roomId: string,
    gameType: GameTypeEnum
  ): Promise<boolean> {
    const room = await this.getRoom(roomId);
    if (!room) return false;
    room.gameType = gameType;
    return true;
  }

  async getRoomSocketIds(roomId: string): Promise<string[]> {
    const room = await this.getRoom(roomId);
    if (!room) return [];
    return room.players.map(p => p.socketId);
  }

  async getAllRoomIds(): Promise<string[]> {
    return Array.from(this.rooms.keys());
  }

  async findRoomByPlayerId(playerId: string): Promise<Room | undefined> {
    for (const room of this.rooms.values()) {
      if (room.players.some(p => p.id === playerId)) {
        return room;
      }
    }
    return undefined;
  }

  async findRoomBySocketId(socketId: string): Promise<Room | undefined> {
    for (const room of this.rooms.values()) {
      if (room.players.some(p => p.socketId === socketId)) {
        return room;
      }
    }
    return undefined;
  }

  /** Export all rooms for persistence */
  getRoomsMap(): Map<string, Room> {
    return this.rooms;
  }

  /** Restore rooms from persisted state */
  restoreRooms(rooms: Map<string, Room>): void {
    this.rooms = rooms;
    // Clear stale socket IDs since they won't be valid after restart
    for (const room of this.rooms.values()) {
      for (const player of room.players) {
        player.socketId = "";
      }
    }
    console.log(`Restored ${this.rooms.size} rooms`);
  }

  private async generateUniqueRoomId(): Promise<string> {
    let roomId = generateRoomId();
    while (this.rooms.has(roomId)) {
      roomId = generateRoomId();
    }
    return roomId;
  }
}

import { Player } from "./player";
import { RoomStatus, GameTypeEnum } from "./enums";

export interface RoomConfig {
  customWordPairs?: Array<{ A: string; B: string }>;
  customTasks?: string[];
  numUndercovers?: number;
  hostIsPlaying?: boolean;
  spyWordMode?: 'same' | 'blank';
  wordCategory?: string;
  numWolves?: number;
  taskCategory?: string;
  designatedWolfIds?: string[];  // host picks who is wolf
}

export interface Room {
  id: string;
  status: RoomStatus;
  gameType: GameTypeEnum | null;
  players: Player[];
  hostId: string;
  config: RoomConfig;
  gameState?: unknown; // Sanitized game state DTO, populated during broadcast
}

export { RoomStatus, GameTypeEnum };

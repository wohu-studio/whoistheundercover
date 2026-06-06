import { GameDataPayload } from "./game-data";
import { ReadyState } from "./enums";

export enum PlayerRole {
  CIVILIAN = "CIVILIAN",
  UNDERCOVER = "UNDERCOVER",
  WOLF = "WOLF",
  VILLAGER = "VILLAGER",
}

export interface Player {
  id: string;
  socketId: string;
  nickname: string;
  avatar?: string;
  role?: PlayerRole;
  gameData?: GameDataPayload;
  isAlive: boolean;
  isHost: boolean;
  isPlaying: boolean;
  isReady?: boolean;
  isConnected: boolean;
}

export interface PlayerDTO {
  id: string;
  nickname: string;
  avatar?: string;
  role?: PlayerRole;
  gameData?: GameDataPayload;
  isAlive: boolean;
  isHost: boolean;
  isPlaying: boolean;
  isReady?: boolean;
  isConnected: boolean;
}

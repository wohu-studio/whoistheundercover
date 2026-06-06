import { RoomConfig } from "../types/room";
import { RoomStatus, GameTypeEnum } from "../types/enums";
import { PlayerDTO } from "../types/player";

export interface CreateRoomDto {
  hostId: string;
  hostNickname: string;
}

export interface JoinRoomDto {
  roomId: string;
  nickname: string;
  isHost: boolean;
}

export interface UpdateRoomDto {
  id: string;
  status?: RoomStatus;
  gameType?: GameTypeEnum | null;
  players?: PlayerDTO[];
  hostId?: string;
  config?: RoomConfig;
}

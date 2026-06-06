import { PlayerDTO, PlayerRole } from "../types/player";
import { GameDataPayload } from "../types/game-data";

export { PlayerDTO };

export interface UpdatePlayerDto {
  id: string;
  nickname?: string;
  avatar?: string;
  role?: PlayerRole;
  gameData?: GameDataPayload;
  isAlive?: boolean;
  isHost?: boolean;
  isPlaying?: boolean;
}

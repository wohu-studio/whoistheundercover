import { Player, PlayerDTO } from "../../../shared/types/player";
import {
  GameDataPayload,
  UndercoverGameData,
  TaskWolfGameData,
} from "../../../shared/types/game-data";
import { PlayerRole } from "../../../shared/types/player";

/**
 * Converts a Player (backend) to PlayerDTO (frontend)
 * Removes socketId and sanitizes gameData based on visibility rules
 */
export function sanitizePlayer(player: Player, viewerId?: string): PlayerDTO {
  const dto: PlayerDTO = {
    id: player.id,
    nickname: player.nickname,
    avatar: player.avatar,
    role: player.role,
    gameData: sanitizeGameData(
      player.gameData,
      player.role,
      viewerId === player.id
    ),
    isAlive: player.isAlive,
    isHost: player.isHost,
    isPlaying: player.isPlaying,
    isReady: player.isReady ?? false,
    isConnected: player.isConnected,
  };

  return dto;
}

/**
 * Sanitizes game data based on game rules and viewer permissions
 * - For Undercover: Players only see their own word, not their role
 * - For TaskWolf: Players see their role, wolves see their task
 * - Host sees everything
 */
function sanitizeGameData(
  gameData: GameDataPayload | undefined,
  playerRole: PlayerRole | undefined,
  isOwnData: boolean
): GameDataPayload | undefined {
  if (!gameData) return undefined;

  // If viewing own data, return as-is (will be filtered by game rules)
  if (isOwnData) {
    return gameData;
  }

  // For Undercover game: other players shouldn't see your word
  if (gameData.gameType === "UNDERCOVER") {
    return null; // Don't reveal other players' words
  }

  // For TaskWolf: other players can see role but not task
  if (gameData.gameType === "TASKWOLF") {
    // Return role info but remove task
    return {
      gameType: "TASKWOLF",
      task: "", // Hide task from other players
    } as TaskWolfGameData;
  }

  return null;
}

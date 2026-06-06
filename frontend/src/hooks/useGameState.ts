import { useSocket } from "./useSocket";
import { GameStateDTO } from "@shared/types/game-state";

export function useGameState() {
  const { room, socket, isConnected, playerId } = useSocket();

  const currentPlayer = room?.players.find(p => p.id === playerId);
  const isHost = currentPlayer?.isHost || false;
  const gameState = room?.gameState as GameStateDTO | undefined;

  return {
    room,
    currentPlayer,
    isHost,
    isConnected,
    players: room?.players || [],
    gameState,
  };
}

export { useSocket } from "./useSocket";

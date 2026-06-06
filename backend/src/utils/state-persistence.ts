import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { Room } from "../../../shared/types/room";
import { GameState } from "../../../shared/types/game-state";

const STATE_FILE = join(__dirname, "../../.state.json");

interface PersistedState {
  rooms: Record<string, Room>;
  gameStates: Record<string, GameState>;
  savedAt: string;
}

export function saveState(
  rooms: Map<string, Room>,
  gameStates: Map<string, GameState>
): void {
  const state: PersistedState = {
    rooms: Object.fromEntries(rooms),
    gameStates: Object.fromEntries(gameStates),
    savedAt: new Date().toISOString(),
  };

  try {
    writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
    console.log(`State saved: ${rooms.size} rooms, ${gameStates.size} games`);
  } catch (e) {
    console.error("Failed to save state:", e);
  }
}

export function loadState(): {
  rooms: Map<string, Room>;
  gameStates: Map<string, GameState>;
} | null {
  if (!existsSync(STATE_FILE)) return null;

  try {
    const raw = readFileSync(STATE_FILE, "utf-8");
    const state: PersistedState = JSON.parse(raw);

    const rooms = new Map<string, Room>(Object.entries(state.rooms));
    const gameStates = new Map<string, GameState>(
      Object.entries(state.gameStates)
    );

    console.log(
      `State restored from ${state.savedAt}: ${rooms.size} rooms, ${gameStates.size} games`
    );
    return { rooms, gameStates };
  } catch (e) {
    console.error("Failed to load state:", e);
    return null;
  }
}

export function clearState(): void {
  try {
    if (existsSync(STATE_FILE)) {
      writeFileSync(STATE_FILE, "{}", "utf-8");
    }
  } catch (e) {
    // ignore
  }
}

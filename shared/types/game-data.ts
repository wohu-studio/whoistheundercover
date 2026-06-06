/**
 * Game-specific player data payloads
 * Each game type can extend this union type with its own payload structure
 */

export interface UndercoverGameData {
  gameType: "UNDERCOVER";
  word: string; // empty string for blank card spies
}

export interface TaskWolfGameData {
  gameType: "TASKWOLF";
  task: string;
}

export interface ColourHuntGameData {
  gameType: "COLOUR_HUNT";
  colour: string;     // colour name e.g. "红色"
  colourHex: string;  // hex value e.g. "#EF4444"
  snackHint: string;  // snack suggestion e.g. "草莓、西瓜、番茄"
}

export type GameDataPayload = UndercoverGameData | TaskWolfGameData | ColourHuntGameData | null;

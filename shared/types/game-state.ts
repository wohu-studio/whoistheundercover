import { PlayerRole } from './player';

export interface UndercoverGameState {
  type: 'UNDERCOVER';
  wordPairs: Array<{ A: string; B: string }>;
  assignedWords: Record<string, string>;
  assignedRoles: Record<string, PlayerRole>;
  phase: 'PLAYING' | 'REVEAL' | 'RESULT';
  round: number;
  votes: Record<string, string>;
  votedPlayerIds: string[];
  revealedVotes: boolean;
  eliminatedPlayerIds: string[];
  winner?: 'CIVILIAN' | 'UNDERCOVER';
}

export interface UndercoverGameStateDTO {
  type: 'UNDERCOVER';
  phase: 'PLAYING' | 'REVEAL' | 'RESULT';
  round: number;
  myWord?: string;
  myRole?: PlayerRole;
  votedPlayerIds: string[];
  myVoteTarget?: string;
  revealedVotes?: Record<string, string>;
  eliminatedPlayerIds: string[];
  winner?: 'CIVILIAN' | 'UNDERCOVER';
  allRoles?: Record<string, PlayerRole>;
  allWords?: Record<string, string>;
}

export interface TaskWolfGameState {
  type: 'TASKWOLF';
  assignedRoles: Record<string, PlayerRole>;
  wolfTasks: Record<string, string>;   // wolfId → task description
  phase: 'PLAYING' | 'REVEAL' | 'RESULT';
  round: number;
  votes: Record<string, string>;
  votedPlayerIds: string[];
  revealedVotes: boolean;
  eliminatedPlayerIds: string[];
  winner?: 'VILLAGER' | 'WOLF';
}

export interface TaskWolfGameStateDTO {
  type: 'TASKWOLF';
  phase: 'PLAYING' | 'REVEAL' | 'RESULT';
  round: number;
  myRole?: PlayerRole;
  myTask?: string;              // wolf only
  votedPlayerIds: string[];
  myVoteTarget?: string;
  revealedVotes?: Record<string, string>;
  eliminatedPlayerIds: string[];
  winner?: 'VILLAGER' | 'WOLF';
  // Host (always god view):
  allRoles?: Record<string, PlayerRole>;
  allTasks?: Record<string, string>;
}

export interface ColourHuntGameState {
  type: 'COLOUR_HUNT';
  phase: 'PLAYING' | 'RESULT';
  assignedColours: Record<string, { name: string; hex: string; snackHint: string }>;
}

export interface ColourHuntGameStateDTO {
  type: 'COLOUR_HUNT';
  phase: 'PLAYING' | 'RESULT';
  myColour?: { name: string; hex: string; snackHint: string };
  allColours?: Record<string, { name: string; hex: string; snackHint: string }>;
}

export type GameState = UndercoverGameState | TaskWolfGameState | ColourHuntGameState | null;
export type GameStateDTO = UndercoverGameStateDTO | TaskWolfGameStateDTO | ColourHuntGameStateDTO;

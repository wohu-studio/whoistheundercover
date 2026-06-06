import { BaseGame } from './base-game';
import { Room } from '../../../shared/types/room';
import { RoomStatus } from '../../../shared/types/enums';
import { ColourHuntGameState, ColourHuntGameStateDTO } from '../../../shared/types/game-state';
import { RoomConfig } from '../../../shared/types/room';

interface ColourEntry {
  name: string;
  hex: string;
  snackHint: string;
}

const COLOURS: ColourEntry[] = [
  { name: '红色', hex: '#EF4444', snackHint: '草莓、西瓜、小番茄、红色果冻' },
  { name: '橙色', hex: '#F97316', snackHint: '橘子、胡萝卜条、芒果干、橙汁' },
  { name: '黄色', hex: '#EAB308', snackHint: '香蕉、菠萝、玉米、柠檬蛋糕' },
  { name: '绿色', hex: '#22C55E', snackHint: '黄瓜、青葡萄、抹茶零食、猕猴桃' },
  { name: '蓝色', hex: '#3B82F6', snackHint: '蓝莓、蓝色饮料、蓝莓酸奶' },
  { name: '紫色', hex: '#A855F7', snackHint: '葡萄、紫薯片、蓝莓、桑葚' },
  { name: '粉色', hex: '#EC4899', snackHint: '粉色麻薯、草莓牛奶、火龙果' },
  { name: '白色', hex: '#F5F5F5', snackHint: '棉花糖、酸奶、白巧克力、椰子片' },
  { name: '棕色', hex: '#92400E', snackHint: '巧克力、坚果、牛肉干、饼干' },
  { name: '黑色', hex: '#1F2937', snackHint: '奥利奥、黑巧克力、海苔、黑芝麻糊' },
];

export class ColourHuntGame extends BaseGame {
  onStart(config: RoomConfig): void {
    // All players participate (including host)
    const host = this.room.players.find(p => p.isHost);
    if (host) host.isPlaying = true;

    const playingPlayers = this.room.players.filter(p => p.isPlaying);

    // Shuffle colours using Fisher-Yates
    const shuffled = [...COLOURS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Assign colours to players (cycle if more players than colours)
    const assignedColours: Record<string, ColourEntry> = {};
    playingPlayers.forEach((player, index) => {
      const colour = shuffled[index % shuffled.length];
      assignedColours[player.id] = colour;
      player.isAlive = true;
      player.gameData = {
        gameType: 'COLOUR_HUNT',
        colour: colour.name,
        colourHex: colour.hex,
        snackHint: colour.snackHint,
      };
    });

    this.gameState = {
      type: 'COLOUR_HUNT',
      phase: 'PLAYING',
      assignedColours,
    };

    this.room.status = RoomStatus.PLAYING;
  }

  onAction(action: string, data: Record<string, unknown>): void {
    const state = this.gameState as ColourHuntGameState;
    if (!state) return;

    if (action === 'REVEAL_ALL') {
      state.phase = 'RESULT';
    } else if (action === 'END_GAME') {
      state.phase = 'RESULT';
    }
  }

  onEnd(): void {
    this.room.players.forEach(player => {
      player.role = undefined;
      player.gameData = undefined;
      player.isAlive = true;
      player.isPlaying = true;
    });
    this.room.status = RoomStatus.WAITING;
    this.gameState = null;
  }

  override sanitizeGameState(viewerId: string): ColourHuntGameStateDTO | null {
    const state = this.gameState as ColourHuntGameState;
    if (!state) return null;

    const viewer = this.room.players.find(p => p.id === viewerId);
    if (!viewer) return null;

    const dto: ColourHuntGameStateDTO = {
      type: 'COLOUR_HUNT',
      phase: state.phase,
    };

    // Player sees their own colour
    if (state.assignedColours[viewerId]) {
      dto.myColour = state.assignedColours[viewerId];
    }

    // In RESULT phase or if host (god view), show all
    if (state.phase === 'RESULT') {
      dto.allColours = { ...state.assignedColours };
    }

    // Non-playing host gets god view (shouldn't happen since host always plays, but just in case)
    if (viewer.isHost && !viewer.isPlaying) {
      dto.allColours = { ...state.assignedColours };
    }

    return dto;
  }
}

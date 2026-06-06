import { BaseGame } from "./base-game";
import { TaskWolfGameState, TaskWolfGameStateDTO } from "../../../shared/types/game-state";
import { Player, PlayerDTO, PlayerRole } from "../../../shared/types/player";
import { RoomStatus } from "../../../shared/types/enums";
import { RoomConfig } from "../../../shared/types/room";
import { loadTasks, TaskItem } from "../utils/task-loader";

export class TaskWolfGame extends BaseGame {
  private allTasks: TaskItem[] = [];

  onStart(config: RoomConfig): void {
    this.allTasks = loadTasks();

    // Host NEVER plays in TaskWolf
    const host = this.room.players.find(p => p.isHost);
    if (host) {
      host.isPlaying = false;
    }

    // Get playing players (non-host)
    const playingPlayers = this.room.players.filter(p => p.isPlaying);

    const numWolves = config.numWolves || 1;

    // Filter tasks by category if specified
    let availableTasks = this.allTasks;
    if (config.taskCategory) {
      const filtered = this.allTasks.filter(t => t.category === config.taskCategory);
      if (filtered.length > 0) availableTasks = filtered;
    }

    // Assign wolves: use designated IDs if provided, otherwise random
    let wolves: Player[];
    let villagers: Player[];

    if (config.designatedWolfIds && config.designatedWolfIds.length > 0) {
      const designatedSet = new Set(config.designatedWolfIds);
      wolves = playingPlayers.filter(p => designatedSet.has(p.id));
      villagers = playingPlayers.filter(p => !designatedSet.has(p.id));
    } else {
      // Fisher-Yates shuffle for unbiased randomization
      const shuffled = [...playingPlayers];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      wolves = shuffled.slice(0, numWolves);
      villagers = shuffled.slice(numWolves);
    }

    const assignedRoles: Record<string, PlayerRole> = {};
    const wolfTasks: Record<string, string> = {};

    // Assign tasks to wolves (random, no duplicates if possible)
    const shuffledTasks = [...availableTasks].sort(() => Math.random() - 0.5);
    wolves.forEach((player, i) => {
      assignedRoles[player.id] = PlayerRole.WOLF;
      player.role = PlayerRole.WOLF;

      // Use custom tasks if provided, otherwise pick from list
      const task = config.customTasks?.[i] ||
        shuffledTasks[i % shuffledTasks.length]?.description ||
        "完成你的秘密任务";
      wolfTasks[player.id] = task;

      player.gameData = {
        gameType: "TASKWOLF",
        task,
      };
    });

    villagers.forEach(player => {
      assignedRoles[player.id] = PlayerRole.VILLAGER;
      player.role = PlayerRole.VILLAGER;
      player.isAlive = true;
      player.gameData = undefined;
    });

    // Ensure all playing players are alive
    playingPlayers.forEach(p => { p.isAlive = true; });

    this.gameState = {
      type: "TASKWOLF",
      assignedRoles,
      wolfTasks,
      phase: "PLAYING",
      round: 1,
      votes: {},
      votedPlayerIds: [],
      revealedVotes: false,
      eliminatedPlayerIds: [],
    };

    this.room.status = RoomStatus.PLAYING;
  }

  onAction(action: string, data: any): void {
    if (!this.gameState || this.gameState.type !== "TASKWOLF") return;
    const state = this.gameState as TaskWolfGameState;

    switch (action) {
      case "SUBMIT_VOTE": {
        const { voterId, targetId } = data;
        const voter = this.room.players.find(p => p.id === voterId);
        const target = this.room.players.find(p => p.id === targetId);
        if (!voter || !target) return;
        if (!voter.isAlive || !voter.isPlaying) return;
        if (!target.isAlive || !target.isPlaying) return;
        if (state.eliminatedPlayerIds.includes(voterId)) return;
        if (state.eliminatedPlayerIds.includes(targetId)) return;
        if (voterId === targetId) return;

        state.votes[voterId] = targetId;
        state.votedPlayerIds = Object.keys(state.votes);
        break;
      }

      case "REVEAL_VOTES": {
        state.revealedVotes = true;
        state.phase = "REVEAL";
        break;
      }

      case "ELIMINATE_PLAYER": {
        const { targetId } = data;
        const target = this.room.players.find(p => p.id === targetId);
        if (!target || !target.isAlive) return;

        state.eliminatedPlayerIds.push(targetId);
        target.isAlive = false;

        const winner = this.checkWinCondition();
        if (winner) {
          state.winner = winner;
        }
        break;
      }

      case "NEXT_ROUND":
      case "SKIP_ELIMINATE": {
        state.round += 1;
        state.votes = {};
        state.votedPlayerIds = [];
        state.revealedVotes = false;
        state.phase = "PLAYING";
        break;
      }

      case "END_GAME": {
        if (data?.winner) {
          state.winner = data.winner;
        }
        state.phase = "RESULT";
        break;
      }
    }
  }

  onEnd(): void {
    this.gameState = null;
    this.room.status = RoomStatus.WAITING;
    this.room.players.forEach(player => {
      player.role = undefined;
      player.gameData = undefined;
      player.isAlive = true;
    });
  }

  private checkWinCondition(): 'VILLAGER' | 'WOLF' | null {
    if (!this.gameState || this.gameState.type !== "TASKWOLF") return null;
    const state = this.gameState as TaskWolfGameState;

    const alivePlayers = this.room.players.filter(
      p => p.isPlaying && p.isAlive && !state.eliminatedPlayerIds.includes(p.id)
    );

    const aliveWolves = alivePlayers.filter(
      p => state.assignedRoles[p.id] === PlayerRole.WOLF
    );
    const aliveVillagers = alivePlayers.filter(
      p => state.assignedRoles[p.id] === PlayerRole.VILLAGER
    );

    if (aliveWolves.length === 0) return 'VILLAGER';
    if (aliveWolves.length >= aliveVillagers.length) return 'WOLF';
    return null;
  }

  getVoteStatus(): { totalAlive: number; voted: number; notVoted: string[] } {
    if (!this.gameState || this.gameState.type !== "TASKWOLF") {
      return { totalAlive: 0, voted: 0, notVoted: [] };
    }
    const state = this.gameState as TaskWolfGameState;

    const alivePlaying = this.room.players.filter(
      p => p.isPlaying && p.isAlive && !state.eliminatedPlayerIds.includes(p.id)
    );
    const votedSet = new Set(state.votedPlayerIds);
    const notVoted = alivePlaying
      .filter(p => !votedSet.has(p.id))
      .map(p => p.id);

    return {
      totalAlive: alivePlaying.length,
      voted: votedSet.size,
      notVoted,
    };
  }

  override sanitizeGameState(viewerId: string): TaskWolfGameStateDTO | null {
    if (!this.gameState || this.gameState.type !== "TASKWOLF") return null;
    const state = this.gameState as TaskWolfGameState;

    const viewer = this.room.players.find(p => p.id === viewerId);
    if (!viewer) return null;

    const isHostViewing = viewer.isHost;
    const isRevealOrResult = state.phase === "REVEAL" || state.phase === "RESULT";

    const dto: TaskWolfGameStateDTO = {
      type: "TASKWOLF",
      phase: state.phase,
      round: state.round,
      votedPlayerIds: state.votedPlayerIds,
      eliminatedPlayerIds: state.eliminatedPlayerIds,
      winner: state.winner,
    };

    // Own role (playing players)
    if (viewer.isPlaying && state.assignedRoles[viewerId]) {
      dto.myRole = state.assignedRoles[viewerId];
    }

    // Own task (wolves only)
    if (viewer.isPlaying && state.wolfTasks[viewerId]) {
      dto.myTask = state.wolfTasks[viewerId];
    }

    // Own vote target
    if (state.votes[viewerId]) {
      dto.myVoteTarget = state.votes[viewerId];
    }

    // Revealed votes during REVEAL and RESULT
    if (isRevealOrResult) {
      dto.revealedVotes = { ...state.votes };
    }

    // Host always gets god view
    if (isHostViewing) {
      dto.allRoles = { ...state.assignedRoles };
      dto.allTasks = { ...state.wolfTasks };
      dto.revealedVotes = { ...state.votes };
    }

    // During RESULT, reveal all to everyone
    if (state.phase === "RESULT") {
      dto.allRoles = { ...state.assignedRoles };
      dto.allTasks = { ...state.wolfTasks };
      dto.myRole = state.assignedRoles[viewerId];
    }

    return dto;
  }

  sanitizePlayerData(player: Player, viewerId?: string): PlayerDTO {
    const dto = super.sanitizePlayerData(player, viewerId);

    const isHostViewing = this.room.players.find(p => p.id === viewerId)?.isHost || false;
    const state = this.gameState as TaskWolfGameState | null;
    const isResult = state?.phase === "RESULT";

    if (isHostViewing || isResult) {
      return {
        ...dto,
        role: player.role,
        gameData: player.gameData,
      };
    }

    if (viewerId === player.id) {
      // Show own role and task
      return dto;
    }

    // Other players: hide role and task
    return {
      ...dto,
      role: undefined,
      gameData: undefined,
    };
  }
}

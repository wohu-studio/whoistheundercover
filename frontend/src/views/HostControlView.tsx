import { useGameState } from '../hooks/useGameState';

export function HostControlView() {
  const { room, players } = useGameState();

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-3xl font-bold font-display text-on-surface mb-6">房主控制面板</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-2">所有玩家</h3>
              {players.map((player) => (
                <div key={player.id} className="bg-surface-container/60 rounded-lg p-4 mb-2">
                  <div className="text-on-surface font-bold">{player.nickname}</div>
                  <div className="text-on-surface-variant text-sm">
                    身份: {player.role || "未知"} |
                    词语: {player.gameData?.gameType === "UNDERCOVER" ? (player.gameData as any).word : "无"} |
                    任务: {player.gameData?.gameType === "TASKWOLF" ? (player.gameData as any).task : "无"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

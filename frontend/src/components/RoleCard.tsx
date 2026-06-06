import { LongPress } from './LongPress';
import { useVibration } from '../hooks/useVibration';
import { GameDataPayload } from '@shared/types/game-data';
import { PlayerRole } from '@shared/types/player';

interface RoleCardProps {
  role?: PlayerRole;
  gameData?: GameDataPayload;
  isHost?: boolean;
}

export function RoleCard({ role, gameData, isHost = false }: RoleCardProps) {
  const { vibrate } = useVibration();

  const handleReveal = () => {
    vibrate([100, 50, 100]);
  };

  const getRoleDisplay = () => {
    if (!role) return "未知";
    switch (role) {
      case PlayerRole.CIVILIAN:
        return "平民";
      case PlayerRole.UNDERCOVER:
        return "卧底";
      case PlayerRole.WOLF:
        return "狼人";
      case PlayerRole.VILLAGER:
        return "村民";
      default:
        return "未知";
    }
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-glow relative overflow-hidden">
      {/* Neon gradient header */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-primary-gradient opacity-60" />

      <div className="relative z-10 mt-20">
        {gameData?.gameType === 'UNDERCOVER' && (
          <LongPress onReveal={handleReveal} className="relative">
            <div className="text-center">
              <div className="text-2xl font-bold font-display mb-4">你的词语</div>
              <div className="text-4xl font-bold font-display">{gameData.word}</div>
              {isHost && (
                <div className="mt-4 text-sm text-on-surface-variant">身份: {getRoleDisplay()}</div>
              )}
            </div>
          </LongPress>
        )}

        {gameData?.gameType === 'TASKWOLF' && (
          <div className="text-center">
            <div className="text-2xl font-bold font-display mb-4">你的身份</div>
            <div className="text-3xl font-bold font-display mb-4">{getRoleDisplay()}</div>
            {gameData.task && (
              <LongPress onReveal={handleReveal} className="mt-4">
                <div className="text-lg">任务: {gameData.task}</div>
              </LongPress>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

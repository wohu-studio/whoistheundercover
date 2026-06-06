import { useState } from "react";
import { PlayerDTO } from "@shared/types/player";
import { Avatar } from "./Avatar";
import { generateRandomAvatar } from "../utils/avatar-generator";

interface PlayerCardProps {
  player: PlayerDTO;
  isCurrentPlayer?: boolean;
  onUpdate?: (updates: { nickname?: string; avatar?: string }) => void;
}

export function PlayerCard({
  player,
  isCurrentPlayer = false,
  onUpdate,
}: PlayerCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(player.nickname);

  const handleAvatarClick = () => {
    if (!isCurrentPlayer || !onUpdate) return;
    if (!isEditing) {
      setIsEditing(true);
      setEditName(player.nickname);
    }
  };

  const handleShuffleAvatar = () => {
    if (!onUpdate) return;
    const newAvatar = generateRandomAvatar();
    onUpdate({ avatar: JSON.stringify(newAvatar) });
  };

  const handleSaveName = () => {
    if (!onUpdate || !editName.trim()) return;
    if (editName.trim() !== player.nickname) {
      onUpdate({ nickname: editName.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(player.nickname);
    setIsEditing(false);
  };

  return (
    <div
      className={`
        glass rounded-lg p-4
        ${isCurrentPlayer ? "neon-border" : ""}
      `}
    >
      <div className="flex items-center gap-3">
        <div
          onClick={handleAvatarClick}
          className={`relative ${isCurrentPlayer ? "cursor-pointer" : ""}`}
        >
          <Avatar avatar={player.avatar} size="md" />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface-container-low ${
              player.isConnected ? "bg-tertiary shadow-neon-green" : "bg-outline"
            }`}
          />
        </div>
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSaveName()}
                  className="flex-1 bg-surface-container text-on-surface rounded px-2 py-1 text-sm border border-outline-variant focus:border-primary outline-none"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleShuffleAvatar}
                  className="px-2 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded text-xs"
                >
                  换头像
                </button>
                <button
                  onClick={handleSaveName}
                  className="px-2 py-1 bg-primary/80 hover:bg-primary text-on-primary rounded text-xs shadow-neon-pink"
                >
                  保存
                </button>
                <button
                  onClick={handleCancel}
                  className="px-2 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded text-xs"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="font-bold text-on-surface">
                {player.nickname}
                {isCurrentPlayer && (
                  <span className="text-xs text-outline ml-1">(点击头像编辑)</span>
                )}
              </div>
              {player.isHost && <div className="text-xs text-secondary">房主</div>}
              {!player.isHost && (
                <div className="text-xs text-on-surface-variant">
                  {player.isReady ? "已准备" : "未准备"}
                </div>
              )}
              {!player.isAlive && (
                <div className="text-xs text-on-surface-variant">已出局</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

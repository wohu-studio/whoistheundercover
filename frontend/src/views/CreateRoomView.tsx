import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { DesertButton } from "../components/DesertButton";
import { GameTypeEnum } from "@shared/types/enums";
import { getAvatarById } from "../utils/avatar-generator";

export function CreateRoomView() {
  const { gameType } = useParams<{ gameType: GameTypeEnum }>();
  const navigate = useNavigate();
  const { room, joinRoom, playerId, isConnected } = useSocket();
  const [nickname, setNickname] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const waitingForRoom = useRef(false);

  useEffect(() => {
    if (waitingForRoom.current && room && room.id) {
      waitingForRoom.current = false;
      setIsCreating(false);
      navigate(`/room/${room.id}/lobby`);
    }
  }, [room, navigate]);

  const handleCreateRoom = () => {
    if (!nickname.trim() || !gameType || !isConnected) return;

    waitingForRoom.current = true;
    setIsCreating(true);
    const avatar = playerId ? getAvatarById(playerId) : { name: 'cat', color: 'purple' };
    const avatarString = JSON.stringify(avatar);
    joinRoom("", nickname, true, gameType, avatarString);

    // Timeout fallback
    setTimeout(() => {
      if (waitingForRoom.current) {
        waitingForRoom.current = false;
        setIsCreating(false);
      }
    }, 5000);
  };

  if (!gameType) {
    return <div>无效的游戏类型</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold font-display text-on-surface mb-6 text-center">
          创建房间
        </h2>

        <div className="mb-6">
          <label className="block text-on-surface mb-2">你的昵称</label>
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="请输入你的昵称"
            className="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-outline focus:outline-none focus:border-primary"
            maxLength={20}
          />
        </div>

        <DesertButton
          variant="primary"
          className="w-full py-4"
          onClick={handleCreateRoom}
          disabled={!nickname.trim() || isCreating || !isConnected}
        >
          {!isConnected ? "连接中..." : isCreating ? "创建中..." : "创建房间"}
        </DesertButton>
      </div>
    </div>
  );
}

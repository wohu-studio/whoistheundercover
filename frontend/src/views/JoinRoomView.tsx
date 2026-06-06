import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DesertButton } from "../components/DesertButton";
import { useSocket } from "../hooks/useSocket";
import { Avatar } from "../components/Avatar";
import { generateRandomAvatar } from "../utils/avatar-generator";

export function JoinRoomView() {
  const { roomId: urlRoomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { joinRoom, room, socket, isConnected, playerId } = useSocket();
  const roomId = (urlRoomId || "").toUpperCase();
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState(generateRandomAvatar());
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (!room || !room.id || !socket) return;
    // 使用 playerId 而不是 socket.id 来查找当前玩家
    const currentPlayer = room.players.find(p => p.id === playerId);
    if (currentPlayer && room.id === roomId) {
      navigate(`/room/${roomId}/lobby`);
    }
  }, [room, roomId, navigate, socket, playerId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass rounded-lg p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold font-display text-on-surface mb-6 text-center">
          加入房间
        </h2>

        <div className="mb-4">
          <div className="text-on-surface-variant">房间号</div>
          <div className="text-3xl font-bold font-display bg-primary-gradient bg-clip-text text-transparent">{roomId}</div>
        </div>

        <div className="mb-6">
          <label className="block text-on-surface mb-2 text-left">你的昵称</label>
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="请输入你的昵称"
            className="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-outline focus:outline-none focus:border-primary"
            maxLength={20}
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-on-surface">头像</span>
            <button
              className="text-primary text-sm hover:text-primary-container"
              onClick={() => setAvatar(generateRandomAvatar())}
            >
              换一个
            </button>
          </div>
          <div className="flex items-center justify-center gap-3 bg-surface-container rounded-lg py-3">
            <Avatar avatar={avatar} size="lg" />
            <span className="text-on-surface text-lg">{nickname || "玩家"}</span>
          </div>
        </div>

        <DesertButton
          variant="primary"
          className="w-full py-4"
          onClick={() => {
            if (!roomId || !nickname.trim() || isJoining || !isConnected)
              return;
            setIsJoining(true);
            // Serialize avatar config to JSON string
            const avatarString = JSON.stringify(avatar);
            joinRoom(roomId, nickname, false, undefined, avatarString);
          }}
          disabled={
            !roomId.trim() || !nickname.trim() || isJoining || !isConnected
          }
        >
          {isJoining ? "加入中..." : isConnected ? "加入房间" : "连接中..."}
        </DesertButton>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGameState, useSocket } from "../hooks/useGameState";
import { RoomStatus } from "@shared/types/enums";
import { GameEvents } from "@shared/events";
import { LobbyView } from "./LobbyView";
import { GameplayView } from "./GameplayView";

export function RoomView() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { room, isConnected } = useGameState();
  const { rejoin, socket } = useSocket();

  // Handle auto-rejoin if state is lost
  useEffect(() => {
    if (!room && roomId && isConnected) {
      const success = rejoin(roomId);
      if (!success) {
        // No stored nickname — redirect to join page
        navigate(`/join/${roomId}`, { replace: true });
      }
    }
  }, [room, roomId, isConnected, rejoin, navigate]);

  // Handle player kicked event
  useEffect(() => {
    if (!socket) return;

    const handleKicked = (data: { roomId: string; message: string }) => {
      console.log("Kicked from room:", data.message);
      // Redirect to home page
      navigate("/", { replace: true });
      // Show alert to user
      alert(data.message);
    };

    socket.on(GameEvents.PLAYER_KICKED, handleKicked);

    return () => {
      socket.off(GameEvents.PLAYER_KICKED, handleKicked);
    };
  }, [socket, navigate]);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-on-surface">正在进入房间...</div>
      </div>
    );
  }

  // State Dispatcher
  switch (room.status) {
    case RoomStatus.WAITING:
      return <LobbyView />;
    case RoomStatus.PLAYING:
      return <GameplayView />;
    case RoomStatus.RESULT:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-on-surface text-4xl font-bold font-display">游戏结束</div>
        </div>
      );
    default:
      return <LobbyView />;
  }
}

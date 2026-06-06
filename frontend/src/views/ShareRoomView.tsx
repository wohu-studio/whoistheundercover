import { useParams, useNavigate } from "react-router-dom";
import { QRCode } from "../components/QRCode";
import { DesertButton } from "../components/DesertButton";

export function ShareRoomView() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const shareUrl = `${window.location.origin}/join/${roomId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    // Could add a toast notification here
  };

  const handleClose = () => {
    if (roomId) {
      navigate(`/room/${roomId}/lobby`);
    }
  };

  if (!roomId) {
    return <div>无效的房间号</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass rounded-lg p-8 w-full max-w-md text-center relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-on-surface hover:text-primary transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-3xl font-bold font-display text-on-surface mb-6">分享房间</h2>

        <div className="mb-6">
          <div className="text-4xl font-bold font-display bg-primary-gradient bg-clip-text text-transparent mb-4">{roomId}</div>
          <p className="text-on-surface-variant mb-4">分享此房间号或扫描二维码</p>
        </div>

        <div className="mb-6 flex justify-center">
          <QRCode value={shareUrl} size={200} />
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface text-sm"
          />
        </div>

        <div className="flex gap-4">
          <DesertButton
            variant="primary"
            className="flex-1 py-4"
            onClick={handleCopyLink}
          >
            复制链接
          </DesertButton>
          <DesertButton
            variant="tertiary"
            className="flex-1 py-4"
            onClick={handleClose}
          >
            关闭
          </DesertButton>
        </div>
      </div>
    </div>
  );
}

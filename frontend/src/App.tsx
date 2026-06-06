import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { GameSelectionView } from "./views/GameSelectionView";
import { CreateRoomView } from "./views/CreateRoomView";
import { JoinRoomView } from "./views/JoinRoomView";
import { RoomView } from "./views/RoomView";
import { ShareRoomView } from "./views/ShareRoomView";
import { AdminView } from "./views/AdminView";

function App() {
  return (
    <Layout>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GameSelectionView />} />
          <Route path="/create/:gameType" element={<CreateRoomView />} />
          <Route path="/join/:roomId" element={<JoinRoomView />} />

          {/* Main room entry point */}
          <Route path="/room/:roomId/*" element={<RoomView />} />

          <Route path="/admin" element={<AdminView />} />

          {/* Legacy & Shared routes */}
          <Route path="/share/:roomId" element={<ShareRoomView />} />

          {/* Redirects */}
          <Route
            path="/lobby/:roomId"
            element={<Navigate to="/room/:roomId/lobby" replace />}
          />
          <Route
            path="/room/:roomId"
            element={<Navigate to="/room/:roomId/lobby" replace />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Layout>
  );
}

export default App;

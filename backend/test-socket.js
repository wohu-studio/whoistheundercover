/**
 * Simple Socket.io client test script
 * Run with: node test-socket.js
 */

const io = require("socket.io-client");

const socket = io("http://localhost:3001", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);

  // Test 1: Host creates a room
  console.log("\n📝 Test 1: Host creating room...");
  socket.emit("join_room", {
    roomId: "",
    nickname: "TestHost",
    isHost: true,
    gameType: "UNDERCOVER",
  });
});

socket.on("update_room_state", room => {
  console.log("📦 Received room state update:");
  console.log("  Room ID:", room.id);
  console.log("  Status:", room.status);
  console.log("  Game Type:", room.gameType);
  console.log("  Players:", room.players.length);
  console.log(
    "  Player details:",
    room.players.map(p => ({
      id: p.id,
      nickname: p.nickname,
      isHost: p.isHost,
    }))
  );

  // If we're the host and have a room, test joining as a player
  if (room.players[0]?.isHost && room.players.length === 1) {
    console.log("\n📝 Test 2: Simulating player join...");
    // Note: In real scenario, this would be a different socket connection
    console.log("  (Player join test requires a separate socket connection)");
  }
});

socket.on("error", error => {
  console.error("❌ Error:", error);
});

socket.on("disconnect", () => {
  console.log("🔌 Disconnected from server");
});

// Keep the script running
setTimeout(() => {
  console.log("\n✅ Test completed. Closing connection...");
  socket.disconnect();
  process.exit(0);
}, 5000);

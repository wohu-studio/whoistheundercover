# Backend Testing Guide

## Quick Start

### 1. Install Dependencies (if not already done)

```bash
cd backend
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001` (or the port specified in `PORT` env variable).

## Testing Methods

### Method 1: Test HTTP Health Endpoint

```bash
# Using curl
curl http://localhost:3001/health

# Expected response:
# {"status":"ok","timestamp":"2024-01-01T12:00:00.000Z"}
```

### Method 2: Test Socket.io with Test Script

1. Make sure the backend server is running (`npm run dev`)
2. In a separate terminal, run the test script:

```bash
cd backend
node test-socket.js
```

This will:

- Connect to the Socket.io server
- Create a room as a host
- Display room state updates
- Test basic connection flow

### Method 3: Test with Browser Console

1. Start the backend server
2. Open browser DevTools console
3. Run this JavaScript:

```javascript
// Connect to Socket.io
const socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  // Create a room as host
  socket.emit("join_room", {
    roomId: "",
    nickname: "TestHost",
    isHost: true,
    gameType: "UNDERCOVER",
  });
});

socket.on("update_room_state", room => {
  console.log("Room state:", room);
});

socket.on("error", error => {
  console.error("Error:", error);
});
```

### Method 4: Test with Frontend

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Navigate to `http://localhost:3000`
4. Follow the UI flow to create/join rooms

## Testing Socket.io Events

### Available Events

**Client → Server:**

- `join_room` - Join or create a room

  ```javascript
  socket.emit("join_room", {
    roomId: "ABC123", // Empty string to create new room
    nickname: "Player1",
    isHost: false,
    gameType: "UNDERCOVER", // Optional, only for host
  });
  ```

- `start_game` - Start a game (host only)
  ```javascript
  socket.emit("start_game", {
    roomId: "ABC123",
    gameType: "UNDERCOVER",
    config: {},
  });
  ```

**Server → Client:**

- `update_room_state` - Room state updates
- `error` - Error messages

## Manual Testing Checklist

- [ ] Server starts without errors
- [ ] Health endpoint returns 200 OK
- [ ] Socket.io connection established
- [ ] Host can create a room
- [ ] Room ID is generated (6 characters)
- [ ] Player can join existing room
- [ ] Room state broadcasts to all players
- [ ] Host can start a game
- [ ] Player disconnect removes them from room
- [ ] Host disconnect deletes the room

## Troubleshooting

**Port already in use:**

```bash
# Change port
PORT=3002 npm run dev
```

**Socket.io connection fails:**

- Check CORS settings in `backend/src/socket/index.ts`
- Ensure server is running
- Check firewall/network settings

**TypeScript errors:**

```bash
# Build to check for type errors
npm run build
```

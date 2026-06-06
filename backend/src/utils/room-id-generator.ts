/**
 * Generates a unique 6-character room ID
 * Format: 6 alphanumeric characters (uppercase letters and numbers)
 */
export function generateRoomId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let roomId = "";
  for (let i = 0; i < 6; i++) {
    roomId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return roomId;
}

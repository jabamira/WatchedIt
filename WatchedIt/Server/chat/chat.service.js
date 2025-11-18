
const users = {};
const rooms = {};


function generateCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

function setUsername(socketId, username) {
  users[socketId] = {
    id: socketId,
    username,
    currentRoom: null
  };
  return Object.keys(rooms); 
}


function createRoom() {
  let code;
  do {
    code = generateCode();
  } while (rooms[code]);

  rooms[code] = {
    name: code,
    users: [],
    messages: []
  };
  return code;
}

function joinRoom(socketId, code) {
  const user = users[socketId];
  if (!user) return null;

  if (!rooms[code]) return null;

  if (user.currentRoom && rooms[user.currentRoom]) {
    rooms[user.currentRoom].users = rooms[user.currentRoom].users.filter(u => u.id !== socketId);
  }

  user.currentRoom = code;
  rooms[code].users.push({
    id: socketId,
    username: user.username
  });

  return rooms[code];
}

function addMessage(socketId, text) {
  const user = users[socketId];
  if (!user || !user.currentRoom) return null;

  const code = user.currentRoom;
  if (!rooms[code]) return null;

  const message = {
    id: Date.now(),
    username: user.username,
    text,
    timestamp: new Date().toISOString()
  };

  rooms[code].messages.push(message);
  return { code, message };
}

function disconnect(socketId) {
  const user = users[socketId];
  if (!user) return;

  if (user.currentRoom && rooms[user.currentRoom]) {
    rooms[user.currentRoom].users = rooms[user.currentRoom].users.filter(u => u.id !== socketId);
  }

  delete users[socketId];
}

module.exports = {
  users,
  rooms,
  setUsername,
  createRoom,
  joinRoom,
  addMessage,
  disconnect
};

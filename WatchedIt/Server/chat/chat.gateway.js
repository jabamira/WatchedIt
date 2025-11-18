const { randomBytes } = require("crypto");

const users = {};
const rooms = {}; 

module.exports = (http) => {
  const io = require("socket.io")(http, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Пользователь подключился:", socket.id);

    // Отправляем список всех существующих комнат сразу при подключении
    socket.emit("roomsList", Object.keys(rooms));

    // Установка имени пользователя
    socket.on("setUsername", (username) => {
      users[socket.id] = { id: socket.id, username, currentRoom: null };
      console.log(`Пользователь ${username} зарегистрирован`);

      // Обновляем список комнат для нового пользователя
      socket.emit("roomsList", Object.keys(rooms));
    });

   
    socket.on("createRoom", () => {
      const code = randomBytes(2).toString("hex").toUpperCase();
      rooms[code] = { name: code, users: [], messages: [] };
      console.log(`Создана новая комната: ${code}`);

     
      socket.emit("roomCreatedForUser", code);

    
      io.emit("roomCreated", code);
    });

   
    socket.on("joinRoomByCode", (code) => {
      if (!rooms[code]) {
        socket.emit("error", "Комната не найдена");
        return;
      }

      socket.join(code);

      if (!users[socket.id]) users[socket.id] = { id: socket.id, username: "Гость" };
      users[socket.id].currentRoom = code;

      if (!rooms[code].users.find(u => u.id === socket.id)) {
        rooms[code].users.push({ id: socket.id, username: users[socket.id].username });
      }

      socket.emit("roomJoined", code);
      socket.emit("roomMessages", rooms[code].messages);
      io.to(code).emit("roomUsers", rooms[code].users);
    });

    
    socket.on("chatMessage", (text) => {
      const user = users[socket.id];
      if (!user || !user.currentRoom) {
        socket.emit("error", "Вы не в комнате");
        return;
      }

      const message = {
        id: Date.now(),
        username: user.username,
        text,
        timestamp: new Date().toISOString()
      };

      rooms[user.currentRoom].messages.push(message);
      io.to(user.currentRoom).emit("chatMessage", message);
    });


    socket.on("disconnect", () => {
      const user = users[socket.id];
      if (user && user.currentRoom) {
        const room = rooms[user.currentRoom];
        if (room) {
          room.users = room.users.filter(u => u.id !== socket.id);
          io.to(user.currentRoom).emit("roomUsers", room.users);
        }
      }
      delete users[socket.id];
      console.log("Пользователь отключился:", socket.id);
    });
  });
};

const { Server } = require("socket.io");

module.exports = (app, httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: "http://localhost:5173", credentials: true }
  });

  app.set("io", io);

  io.on("connection", socket => {
    console.log("Пользователь подключился к опросам:", socket.id);

    socket.on("joinPoll", pollId => {
      socket.join(`poll_${pollId}`);
    });

    socket.on("leavePoll", pollId => {
      socket.leave(`poll_${pollId}`);
    });

    socket.on("disconnect", () => {
      console.log("Пользователь отключился:", socket.id);
    });
  });
};

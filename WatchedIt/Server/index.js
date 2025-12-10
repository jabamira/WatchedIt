const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const http = require("http");

const app = express();

// ---------------------------
// MIDDLEWARE
// ---------------------------
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// ---------------------------
// ROUTES
// ---------------------------

// Основные маршруты
app.use("/polls", require("./routes/polls"));
app.use("/auth", require("./routes/auth"));
app.use("/routes/user-votes", require("./routes/user-votes")); // доступ по /routes/user-votes
app.use(require("./routes/me"));

// ---------------------------
// HTTP & SOCKET SERVER
// ---------------------------
const server = http.createServer(app);
require("./polls/polls.gateway")(app, server);

// ---------------------------
// DATABASE
// ---------------------------
const sequelize = require("./db");
require("./models/associations");

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("База данных подключена");
  } catch (e) {
    console.error("Ошибка подключения к БД:", e);
  }
})();

// ---------------------------
// START SERVER
// ---------------------------
server.listen(3000, () => console.log("Сервер запущен на порту 3000"));

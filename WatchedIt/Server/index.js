const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const sequelize = require("./db");
const User = require("./models/User");

const authRoutes = require("./routes/auth");
const registerRoutes = require("./routes/register");
const meRoute = require("./routes/me");

const app = express();

// Разрешенные источники — без невидимых символов!
const allowedOrigins = [
  "http://localhost:5173",
  "https://turbo-space-funicular-pxwpjgwp6jrh6wwp-5173.app.github.dev",
];

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Не разрешенный источник"));
    }
  },
  credentials: true,
}));

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Роуты
app.use("/auth", authRoutes);
app.use("/register", registerRoutes);
app.use("/me", meRoute);

// Ловим CORS ошибки (опционально)
app.use((err, req, res, next) => {
  if (err.message === "Не разрешенный источник") {
    console.error("CORS Error: ", req.headers.origin);
    res.status(403).send("CORS Error");
  } else {
    next(err);
  }
});
app.options("/*", (req, res) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
    res.status(204).end();
  } else {
    res.status(403).end();
  }
});

// База данных
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ БД подключена");
    await sequelize.sync();
  } catch (err) {
    console.error("❌ Ошибка подключения к БД:", err);
  }
})();

// Запуск сервера
app.listen(30002, () => {
  console.log("🚀 Сервер запущен на порту 30002");
});
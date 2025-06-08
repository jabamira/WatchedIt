const express = require("express");
const app = express();

const authRoutes = require("./routes/auth");
const registerRoutes = require("./routes/register");
const meRoute = require("./routes/me");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/me", meRoute);
const sequelize = require("./db");
const User = require("./models/User");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Соединение с БД установлено");
    await sequelize.sync();
  } catch (err) {
    console.error("Ошибка подключения к БД:", err);
  }
})();

app.listen(3000, () => {
  console.log("Сервер запущен на порту 3000");
});

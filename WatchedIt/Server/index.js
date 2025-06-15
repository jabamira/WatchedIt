const express = require("express");
const app = express();

const authRoutes = require("./routes/auth");

const meRoute = require("./routes/me");
const Services = require("./routes/services");
const UserRoutes = require("./routes/user");

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
app.use("/uploads", express.static("uploads"));
app.use("/user", UserRoutes);
app.use("/services", Services);
app.use("/auth", authRoutes);
app.use("/me", meRoute);
const sequelize = require("./db");
const User = require("./models/User");
const Rating = require("./models/Rating");
const Favorite = require("./models/Favorite");
const ContentItem = require("./models/ContentItem");
require("./models/associations");
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

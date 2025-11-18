const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));
app.use("/user", require("./routes/user"));
app.use("/services", require("./routes/services"));
app.use("/auth", require("./routes/auth"));
app.use("/me", require("./routes/me"));

const http = require("http").createServer(app);

// Подключаем чат
require("./chat/chat.gateway")(http);

const sequelize = require("./db");
require("./models/associations");

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();
})();

http.listen(3000, () => console.log("Сервер запущен"));

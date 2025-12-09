const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const http = require("http");

const app = express();


app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());


app.use("/polls", require("./routes/polls"));
app.use("/auth", require("./routes/auth"));

app.use(require("./routes/me"));

app.use("/polls", require("./routes/polls"));

const server = http.createServer(app);


require("./polls/polls.gateway")(app, server);


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

server.listen(3000, () => console.log("Сервер запущен на порту 3000"));

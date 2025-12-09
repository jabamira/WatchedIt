const jwt = require("jsonwebtoken");
const { User } = require("../models/associations");

module.exports = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Нет токена" });

  try {
    const data = jwt.verify(token, "jwt_secret"); // поменяй секрет
    const user = await User.findByPk(data.id);
    if (!user) return res.status(401).json({ message: "Пользователь не найден" });

    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Неверный токен" });
  }
};

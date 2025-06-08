const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User"); // путь к вашей модели User
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

router.get("/", async (req, res) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ success: false, message: "Нет токена" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Пользователь не найден" });

    user.lastOnlineAt = new Date();
    await user.save();

    const { password, ...userData } = user.toJSON();

    res.json({ success: true, user: userData });
  } catch {
    res.status(401).json({ success: false, message: "Неверный токен" });
  }
});

module.exports = router;

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const router = express.Router();
const User = require("../models/User");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
console.log(JWT_SECRET);
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send({ success: false, message: "Email и пароль обязательны" });
  }

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: email }, { login: email }],
      },
    });

    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "Пользователь не найден" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(401)
        .send({ success: false, message: "Неверный пароль" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });
    console.log("Новый токен:", token);

    // Установка cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Ответ клиенту
    res.send({ success: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Ошибка сервера" });
  }
});

module.exports = router;

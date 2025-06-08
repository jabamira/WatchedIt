const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(`[LOGIN] Попытка входа: ${email}`);

  if (!email || !password) {
    console.log("[LOGIN] Отказ: Email или пароль не указаны");
    return res
      .status(400)
      .send({ success: false, message: "Email и пароль обязательны" });
  }

  try {
    const user = await User.findOne({
      where: { [Op.or]: [{ email: email }, { login: email }] },
    });
    if (!user) {
      console.log(`[LOGIN] Не найден пользователь: ${email}`);
      return res
        .status(401)
        .send({ success: false, message: "Пользователь не найден" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log(`[LOGIN] Неверный пароль для пользователя: ${email}`);
      return res
        .status(401)
        .send({ success: false, message: "Неверный пароль" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    console.log(`[LOGIN] Успешный вход: ${email}`);
    res.send({ success: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("[LOGIN] Ошибка сервера:", error);
    res.status(500).send({ success: false, message: "Ошибка сервера" });
  }
});

router.post("/register", async (req, res) => {
  const { email, login, password } = req.body;
  console.log(`[REGISTER] Попытка регистрации: ${email}, ${login}`);

  if (!email || !password || !login) {
    console.log("[REGISTER] Отказ: Недостаточно данных");
    return res
      .status(400)
      .send({ success: false, message: "Email, login и пароль обязательны" });
  }

  try {
    const existingUserEmail = await User.findOne({ where: { email } });
    if (existingUserEmail) {
      console.log(`[REGISTER] Email уже используется: ${email}`);
      return res.status(409).send({
        success: false,
        message: "Пользователь с таким email уже существует",
      });
    }

    const existingUserLogin = await User.findOne({ where: { login } });
    if (existingUserLogin) {
      console.log(`[REGISTER] Login уже используется: ${login}`);
      return res.status(409).send({
        success: false,
        message: "Пользователь с таким login уже существует",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      login,
      password: hashedPassword,
    });

    console.log(
      `[REGISTER] Успешная регистрация: ${email} (ID: ${newUser.id})`
    );
    res.send({ success: true, userId: newUser.id });
  } catch (error) {
    console.error("[REGISTER] Ошибка сервера:", error);
    res.status(500).send({ success: false, message: "Ошибка сервера" });
  }
});

router.post("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  console.log("[LOGOUT] Пользователь вышел из системы");
  res.sendStatus(200);
});

module.exports = router;

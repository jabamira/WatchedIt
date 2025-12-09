const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/associations");

const router = express.Router();

// ==== REGISTER ====
router.post("/register", async (req, res) => {
  const { login, password } = req.body;
  console.log("[REGISTER] login:", login, "password:", password);

  if (!login || !password)
    return res.status(400).json({ success: false, message: "Введите логин и пароль" });

  const exists = await User.findOne({ where: { login } });
  console.log("[REGISTER] user exists?", !!exists);
  if (exists)
    return res.status(400).json({ success: false, message: "Такой логин уже существует" });

  const hash = await bcrypt.hash(password, 10);
  console.log("[REGISTER] hashed password:", hash);

  const user = await User.create({ login, password: hash });
  console.log("[REGISTER] user created:", user.id);

  const token = jwt.sign({ id: user.id }, "jwt_secret", { expiresIn: "7d" });
  res.cookie("token", token, { httpOnly: true });
  return res.json({ success: true });
});

// ==== LOGIN ====
router.post("/login", async (req, res) => {
  const { login, password } = req.body;
  console.log("[LOGIN] login:", login, "password:", password);

  if (!login || !password)
    return res.status(400).json({ success: false, message: "Введите логин и пароль" });

  const user = await User.findOne({ where: { login } });
  console.log("[LOGIN] user found:", !!user);

  if (!user)
    return res.status(400).json({ success: false, message: "Пользователь не найден" });

  const valid = await bcrypt.compare(password, user.password);
  console.log("[LOGIN] password valid?", valid);
  if (!valid)
    return res.status(400).json({ success: false, message: "Неверный пароль" });

  const token = jwt.sign({ id: user.id }, "jwt_secret", { expiresIn: "7d" });
  res.cookie("token", token, { httpOnly: true });
  return res.json({ success: true });
});

// ==== LOGOUT ====
router.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

module.exports = router;

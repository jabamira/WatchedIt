const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, login, password } = req.body;

  if (!email || !password || !login) {
    return res
      .status(400)
      .send({ success: false, message: "Email, login и пароль обязательны" });
  }

  try {
    const existingUserEmail = await User.findOne({ where: { email } });

    if (existingUserEmail) {
      return res.status(409).send({
        success: false,
        message: "Пользователь с таким email уже существует",
      });
    }

    const existingUserLogin = await User.findOne({ where: { login } });

    if (existingUserLogin) {
      return res.status(409).send({
        success: false,
        message: "Пользователь с таким login уже существует",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      login,
    });

    res.send({ success: true, userId: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Ошибка сервера" });
  }
});

module.exports = router;

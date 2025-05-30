const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

router.get("/", (req, res) => {
  const token = req.cookies.token; // для этого нужен cookie-parser middleware

  if (!token) {
    return res.status(401).send({ success: false, message: "Нет токена" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    res.send({ success: true, id: decoded.id });
    console.log("Токен пользователя:", token);
  } catch (err) {
    res.status(401).send({ success: false, message: "Неверный токен" });
  }
});

module.exports = router;

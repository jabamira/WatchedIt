const express = require("express");
const auth = require("../middleware/auth"); // ваш middleware авторизации
const { PollVote } = require("../models/associations");

const router = express.Router();

// Получить все голоса текущего пользователя
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Получаем все голоса пользователя
    const votes = await PollVote.findAll({
      where: { userId }
    });

    // Формируем объект вида { [pollId]: [optionId, ...] }
    const userVotes = {};
    votes.forEach(v => {
      if (!userVotes[v.pollId]) userVotes[v.pollId] = [];
      userVotes[v.pollId].push(v.optionId);
    });

    res.json(userVotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;

router.get("/user-votes", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Получаем все голоса пользователя
    const votes = await PollVote.findAll({
      where: { userId },
      include: { model: PollOption, as: "PollOption" } // для связи с опциями
    });

    // Формируем объект вида { [pollId]: [optionId, ...] }
    const userVotes = {};
    votes.forEach(v => {
      if (!userVotes[v.pollId]) userVotes[v.pollId] = [];
      userVotes[v.pollId].push(v.optionId);
    });

    res.json(userVotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

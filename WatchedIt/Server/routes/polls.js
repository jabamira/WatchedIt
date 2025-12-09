const express = require("express");
const router = express.Router();
const { Poll, PollOption, PollVote } = require("../models/associations");
const auth = require("../middleware/auth");

// ==== Получение всех опросов ====
router.get("/", async (req, res) => {
  try {
    console.log("[GET /polls] Получение опросов");

    // Получаем опросы с вариантами и голосами
    const polls = await Poll.findAll({
      include: {
        model: PollOption,
        as: "PollOptions",
        include: { model: PollVote, as: "PollVotes" }
      },
      order: [["createdAt", "DESC"]]
    });

    // Если авторизован, получаем userId
    const userId = req.user?.id || null;

    const response = polls.map(poll => {
      const userVotes = poll.PollOptions
        .filter(o => o.PollVotes.some(v => v.userId === userId))
        .map(o => o.id);

      const options = poll.PollOptions.map(o => ({
        id: o.id,
        text: o.text,
        votes: o.PollVotes.length
      }));

      return {
        id: poll.id,
        question: poll.question,
        isAnonymous: poll.isAnonymous,
        multipleChoice: poll.multipleChoice,
        userVotes,
        options
      };
    });

    res.json(response);
  } catch (err) {
    console.error("[GET /polls] Ошибка:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// ==== Голосование ====
router.post("/:pollId/vote", auth, async (req, res) => {
  try {
    const { optionIds } = req.body;
    const pollId = req.params.pollId;
    const userId = req.user.id;

    console.log(`[POST /polls/${pollId}/vote] Пользователь ${userId} голосует за:`, optionIds);

    const poll = await Poll.findByPk(pollId, {
      include: {
        model: PollOption,
        as: "PollOptions",
        include: { model: PollVote, as: "PollVotes" }
      }
    });

    if (!poll) {
      console.log("Опрос не найден:", pollId);
      return res.status(404).json({ message: "Опрос не найден" });
    }

    const ids = Array.isArray(optionIds) ? optionIds : [optionIds];

    // Для одиночного выбора удаляем предыдущие голоса
    if (!poll.multipleChoice) {
      console.log("Удаляем предыдущие голоса пользователя:", userId);
      await PollVote.destroy({ where: { pollId: poll.id, userId } });
    }

    // Создаём новые голоса, findOrCreate чтобы не дублировать
    await Promise.all(
      ids.map(optionId =>
        PollVote.findOrCreate({
          where: { pollId: poll.id, optionId, userId },
          defaults: { pollId: poll.id, optionId, userId }
        })
      )
    );

    console.log("Голоса успешно сохранены");

    // Получаем актуальное количество голосов
    const options = await PollOption.findAll({
      where: { pollId: poll.id },
      include: { model: PollVote, as: "PollVotes" }
    });

    const results = options.map(o => ({
      id: o.id,
      text: o.text,
      votes: o.PollVotes.length
    }));

    const userVotes = options
      .filter(o => o.PollVotes.some(v => v.userId === userId))
      .map(o => o.id);

    console.log("Результаты после голосования:", results);
    console.log("Пользователь голосовал за варианты:", userVotes);

    // Отправляем всем пользователям обновление через сокет
    const io = req.app.get("io");
    if (io) {
      io.to(`poll_${poll.id}`).emit("poll:vote", { pollId: poll.id, results, userVotes });
      console.log("Обновление отправлено через сокет");
    }

    res.json({ pollId: poll.id, results, userVotes });
  } catch (err) {
    console.error("Ошибка при голосовании:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;

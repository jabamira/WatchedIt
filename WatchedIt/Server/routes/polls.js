const express = require("express");
const router = express.Router();
const { Poll, PollOption, PollVote } = require("../models/associations");
const auth = require("../middleware/auth");

// Создание опроса
router.post("/", auth, async (req, res) => {
  try {
    const { question, options, isAnonymous, multipleChoice } = req.body;
    const userId = req.user.id;

    if (!question || !options?.length) {
      return res.status(400).json({ message: "Вопрос и варианты обязательны" });
    }

    const poll = await Poll.create({
      question,
      isAnonymous: !!isAnonymous,
      multipleChoice: !!multipleChoice,
      userId
    });

    const pollOptions = await Promise.all(
      options.map(text => PollOption.create({ text, pollId: poll.id }))
    );

    const response = {
      id: poll.id,
      question: poll.question,
      isAnonymous: poll.isAnonymous,
      multipleChoice: poll.multipleChoice,
      userVotes: [], // пустой для всех
      options: pollOptions.map(o => ({ id: o.id, text: o.text, votes: 0 }))
    };

    const io = req.app.get("io");
    if (io) io.emit("poll:created", response);

    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получение всех опросов
router.get("/", async (req, res) => {
  try {
    const userId = req.user?.id || null; // если авторизован, узнаем id, иначе null

    const polls = await Poll.findAll({
      include: {
        model: PollOption,
        as: "PollOptions",
        include: { model: PollVote, as: "PollVotes" }
      },
      order: [["createdAt", "DESC"]]
    });

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
        userVotes, // будет пустой у неавторизованного
        options
      };
    });

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Голосование
router.post("/:pollId/vote", auth, async (req, res) => {
  try {
    const { optionIds } = req.body;
    const pollId = req.params.pollId;
    const userId = req.user.id;

    const poll = await Poll.findByPk(pollId, {
      include: {
        model: PollOption,
        as: "PollOptions",
        include: { model: PollVote, as: "PollVotes" }
      }
    });
    if (!poll) return res.status(404).json({ message: "Опрос не найден" });

    const ids = Array.isArray(optionIds) ? optionIds : [optionIds];

    if (!poll.multipleChoice) {
      await PollVote.destroy({ where: { pollId, userId } });
    }

    await Promise.all(
      ids.map(optionId =>
        PollVote.findOrCreate({
          where: { pollId, optionId, userId },
          defaults: { pollId, optionId, userId }
        })
      )
    );

    const options = await PollOption.findAll({
      where: { pollId },
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

    // Отправляем обновление всем, но userVotes для фронта отдельного пользователя
    const io = req.app.get("io");
    if (io) {
      io.emit("poll:vote", { pollId: poll.id, results });
    }

    res.json({ pollId: poll.id, results, userVotes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;

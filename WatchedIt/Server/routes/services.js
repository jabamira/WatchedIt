const ContentItem = require("../models/ContentItem");

const express = require("express");
const router = express.Router();
const {
  cacheMovieByTitle,
  cacheMoviesBySearch,
} = require("../services/omdbCache");

router.post("/cache-movie", async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res
      .status(400)
      .send({ success: false, message: "Название фильма обязательно" });
  }

  const movie = await cacheMovieByTitle(title);
  if (!movie) {
    return res
      .status(404)
      .send({ success: false, message: "Фильм не найден или ошибка" });
  }

  res.send({ success: true, data: movie });
});
router.post("/cache-movies", async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res
      .status(400)
      .send({ success: false, message: "Название фильма обязательно" });
  }

  try {
    const movies = await cacheMoviesBySearch(title);
    if (!movies || movies.length === 0) {
      return res
        .status(404)
        .send({ success: false, message: "Фильмы не найдены" });
    }

    res.send({ success: true, data: movies });
  } catch (error) {
    console.error("Ошибка при поиске:", error);
    res.status(500).send({ success: false, message: "Ошибка сервера" });
  }
});

router.get("/all-movies", async (req, res) => {
  try {
    const movies = await ContentItem.findAll();
    res.json({ data: movies });
  } catch (error) {
    console.error("Ошибка получения фильмов:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});
router.get("/movies-page", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // текущая страница
  const limit = 30; // количество фильмов на страницу
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await ContentItem.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      data: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Ошибка получения фильмов с пагинацией:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;

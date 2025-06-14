const ContentItem = require("../models/ContentItem");
const { Op } = require("sequelize");
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
const sequelize = require("../db"); // чтобы использовать sequelize.fn и sequelize.col
router.get("/movies-page-mydb", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const offset = (page - 1) * limit;

  const { title, category, countries } = req.query;

  const where = {};

  if (title) {
    where.title = sequelize.where(
      sequelize.fn("LOWER", sequelize.col("title")),
      {
        [Op.like]: `%${title.toLowerCase()}%`,
      }
    );
  }

  if (category) {
    where.genre = sequelize.where(
      sequelize.fn("LOWER", sequelize.col("genre")),
      {
        [Op.like]: `%${category.toLowerCase()}%`,
      }
    );
  }

  if (countries) {
    const countriesArray = countries
      .split(",")
      .map((c) => c.trim().toLowerCase());

    where[Op.or] = countriesArray.map((country) =>
      sequelize.where(sequelize.fn("LOWER", sequelize.col("country")), {
        [Op.like]: `%${country}%`,
      })
    );
  }

  // Если фильтров нет — сортируем по imdbRating DESC, иначе по createdAt DESC
  const hasFilters = title || category || countries;
  const order = hasFilters ? [["createdAt", "DESC"]] : [["imdbRating", "DESC"]];

  try {
    const { count, rows } = await ContentItem.findAndCountAll({
      where,
      limit,
      offset,
      order,
    });

    res.json({
      data: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Ошибка получения фильмов с фильтрами:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const authMiddleware = require("../routes/authMiddleware"); // важно: не "../routes/user"
const {
  User,
  ContentItem,
  Favorite,
  Rating,
  Comment,
} = require("../models/associations");

router.post("/addFavorite", authMiddleware, async (req, res) => {
  const user = req.user;
  const { movieId } = req.body;

  if (!movieId) return res.status(400).json({ message: "movieId is required" });

  try {
    const movie = await ContentItem.findByPk(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // Проверка, чтобы не добавить повторно
    const favorites = await user.getFavorites({ where: { id: movieId } });
    if (favorites.length > 0) {
      return res.status(400).json({ message: "Movie already in favorites" });
    }

    await user.addFavorite(movie);

    res.json({ success: true, message: "Added to favorites" });
  } catch (err) {
    console.error("Ошибка добавления в избранное:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/removeFavorite", authMiddleware, async (req, res) => {
  const user = req.user;
  const { movieId } = req.body;

  if (!movieId) return res.status(400).json({ message: "movieId is required" });

  try {
    const movie = await ContentItem.findByPk(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    await user.removeFavorite(movie);

    res.json({ success: true, message: "Removed from favorites" });
  } catch (err) {
    console.error("Ошибка удаления из избранного:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        model: ContentItem,
        as: "Favorites",
        through: { attributes: [] },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.Favorites);
  } catch (err) {
    console.error("Ошибка получения избранного:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/rate", authMiddleware, async (req, res) => {
  const { movieId, value } = req.body;
  console.log("Received rating data:", req.body);

  if (!movieId || typeof value !== "number" || value < 1 || value > 10) {
    console.log("Invalid input detected:", { movieId, value });
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    await Rating.upsert({
      userId: req.user.id,
      contentItemId: movieId,
      value,
    });

    const rating = await Rating.findOne({
      where: { userId: req.user.id, contentItemId: movieId },
    });

    res.json({ message: "Rating saved", rating });
  } catch (err) {
    console.error("Ошибка сохранения рейтинга:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/rating/:movieId", authMiddleware, async (req, res) => {
  const { movieId } = req.params;

  try {
    const rating = await Rating.findOne({
      where: {
        userId: req.user.id,
        contentItemId: movieId,
      },
    });

    res.json({ value: rating ? rating.value : 0 });
  } catch (err) {
    console.error("Ошибка получения рейтинга:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

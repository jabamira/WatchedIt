const express = require("express");
const router = express.Router();
const authMiddleware = require("../routes/authMiddleware"); // важно: не "../routes/user"
const ContentItem = require("../models/ContentItem");

router.post("/add", authMiddleware, async (req, res) => {
  const user = req.user;
  const { movieId } = req.body;

  if (!movieId) {
    return res.status(400).json({ message: "movieId is required" });
  }

  try {
    const movie = await ContentItem.findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // предполагается: User.hasMany(ContentItem, { through: "Favorites" });
    await user.addFavorite(movie); // Sequelize создаёт запись в Favorites

    res.json({ success: true, message: "Added to favorites" });
  } catch (err) {
    console.error("Ошибка добавления в избранное:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const authMiddleware = require("../routes/authMiddleware"); // важно: не "../routes/user"
const {
  User,
  ContentItem,
  Favorite,
  Rating,
  Comment,
  CommentReaction,
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

router.get("/comments/:contentItemId", async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { contentItemId: req.params.contentItemId },
      include: [
        { model: User, attributes: ["id", "login"] },
        {
          model: CommentReaction,
          attributes: ["reactionType"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    // Счёт лайков/дизлайков
    const formatted = comments.map((comment) => {
      const reactions = comment.CommentReactions || [];
      const likes = reactions.filter((r) => r.reactionType === "like").length;
      const dislikes = reactions.filter(
        (r) => r.reactionType === "dislike"
      ).length;

      return {
        ...comment.toJSON(),
        likes,
        dislikes,
      };
    });

    res.json(formatted);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/comments", authMiddleware, async (req, res) => {
  try {
    const { contentItemId, text } = req.body;
    const userId = req.user.id; // берём из middleware

    if (!contentItemId || !text) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newComment = await Comment.create({ userId, contentItemId, text });

    const commentWithUser = await Comment.findOne({
      where: { id: newComment.id },
      include: [{ model: User, attributes: ["id", "login"] }],
    });
    res.status(201).json(commentWithUser);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.delete("/comments/:id", authMiddleware, async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Только автор может удалить
    if (comment.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await comment.destroy();
    res.status(200).json({ message: "Comment deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.put("/comments/:id", authMiddleware, async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    comment.text = text;
    await comment.save();

    res.status(200).json(comment);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.post("/comments/:id/react", authMiddleware, async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const { reactionType } = req.body; // "like" or "dislike"

    if (!["like", "dislike"].includes(reactionType)) {
      return res.status(400).json({ error: "Invalid reaction type" });
    }

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Поиск текущей реакции
    const existing = await CommentReaction.findOne({
      where: { userId, commentId },
    });

    if (existing) {
      if (existing.reactionType === reactionType) {
        // Нажатие на ту же реакцию — снять
        await existing.destroy();
        return res.status(200).json({ message: "Reaction removed" });
      } else {
        // Обновить на другую реакцию
        existing.reactionType = reactionType;
        await existing.save();
        return res.status(200).json({ message: "Reaction updated" });
      }
    }

    // Создать новую реакцию
    await CommentReaction.create({
      userId,
      commentId,
      reactionType,
    });

    res.status(201).json({ message: "Reaction added" });
  } catch (e) {
    console.error("Error in comment reaction", e);
    res.status(500).json({ error: e.message });
  }
});
module.exports = router;

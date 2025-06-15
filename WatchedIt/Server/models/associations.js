const User = require("./User");
const ContentItem = require("./ContentItem");
const Favorite = require("./Favorite");
const Rating = require("./Rating");
const Comment = require("./Comment");
const CommentReaction = require("./CommentReaction");
// --- Favorites ---
User.belongsToMany(ContentItem, {
  through: Favorite,
  foreignKey: "userId",
  otherKey: "contentItemId",
  as: "Favorites",
});

ContentItem.belongsToMany(User, {
  through: Favorite,
  foreignKey: "contentItemId",
  otherKey: "userId",
  as: "UsersWhoFavorited",
});

// --- Ratings ---
User.hasMany(Rating, { foreignKey: "userId" });
ContentItem.hasMany(Rating, { foreignKey: "contentItemId" });
Rating.belongsTo(User, { foreignKey: "userId" });
Rating.belongsTo(ContentItem, { foreignKey: "contentItemId" });

// --- Comments ---
User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });

ContentItem.hasMany(Comment, { foreignKey: "contentItemId" });
Comment.belongsTo(ContentItem, { foreignKey: "contentItemId" });

User.hasMany(CommentReaction, { foreignKey: "userId", onDelete: "CASCADE" });
CommentReaction.belongsTo(User, { foreignKey: "userId" });

Comment.hasMany(CommentReaction, {
  foreignKey: "commentId",
  onDelete: "CASCADE",
});
CommentReaction.belongsTo(Comment, { foreignKey: "commentId" });
module.exports = {
  User,
  ContentItem,
  Favorite,
  Rating,
  Comment,
  CommentReaction,
};

const User = require("./User");
const ContentItem = require("./ContentItem");
const Favorite = require("./Favorite");
const Rating = require("./Rating");

// --- Favorites ---
User.belongsToMany(ContentItem, {
  through: Favorite,
  foreignKey: "userId",
  otherKey: "contentItemId",
});
ContentItem.belongsToMany(User, {
  through: Favorite,
  foreignKey: "contentItemId",
  otherKey: "userId",
});

// --- Ratings ---
User.hasMany(Rating, { foreignKey: "userId" });
ContentItem.hasMany(Rating, { foreignKey: "contentItemId" });
Rating.belongsTo(User, { foreignKey: "userId" });
Rating.belongsTo(ContentItem, { foreignKey: "contentItemId" });

module.exports = {
  User,
  ContentItem,
  Favorite,
  Rating,
};

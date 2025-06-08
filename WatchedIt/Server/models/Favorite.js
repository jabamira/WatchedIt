const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Favorite = sequelize.define("Favorite", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  contentItemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

User.belongsToMany(ContentItem, { through: Favorite });
ContentItem.belongsToMany(User, { through: Favorite });

module.exports = Favorite;

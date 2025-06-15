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

module.exports = Favorite;

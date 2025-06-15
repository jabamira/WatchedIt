const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Rating = sequelize.define("Rating", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  contentItemId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  value: {
    type: DataTypes.INTEGER, // от 1 до 10
    allowNull: false,
  },
});

module.exports = Rating;

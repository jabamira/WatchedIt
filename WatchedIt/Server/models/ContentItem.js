const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ContentItem = sequelize.define("ContentItem", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true, // используем imdbID как id
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
  },
  genre: {
    type: DataTypes.STRING,
  },
  posterUrl: {
    type: DataTypes.STRING,
  },
  plot: {
    type: DataTypes.TEXT,
  },
  imdbRating: {
    type: DataTypes.FLOAT,
  },
  lastModifiedByAdminId: {
    type: DataTypes.INTEGER,
    allowNull: true, // связь с User (админом), можно добавить внешний ключ
  },
});

module.exports = ContentItem;

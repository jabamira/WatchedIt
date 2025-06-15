const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");
const ContentItem = require("./ContentItem");

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    contentItemId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: ContentItem,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Comment;

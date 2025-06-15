const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");
const Comment = require("./Comment");

const CommentReaction = sequelize.define(
  "CommentReaction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Comment,
        key: "id",
      },
    },
    reactionType: {
      type: DataTypes.ENUM("like", "dislike"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "commentId"],
      },
    ],
  }
);

module.exports = CommentReaction;

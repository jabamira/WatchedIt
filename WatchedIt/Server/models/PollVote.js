const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const PollVote = sequelize.define("PollVote", {
  // если опрос анонимный, userId = null
});

module.exports = PollVote;

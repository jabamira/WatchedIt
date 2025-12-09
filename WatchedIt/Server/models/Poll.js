const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Poll = sequelize.define("Poll", {
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  multipleChoice: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
    userId: {
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
});

module.exports = Poll;

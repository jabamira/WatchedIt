const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const PollOption = sequelize.define("PollOption", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = PollOption;

const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM("male", "female", "other", "vkishnik"),
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM("user", "admin", "moderator", "manager"),
    defaultValue: "user",
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  verificationToken: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  lastOnlineAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = User;

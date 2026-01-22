const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("shop_db", "root", "123456", {
  host: "127.0.0.1",
  dialect: "mysql",
});

const User = sequelize.define(
  "User",
  {
    username: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING },
  },
  {
    tableName: "users",
    underscored: true,
  },
);
module.exports = { sequelize, User };

const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
module.exports = async (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "user",
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      token: DataTypes.STRING(255),
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now(),
      },
    },
    {
      updatedAt: false,
    }
  );

  User.associate = function (models) {
    //console.log(models)

    User.hasMany(models.orders, { foreignKey: "userId" });
    User.hasMany(models.address, { foreignKey: "userId" });
    User.hasMany(models.productRatings, { foreignKey: "userId" });
  };
  User.prototype.isValidPassword = function (password) {
   return bcrypt.compareSync(password, this.password);
  };

  User.prototype.generatePasswordReset = function () {
    this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  };
  User.generateJWT = function () {
    return jwt.sign({ userId: this.id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
  };
  User.beforeSave(async (instance, options) => {
    if (instance.changed("password")) {
      const hashedPassword = await bcrypt.hash(instance.password, 10);
      instance.password = hashedPassword;
    }
    return instance;
  });
  return User;
};

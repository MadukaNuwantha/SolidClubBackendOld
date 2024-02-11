'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.UserStatus, {
        foreignKey: 'userStatusId',
        targetKey: 'id'
      });
      User.belongsTo(models.City, {
        foreignKey: 'cityId',
        targetKey: 'id'
      });
      User.belongsTo(models.Role, {
        foreignKey: 'roleId',
        targetKey: 'id'
      });
      User.hasMany(models.Job, {
        foreignKey: 'userId',
        sourceKey: 'id'
      });
    }
  }
  User.init({
    title: DataTypes.ENUM("Mr.","Mrs.", "Miss.", "Ms."),
    cityId: DataTypes.INTEGER(11),
    userStatusId: DataTypes.INTEGER(11),
    fname: DataTypes.STRING(100),
    lname: DataTypes.STRING(100),
    email: DataTypes.STRING(100),
    password: DataTypes.STRING(64),
    dob: DataTypes.DATEONLY,
    picture: DataTypes.STRING(255),
    address: DataTypes.STRING(255),
    gpLocation: DataTypes.STRING(10),
    countryDialCodeMobile: DataTypes.INTEGER(5),
    mobile: DataTypes.STRING(15),
    countryDialCodeTell: DataTypes.INTEGER(5),
    tell: DataTypes.STRING(15),
    roleId: DataTypes.INTEGER(11),
    otpExpires: DataTypes.DATE,
    allowSearchInJobCreate: DataTypes.INTEGER(1),
    source: DataTypes.ENUM("Mobile","Website"),
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
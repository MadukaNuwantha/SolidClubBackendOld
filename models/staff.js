'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Staff.hasOne(models.Role, {
        foreignKey: 'roleId'
      });
    }
  }
  Staff.init({
    title: DataTypes.ENUM("Mr","Mrs", "Miss", "Ms"),
    name: DataTypes.STRING(100),
    email: DataTypes.STRING(100),
    mobile: DataTypes.STRING(15),
    picture: DataTypes.STRING(255),
    status: DataTypes.INTEGER(11),
    roleId: DataTypes.INTEGER(11),
    password: DataTypes.STRING(255),
  }, {
    sequelize,
    modelName: 'Staff',
  });
  return Staff;
};
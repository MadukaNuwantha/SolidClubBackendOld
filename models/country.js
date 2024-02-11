'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Country.init({
    name: DataTypes.STRING(255),
    phone: DataTypes.INTEGER(5),
    status: DataTypes.TINYINT(1)
  }, {
    sequelize,
    modelName: 'Country',
  });
  return Country;
};
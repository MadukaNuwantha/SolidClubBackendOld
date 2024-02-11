'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      City.belongsTo(models.District, {
        foreignKey: 'districtId',
        targetKey: 'id'
      });
    }
  }
  City.init({
    districtId: DataTypes.INTEGER(11),
    name: DataTypes.STRING(100),
    gpLocation: DataTypes.STRING(10),
    status: DataTypes.TINYINT(1)
  }, {
    sequelize,
    modelName: 'City',
  });
  return City;
};
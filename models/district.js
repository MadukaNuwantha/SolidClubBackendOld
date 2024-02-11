'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class District extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      District.hasMany(models.City, {
        foreignKey: 'districtId'
      });
    }
  }
  District.init({
    name: DataTypes.STRING(100),
    status: DataTypes.TINYINT(1)
  }, {
    sequelize,
    modelName: 'District',
  });
  return District;
};
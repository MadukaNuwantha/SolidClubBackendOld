'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TechnicianCity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TechnicianCity.belongsTo(models.City, {
        foreignKey: 'cityId',
        targetKey: 'id'
      });
      TechnicianCity.belongsTo(models.Technician, {
        foreignKey: 'technicianId',
        targetKey: 'id'
      });
    }
  }
  TechnicianCity.init({
    technicianId: DataTypes.INTEGER(11),
    cityId: DataTypes.INTEGER(11),
    status: DataTypes.TINYINT(1)
  }, {
    sequelize,
    modelName: 'TechnicianCity',
  });
  return TechnicianCity;
};
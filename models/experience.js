'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Experience extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Experience.belongsTo(models.JobType, {
        foreignKey: 'jobTypeId',
        targetKey: 'id'
      });
      Experience.belongsTo(models.Technician, {
        foreignKey: 'technicianId',
        targetKey: 'id'
      });
    }
  }
  Experience.init({
    technicianId: DataTypes.INTEGER(11),
    jobTypeId: DataTypes.INTEGER(11),
    experienceYear: DataTypes.INTEGER(11),
    experienceMonth: DataTypes.INTEGER(11),
    status: DataTypes.TINYINT(1)
  }, {
    sequelize,
    modelName: 'Experience',
  });
  return Experience;
};
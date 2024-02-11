'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LevelsJobTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LevelsJobTypes.belongsTo(models.JobType, {
        foreignKey: 'jobTypeId',
        targetKey: 'id'
      });
      LevelsJobTypes.belongsTo(models.Level, {
        foreignKey: 'LevelId',
        targetKey: 'id'
      });
    }
  }
  LevelsJobTypes.init({
    LevelId: DataTypes.INTEGER(11),
    jObTypeId: DataTypes.INTEGER(11),
    status: DataTypes.TINYINT(1)
  }, {
    sequelize,
    modelName: 'LevelsJobTypes',
  });
  return LevelsJobTypes;
};
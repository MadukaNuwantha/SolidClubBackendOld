'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LevelCriteria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LevelCriteria.belongsTo(models.Level, {
        foreignKey: 'levelId',
        targetKey: 'id'
      });
      LevelCriteria.belongsTo(models.Tenant, {
        foreignKey: 'tenantId',
        targetKey: 'id'
      });
    }
  }
  LevelCriteria.init({
    tenantId: DataTypes.INTEGER(11),
    levelId: DataTypes.INTEGER(11),
    name: DataTypes.STRING(100),
    expectedOutComes: DataTypes.STRING(255),
    status: DataTypes.TINYINT(1)
  }, {
    sequelize,
    modelName: 'LevelCriteria',
  });
  return LevelCriteria;
};
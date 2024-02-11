'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Level extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Level.hasMany(models.TechnicianTenantLevel, {
        foreignKey: 'levelId',
        sourceKey: 'id'
      });

      Level.hasMany(models.LevelCriteria, {
        foreignKey: 'levelId',
        sourceKey: 'id'
      });

      Level.hasMany(models.LevelsJobTypes, {
        foreignKey: 'levelId',
        sourceKey: 'id'
      });
    }
  }
  Level.init({
    name: DataTypes.STRING(100),
    description: DataTypes.STRING(500),
    rank: DataTypes.TINYINT(1),
    editable: DataTypes.TINYINT(1),
    status: DataTypes.TINYINT(1)
  }, {
    sequelize,
    modelName: 'Level',
  });
  return Level;
};
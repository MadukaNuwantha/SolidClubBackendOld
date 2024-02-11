'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      JobType.hasMany(models.JobsJobType, {
        foreignKey: 'jobTypeId',
        sourceKey: 'id'
      });

      JobType.hasMany(models.JobTypesProductTypes, {
        foreignKey: 'jobTypeId',
        sourceKey: 'id'
      });
      JobType.hasMany(models.LevelsJobTypes, {
        foreignKey: 'jobTypeId',
        sourceKey: 'id'
      });
    }
  }
  JobType.init({
    name: DataTypes.STRING(100),
    description: DataTypes.STRING(300),
    status: DataTypes.TINYINT(1)
  }, {
    sequelize,
    modelName: 'JobType',
  });
  return JobType;
};
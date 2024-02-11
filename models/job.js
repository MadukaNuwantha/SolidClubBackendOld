'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Job.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id'
      });
      Job.belongsTo(models.City, {
        foreignKey: 'cityId',
        targetKey: 'id'
      });
      Job.belongsTo(models.JobStatus, {
        foreignKey: 'jobStatusId',
        targetKey: 'id'
      });

      Job.hasMany(models.JobsJobType, {
        foreignKey: 'jobId',
        sourceKey: 'id'
      });

      Job.hasMany(models.JobPicture, {
        foreignKey: 'jobId',
        sourceKey: 'id'
      });
    }
  }
  Job.init({
    userId: DataTypes.INTEGER(11),
    cityId: DataTypes.INTEGER(11),
    jobStatusId: DataTypes.INTEGER(11),
    address: DataTypes.STRING(255),
    gpLocation: DataTypes.STRING(10),
    startDate: DataTypes.DATE,
    budget: DataTypes.FLOAT(18,2),
    notes: DataTypes.STRING(255),
  }, {
    sequelize,
    modelName: 'Job',
  });
  return Job;
};
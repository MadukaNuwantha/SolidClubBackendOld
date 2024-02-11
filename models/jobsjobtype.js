'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobsJobType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      JobsJobType.belongsTo(models.JobType, {
        foreignKey: 'jobTypeId',
        targetKey: 'id'
      });
      
      JobsJobType.belongsTo(models.Job, {
        foreignKey: 'jobId',
        targetKey: 'id'
      });

      JobsJobType.hasMany(models.TechnicianJobs, {
        foreignKey: 'jobsJobTypeId',
        sourceKey: 'id'
      });
    }
  }
  JobsJobType.init({
    jobTypeId: DataTypes.INTEGER(11),
    jobId: DataTypes.INTEGER(11),
  }, {
    sequelize,
    modelName: 'JobsJobType',
  });
  return JobsJobType;
};
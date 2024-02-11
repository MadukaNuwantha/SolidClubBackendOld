'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TechnicianJobs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TechnicianJobs.belongsTo(models.JobsJobType, {
        foreignKey: 'jobsJobTypeId',
        targetKey: 'id'
      });
      
      TechnicianJobs.belongsTo(models.Technician, {
        foreignKey: 'technicianId',
        targetKey: 'id'
      });

      TechnicianJobs.belongsTo(models.TechnicianJobStatus, {
        foreignKey: 'technicianJobStatusId',
        targetKey: 'id'
      });
    }
  }
  TechnicianJobs.init({
    jobsJobTypeId: DataTypes.INTEGER(11),
    technicianId: DataTypes.INTEGER(11),
    technicianJobStatusId: DataTypes.INTEGER(11),
    technicianComment: DataTypes.STRING(255),
    userComment: DataTypes.STRING(255),
    technicianRating: DataTypes.TINYINT(1),
    userRating: DataTypes.TINYINT(1),
    status: DataTypes.TINYINT(1)
  }, {
    sequelize,
    modelName: 'TechnicianJobs',
  });
  return TechnicianJobs;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Technician extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Technician.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id'
      });
      Technician.belongsTo(models.EducationLevel, {
        foreignKey: 'educationLevelId',
        targetKey: 'id'
      });

      Technician.hasMany(models.TechnicianJobs, {
        foreignKey: 'technicianId',
        sourceKey: 'id'
      });
      Technician.hasMany(models.TechnicianCity, {
        foreignKey: 'technicianId',
        sourceKey: 'id'
      });
      Technician.hasMany(models.TechnicianTenantLevel, {
        foreignKey: 'technicianId',
        sourceKey: 'id'
      });
      Technician.hasMany(models.OldJob, {
        foreignKey: 'technicianId',
        sourceKey: 'id'
      });
      Technician.hasMany(models.Experience, {
        foreignKey: 'technicianId',
        sourceKey: 'id'
      });

    }
  }
  Technician.init({
    userId: DataTypes.INTEGER(11),
    educationLevelId: DataTypes.INTEGER(11),
    nicNumber: DataTypes.STRING(15),
    nicFrontpicture: DataTypes.STRING(255),
    nicBackpicture: DataTypes.STRING(255),
    noOfWorkers: DataTypes.INTEGER(11),
    averageMonthlyWork: DataTypes.INTEGER(11),
    qrImage: DataTypes.STRING(255),
    source: DataTypes.ENUM("SolidClub","Tenant", "Technician"),
  }, {
    sequelize,
    modelName: 'Technician',
  });
  return Technician;
};
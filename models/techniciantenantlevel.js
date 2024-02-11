'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TechnicianTenantLevel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TechnicianTenantLevel.belongsTo(models.Technician, {
        foreignKey: 'technicianId',
        targetKey: 'id'
      });
      TechnicianTenantLevel.belongsTo(models.Level, {
        foreignKey: 'levelId',
        targetKey: 'id'
      });
      TechnicianTenantLevel.belongsTo(models.Tenant, {
        foreignKey: 'tenantId',
        targetKey: 'id'
      });
    }
  }
  TechnicianTenantLevel.init({
    technicianId: DataTypes.INTEGER(11),
    tenantId: DataTypes.INTEGER(11),
    levelId: DataTypes.INTEGER(11),
    reason: DataTypes.STRING(500),
    status: DataTypes.TINYINT(1)
  }, {
    sequelize,
    modelName: 'TechnicianTenantLevel',
  });
  return TechnicianTenantLevel;
};
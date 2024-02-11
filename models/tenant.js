'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tenant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tenant.hasMany(models.TechnicianTenantLevel, {
        foreignKey: 'tenantId',
        sourceKey: 'id'
      });
      Tenant.hasMany(models.LevelCriteria, {
        foreignKey: 'tenantId',
        sourceKey: 'id'
      });
    }
  }
  Tenant.init({
    t_id: DataTypes.INTEGER(11),
    name: DataTypes.STRING(100),
    logo: DataTypes.STRING(255),
    status: DataTypes.TINYINT(1)
  }, {
    sequelize,
    modelName: 'Tenant',
  });
  return Tenant;
};
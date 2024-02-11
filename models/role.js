'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.belongsTo(models.Role, {
        foreignKey: 'parentRoleId'
      });
      Role.hasMany(models.User, {
        foreignKey: 'roleId'
      });
      Role.hasMany(models.Staff, {
        foreignKey: 'roleId'
      });
    }
  }
  Role.init({
    parentRoleId: DataTypes.INTEGER(11),
    name: DataTypes.STRING(100),
    editable: DataTypes.TINYINT(1),
    status: DataTypes.TINYINT(1)
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};
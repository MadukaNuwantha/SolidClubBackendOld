'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OldJob extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OldJob.belongsTo(models.Technician, {
        foreignKey: 'technicianId',
        targetKey: 'id'
      });
    }
  }
  OldJob.init({
    technicianId: DataTypes.INTEGER(11),
    picture: DataTypes.STRING(255),
    status: DataTypes.TINYINT(1)
  }, {
    sequelize,
    modelName: 'OldJob',
  });
  return OldJob;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobTypesProductTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      JobTypesProductTypes.belongsTo(models.JobType, {
        foreignKey: 'jobTypeId',
        targetKey: 'id'
      });
      JobTypesProductTypes.belongsTo(models.ProductType, {
        foreignKey: 'productTypeId',
        targetKey: 'id'
      });
    }
  }
  JobTypesProductTypes.init({
    jobTypeId: DataTypes.INTEGER(11),
    productTypeId: DataTypes.INTEGER(11),
    status: DataTypes.TINYINT(1)
  }, {
    sequelize,
    modelName: 'JobTypesProductTypes',
  });
  return JobTypesProductTypes;
};
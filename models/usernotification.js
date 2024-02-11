'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserNotification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserNotification.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id'
      });
    }
  }
  UserNotification.init({
    userId: DataTypes.INTEGER(11),
    type: DataTypes.ENUM("profile","job", "purchase"),
    objectId: DataTypes.INTEGER(11),
    subject: DataTypes.STRING(255),
    message: DataTypes.STRING(255),
    notifier: DataTypes.STRING(255),
    status: DataTypes.TINYINT(1)
  }, {
    sequelize,
    modelName: 'UserNotification',
  });
  return UserNotification;
};
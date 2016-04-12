/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FATUser', {
    Row_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true, 
      autoIncrement: true
    },
    UserName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    IsStudent: {
      type: DataTypes.INTEGER(6),
      allowNull: false
    },
    IsTeacher: {
      type: DataTypes.INTEGER(6),
      allowNull: false
    },
    IsAdmin: {
      type: DataTypes.INTEGER(6),
      allowNull: false
    },
    CurrStatus: {
      type: DataTypes.INTEGER(6),
      allowNull: false
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.NOW
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    UserCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    School: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
    paranoid: false,
    freezeTableName: true,
  });
};

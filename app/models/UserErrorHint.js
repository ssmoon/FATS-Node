/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserErrorHint', {
    Row_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true, 
      autoIncrement: true
    },
    TmpRoutineID: {
      type: DataTypes.STRING,
      allowNull: false
    },
    TmpNodeID: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ItemName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ItemValue: {
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

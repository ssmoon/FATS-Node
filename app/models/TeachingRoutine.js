/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TeachingRoutine', {
    Row_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true, 
      autoIncrement: true
    },
    TmpRoutineID: {
      type: DataTypes.STRING,
      allowNull: true
    },
    CaseName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    CurrStatus: {
      type: DataTypes.INTEGER(6),
      allowNull: false,
      defaultValue: 1
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

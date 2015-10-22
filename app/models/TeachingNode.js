/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TeachingNode', {
    Row_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    TmpNodeID: {
      type: DataTypes.STRING,
      allowNull: true
    },
    RoutineID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    CurrStatus: {
      type: DataTypes.INTEGER(6),
      allowNull: false
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

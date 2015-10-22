/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('StudentActivity', {
    Row_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    UserID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    TimeMark: {
      type: DataTypes.DATE,
      allowNull: false
    },
    TchRoutineID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    TchNodeID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    IsFinished: {
      type: DataTypes.INTEGER(11),
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

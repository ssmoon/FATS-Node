/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SubjectItem', {
    Row_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    SubjectName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    SubjectType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ChangeOrient: {
      type: DataTypes.STRING,
      allowNull: true
    },
    SubjectOrient: {
      type: DataTypes.STRING,
      allowNull: true
    },
    SubSubject: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    NextLedger: {
      type: DataTypes.STRING,
      allowNull: true
    },
    TchRoutineID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    TchNodeID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    RoutineDesc: {
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

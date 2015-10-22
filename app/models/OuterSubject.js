/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('OuterSubject', {
    Row_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
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
    },
    TimeMark: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ClientAcc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Abstract: {
      type: DataTypes.STRING,
      allowNull: true
    },
    MoneyAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    SubjectName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    BankName: {
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

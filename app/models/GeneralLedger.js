/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('GeneralLedger', {
    Row_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    BalanceSum: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    BalanceOrient: {
      type: DataTypes.INTEGER(6),
      allowNull: false
    },
    SubjectName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    DebitSum: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    CreditSum: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    Abstract: {
      type: DataTypes.STRING,
      allowNull: true
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
    BalanceAbstract: {
      type: DataTypes.STRING,
      allowNull: true
    },
    FinalSum: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    RoutineDesc: {
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
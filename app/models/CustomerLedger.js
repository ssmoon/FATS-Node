/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CustomerLedger', {
    Row_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    TimeMark: {
      type: DataTypes.DATE,
      allowNull: false
    },
    BalanceSum: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    BalanceAbstract: {
      type: DataTypes.STRING,
      allowNull: true
    },
    BalanceTime: {
      type: DataTypes.DATE,
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
    FinalSum: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    VoucherNo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    DCChoice: {
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
    CustomerName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    CustomerAccNo: {
      type: DataTypes.STRING,
      allowNull: true
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

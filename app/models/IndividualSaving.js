/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('IndividualSaving', {
    Row_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    DepositTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    DepositClient: {
      type: DataTypes.STRING,
      allowNull: true
    },
    BankName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    WithdrawTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    WithdrawClient: {
      type: DataTypes.STRING,
      allowNull: true
    },
    InterestClient: {
      type: DataTypes.STRING,
      allowNull: true
    },
    AccountCreateTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    InterestTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    VoucherNo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    InterestAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    EntryAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    ClientAcc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    TchRoutineID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    TchRoutineTag: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ClientName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    DepositPeriod: {
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

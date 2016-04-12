/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CashJournal', {
    Row_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true, 
      autoIncrement: true
    },
    TchRoutineID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    TchNodeID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    VoucherNo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    CounterSubject: {
      type: DataTypes.STRING,
      allowNull: true
    },
    TimeMark: {
      type: DataTypes.DATE,
      allowNull: false
    },
    MoneyAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    CashOrient: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ClientAcc: {
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

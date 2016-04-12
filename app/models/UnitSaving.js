/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UnitSaving', {
    Row_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true, 
      autoIncrement: true
    },
    ClientName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    BankName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    VoucherNo: {
      type: DataTypes.STRING,
      allowNull: true
    },   
    InterestAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    EntryAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    ClientAcc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    MoneySource: {
      type: DataTypes.STRING,
      allowNull: true
    },
    TimeMark: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Purpose: {
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

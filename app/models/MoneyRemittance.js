/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MoneyRemittance', {
    Row_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true, 
      autoIncrement: true
    },
    RemitterName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    RemitterAcc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    RemitterBank: {
      type: DataTypes.STRING,
      allowNull: true
    },
    PayeeName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    PayeeAcc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    PayeeBank: {
      type: DataTypes.STRING,
      allowNull: true
    },
    MoneyAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    SettlementNo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    RemitDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    AffluxDate: {
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

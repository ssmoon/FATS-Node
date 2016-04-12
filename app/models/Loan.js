/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Loan', {
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
    MoneyAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    InterestAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    InterestRate: {
      type: DataTypes.DOUBLE(12, 3),
      allowNull: false
    },   
    LoanType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    LoanAcc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    RepayAcc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    LoanDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    RepayDate: {
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

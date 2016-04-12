/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DetailedLedger', {
    Row_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true, 
      autoIncrement: true
    },
    BalanceSum: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    BalanceOrient: {
      type: DataTypes.INTEGER(6),
      allowNull: false
    },
    BalanceAbstract: {
      type: DataTypes.STRING,
      allowNull: true
    },
    SubjectName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    DebitSum: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    CreditSum: {
      type: DataTypes.DECIMAL(12, 2),
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
    FinalSum: {
      type: DataTypes.DECIMAL(12, 2),
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

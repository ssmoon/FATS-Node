/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Discounting', {
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
    TimeMark: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ClientAcc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    BankName: {
      type: DataTypes.STRING,
      allowNull: true
    }, 
    EntryAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    DiscountInterest: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    DiscountAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    DiscountRate: {
      type: DataTypes.DOUBLE(12, 3),
      allowNull: false
    },  
   
    AcceptBank: {
      type: DataTypes.STRING,
      allowNull: true
    },
    VoucherNo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    VoucherType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    DraftDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    DueDate: {
      type: DataTypes.DATE,
      allowNull: false
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
